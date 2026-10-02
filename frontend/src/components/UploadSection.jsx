import { useRef, useState } from "react";
import axios from "axios";
import { FileUp, Loader2, Send, ShieldCheck, Clock, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { Reveal, Eyebrow } from "./Reveal";
import { SERVICES } from "../data/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const POINTS = [
  { icon: ShieldCheck, text: "Private & secure — used only for your requested service" },
  { icon: Clock, text: "Skip a trip — send documents from home" },
  { icon: PhoneCall, text: "We verify and call you back" },
];

const inputCls =
  "h-12 w-full rounded-xl border border-white/10 bg-ink-surface/80 px-4 font-body text-sm text-slate-100 placeholder:text-slate-500 focus:border-saffron/60 focus:outline-none";

const UploadSection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const fileRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please attach a document first");
      return;
    }
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("phone", phone);
      fd.append("service", service);
      fd.append("file", file);
      await axios.post(`${API}/uploads`, fd);
      toast.success("Documents received — we will call you back shortly");
      setName("");
      setPhone("");
      setService("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      const d = err.response?.data?.detail;
      toast.error(typeof d === "string" ? d : "Upload failed — please try again");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="documents" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Send Documents</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Send your documents,{" "}
              <span className="font-serif italic font-medium text-saffron">
                we handle the rest
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
              Upload your Aadhaar, photo, address proof or any document needed
              for your service — straight from your phone. We verify it and
              call you back to complete the work.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-8 space-y-4">
              {POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-leaf/10 text-leaf">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="pt-2 font-body text-sm text-slate-300">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form
            onSubmit={submit}
            data-testid="documents-upload-form"
            className="rounded-3xl border border-white/10 bg-ink-elevated/70 p-6 shadow-card backdrop-blur md:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                data-testid="documents-name-input"
                className={inputCls}
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                type="tel"
                inputMode="numeric"
                placeholder="Mobile number"
                data-testid="documents-phone-input"
                className={inputCls}
              />
            </div>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              data-testid="documents-service-select"
              className={`mt-4 ${inputCls} ${service ? "" : "text-slate-500"}`}
            >
              <option value="" disabled>
                Which service is this for?
              </option>
              {SERVICES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
              <option value="Other / Not sure">Other / Not sure</option>
            </select>

            <label
              data-testid="documents-file-input"
              className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-ink-surface/60 px-6 py-8 text-center transition-colors hover:border-saffron/50"
            >
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <FileUp className="h-7 w-7 text-saffron" />
              <span className="mt-3 font-body text-sm font-semibold text-white">
                {file ? file.name : "Tap to attach a document"}
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                JPG, PNG, WEBP or PDF · max 10 MB
              </span>
            </label>

            <button
              type="submit"
              disabled={sending}
              data-testid="documents-submit-button"
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-saffron font-body text-sm font-bold text-ink transition-transform duration-300 enabled:hover:scale-[1.02] disabled:opacity-60"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {sending ? "Sending…" : "Send Documents"}
            </button>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
              We call you back after verification
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default UploadSection;
