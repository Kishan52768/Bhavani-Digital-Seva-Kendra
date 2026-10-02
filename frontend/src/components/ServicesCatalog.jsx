import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Phone, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Reveal, Eyebrow, EASE } from "./Reveal";
import { CATEGORIES, CONTACT, SERVICES, slug } from "../data/content";

const DOCS_NOTE =
  "Requirements vary by service — keep your Aadhaar / ID proof, address proof and passport-size photos handy, and call us to confirm exactly what you need.";

const ServicesCatalog = () => {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const syncHash = () => {
      const h = window.location.hash.replace("#", "");
      if (CATEGORIES.some((c) => c.id === h)) setActive(h);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter(
      (s) =>
        (active === "all" || s.category === active) &&
        (!q || s.name.toLowerCase().includes(q))
    );
  }, [active, query]);

  const categoryLabel = (id) =>
    CATEGORIES.find((c) => c.id === id)?.label ?? id;

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <Eyebrow>Our Services</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Every service,{" "}
                <span className="font-serif italic font-medium text-saffron">
                  one counter
                </span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.14} className="w-full md:w-72">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a service…"
                data-testid="services-search-input"
                className="h-11 w-full rounded-full border border-white/10 bg-ink-surface/80 pl-11 pr-4 font-body text-sm text-slate-100 placeholder:text-slate-500 focus:border-saffron/60 focus:outline-none"
              />
            </label>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-wrap gap-2">
            {[{ id: "all", label: "All" }, ...CATEGORIES].map((cat) => {
              const count =
                cat.id === "all"
                  ? SERVICES.length
                  : SERVICES.filter((s) => s.category === cat.id).length;
              const isActive = active === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  data-testid={`services-tab-${cat.id}`}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-body text-xs font-semibold transition-colors duration-300 sm:text-sm ${
                    isActive
                      ? "border-saffron bg-saffron text-ink"
                      : "border-white/10 bg-ink-surface/70 text-slate-300 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {cat.label}
                  <span
                    className={`font-mono text-[10px] ${
                      isActive ? "text-ink/70" : "text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <motion.div
          layout
          className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((service) => {
              const Icon = service.icon;
              return (
                <motion.button
                  layout
                  key={service.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelected(service)}
                  data-testid={`service-card-${slug(service.name)}`}
                  className="group rounded-2xl border border-white/8 bg-ink-surface/80 p-4 text-left transition-colors duration-300 hover:border-saffron/50 hover:shadow-saffron md:p-5"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-ink-elevated text-saffron transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-display text-sm font-bold leading-snug text-white sm:text-base">
                    {service.name}
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
                    {categoryLabel(service.category)}
                  </p>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <p
            data-testid="services-empty-state"
            className="mt-10 rounded-2xl border border-white/10 bg-ink-surface/70 p-8 text-center font-body text-sm text-slate-400"
          >
            No services match “{query}”. Try another name — or call us on{" "}
            {CONTACT.phoneDisplay}, we probably do it anyway.
          </p>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="border-white/10 bg-ink-elevated text-slate-100 sm:rounded-3xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl font-bold text-white">
                  {selected.name}
                </DialogTitle>
                <DialogDescription className="font-mono text-[11px] uppercase tracking-[0.2em] text-saffron">
                  {categoryLabel(selected.category)}
                </DialogDescription>
              </DialogHeader>
              <p className="font-body text-sm leading-relaxed text-slate-300">
                {selected.desc}
              </p>
              <div className="rounded-2xl border border-white/10 bg-ink-surface/80 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  What to keep ready
                </p>
                <p className="mt-2 font-body text-sm leading-relaxed text-slate-300">
                  {DOCS_NOTE}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={CONTACT.tel}
                  data-testid="service-dialog-call-button"
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-saffron font-body text-sm font-bold text-ink"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="service-dialog-whatsapp-button"
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-whatsapp/50 bg-whatsapp/10 font-body text-sm font-bold text-whatsapp transition-colors hover:bg-whatsapp hover:text-ink"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ServicesCatalog;
