from fastapi import FastAPI, APIRouter, File, Form, HTTPException, Request, Response, UploadFile
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone, timedelta

import bcrypt
import jwt
import requests

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ.get("JWT_SECRET")

# Object storage (Emergent integration)
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "bhavani-digital-seva-kendra"
storage_key = None


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if resp.status_code == 404:
        resp = requests.get(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": init_storage(force=True)},
            timeout=60,
        )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# Auth helpers
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    response.set_cookie(key="access_token", value=create_access_token(user_id, email), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=create_refresh_token(user_id, email), httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        token = request.query_params.get("auth")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"email": payload.get("email")})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return {"id": str(user["_id"]), "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")}


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})


async def is_locked_out(identifier: str) -> bool:
    window = (datetime.now(timezone.utc) - timedelta(minutes=15)).isoformat()
    count = await db.login_attempts.count_documents({"identifier": identifier, "created_at": {"$gte": window}})
    return count >= 5


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class LoginBody(BaseModel):
    email: str
    password: str


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# Auth endpoints
@api_router.post("/auth/login")
async def login(body: LoginBody, request: Request, response: Response):
    email = body.email.strip().lower()
    identifier = f"{request.client.host if request.client else 'unknown'}:{email}"
    if await is_locked_out(identifier):
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        await db.login_attempts.insert_one({"identifier": identifier, "created_at": datetime.now(timezone.utc).isoformat()})
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    await db.login_attempts.delete_many({"identifier": identifier})
    set_auth_cookies(response, str(user["_id"]), email)
    return {"id": str(user["_id"]), "email": email, "name": user.get("name", "Admin"), "role": user.get("role", "admin")}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me")
async def me(request: Request):
    return await get_current_user(request)


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"email": payload.get("email")})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    response.set_cookie(key="access_token", value=create_access_token(str(user["_id"]), user["email"]), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    return {"ok": True}


# Upload endpoints
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "pdf"}
MAX_UPLOAD_SIZE = 10 * 1024 * 1024


@api_router.post("/uploads")
async def upload_document(
    name: str = Form(...),
    phone: str = Form(...),
    service: str = Form(...),
    file: UploadFile = File(...),
):
    name = name.strip()
    digits = "".join(ch for ch in phone if ch.isdigit())
    service = service.strip()
    if not name or len(digits) < 10 or not service:
        raise HTTPException(status_code=400, detail="Name, a valid phone number and service are required")
    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP or PDF files are allowed")
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="The file is empty")
    if len(data) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="File is too large (max 10 MB)")
    path = f"{APP_NAME}/uploads/{digits}/{uuid.uuid4()}.{ext}"
    try:
        result = put_object(path, data, file.content_type or "application/octet-stream")
    except Exception as e:
        logger.error(f"Storage upload failed: {e}")
        raise HTTPException(status_code=502, detail="Upload failed, please try again")
    doc = {
        "id": str(uuid.uuid4()),
        "name": name,
        "phone": digits,
        "service": service,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type or "application/octet-stream",
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.uploads.insert_one(doc)
    return {"id": doc["id"], "message": "Upload received"}


@api_router.get("/admin/uploads")
async def list_uploads(request: Request):
    await get_current_user(request)
    docs = await db.uploads.find({"is_deleted": False}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return {"uploads": docs}


@api_router.get("/uploads/{file_id}/download")
async def download_upload(file_id: str, request: Request):
    await get_current_user(request)
    record = await db.uploads.find_one({"id": file_id, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = get_object(record["storage_path"])
    filename = (record.get("original_filename") or "document").replace('"', "")
    return Response(
        content=data,
        media_type=record.get("content_type") or content_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@api_router.delete("/admin/uploads/{file_id}")
async def delete_upload(file_id: str, request: Request):
    await get_current_user(request)
    result = await db.uploads.update_one({"id": file_id}, {"$set": {"is_deleted": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="File not found")
    return {"ok": True}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()
    try:
        init_storage()
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()