import { useEffect, useState } from "react";
import axios from "axios";
import {
  Download,
  FileText,
  Loader2,
  LogOut,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import Logo from "./Logo";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

const fmtSize = (b) =>
  b == null ? "—" : b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

// On an expired access token, silently refresh the session once and retry.
const authFetch = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    if (err.response?.status === 401) {
      await axios.post(`${API}/auth/refresh`, {}, { withCredentials: true });
      return await fn();
    }
    throw err;
  }
};

const AdminPage = () => {
  const [user, setUser] = useState(null); // null = checking, false = logged out
  const [uploads, setUploads] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    authFetch(() => axios.get(`${API}/auth/me`, { withCredentials: true }))
      .then((r) => setUser(r.data))
      .catch(() => setUser(false));
  }, []);

  useEffect(() => {
    if (user) loadUploads();
  }, [user]);

  const loadUploads = async () => {
    setLoadingList(true);
    try {
      const { data } = await authFetch(() =>
        axios.get(`${API}/admin/uploads`, { withCredentials: true })
      );
      setUploads(data.uploads || []);
    } catch {
      toast.error("Could not load uploads — please log in again");
    } finally {
      setLoadingList(false);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await axios.post(
        `${API}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(data);
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await axios
      .post(`${API}/auth/logout`, {}, { withCredentials: true })
      .catch(() => {});
    setUser(false);
  };

  const download = async (u) => {
    try {
      const res = await authFetch(() =>
        axios.get(`${API}/uploads/${u.id}/download`, {
          withCredentials: true,
          responseType: "blob",
        })
      );
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = u.original_filename || "document";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed — please log in again");
    }
  };

  const remove = async (u) => {
    try {
      await authFetch(() =>
        axios.delete(`${API}/admin/uploads/${u.id}`, { withCredentials: true })
      );
      setUploads((prev) => prev.filter((x) => x.id !== u.id));
      toast.success("Upload deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <Loader2 className="h-8 w-8 animate-spin text-saffron" />
      </div>
    );
  }

  if (user === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-5">
        <form
          onSubmit={login}
          data-testid="admin-login-form"
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-ink-elevated/80 p-8 shadow-card"
        >
          <Logo />
          <h1 className="mt-6 font-display text-xl font-bold text-white">
            Admin Login
          </h1>
          <p className="mt-1 font-body text-xs text-slate-400">
            Uploads &amp; document requests panel
          </p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            autoComplete="username"
            placeholder="Admin email"
            data-testid="admin-email-input"
            className="mt-6 h-12 w-full rounded-xl border border-white/10 bg-ink-surface/80 px-4 font-body text-sm text-slate-100 placeholder:text-slate-500 focus:border-saffron/60 focus:outline-none"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            data-testid="admin-password-input"
            className="mt-3 h-12 w-full rounded-xl border border-white/10 bg-ink-surface/80 px-4 font-body text-sm text-slate-100 placeholder:text-slate-500 focus:border-saffron/60 focus:outline-none"
          />
          {error && (
            <p
              data-testid="admin-login-error"
              className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 font-body text-xs text-red-300"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            data-testid="admin-login-button"
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-saffron font-body text-sm font-bold text-ink transition-transform duration-300 enabled:hover:scale-[1.02] disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? "Signing in…" : "Sign In"}
          </button>
          <a
            href="/"
            data-testid="admin-back-home-link"
            className="mt-4 block text-center font-body text-xs text-slate-400 transition-colors hover:text-saffron"
          >
            ← Back to website
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink px-5 py-8 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
              {user.email}
            </span>
            <button
              onClick={logout}
              data-testid="admin-logout-button"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 font-body text-xs font-semibold text-slate-200 transition-colors hover:border-saffron/60 hover:text-saffron"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <h1
            data-testid="admin-uploads-heading"
            className="font-display text-2xl font-bold text-white"
          >
            Customer Uploads
          </h1>
          <span className="rounded-full border border-saffron/30 bg-saffron/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-saffron">
            {uploads.length} file{uploads.length === 1 ? "" : "s"}
          </span>
        </div>

        {loadingList ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-saffron" />
          </div>
        ) : uploads.length === 0 ? (
          <div
            data-testid="admin-empty-state"
            className="mt-8 flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-ink-surface/60 py-16 text-center"
          >
            <Upload className="h-8 w-8 text-slate-600" />
            <p className="font-body text-sm text-slate-400">
              No uploads yet. Documents customers send from the website will
              appear here.
            </p>
          </div>
        ) : (
          <div data-testid="admin-uploads-table" className="mt-8 space-y-3">
            {uploads.map((u) => (
              <div
                key={u.id}
                data-testid={`upload-row-${u.id}`}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/8 bg-ink-surface/80 p-4 md:p-5"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron/10 text-saffron">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-sm font-semibold text-white">
                    {u.name}{" "}
                    <span className="font-normal text-slate-400">
                      · {u.phone}
                    </span>
                  </p>
                  <p className="mt-0.5 truncate font-body text-xs text-slate-400">
                    {u.service} · {u.original_filename} · {fmtSize(u.size)}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    {fmtDate(u.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => download(u)}
                    data-testid={`download-upload-${u.id}`}
                    aria-label={`Download ${u.original_filename}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-200 transition-colors hover:border-leaf/60 hover:text-leaf"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(u)}
                    data-testid={`delete-upload-${u.id}`}
                    aria-label={`Delete upload from ${u.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-200 transition-colors hover:border-red-400/60 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
