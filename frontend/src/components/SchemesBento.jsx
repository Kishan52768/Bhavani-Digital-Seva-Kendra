import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Reveal, Eyebrow, EASE } from "./Reveal";
import { CONTACT, SCHEMES, slug } from "../data/content";

const ACCENTS = {
  saffron: { text: "text-saffron", border: "hover:border-saffron/50", chip: "bg-saffron/10 text-saffron" },
  leaf: { text: "text-leaf", border: "hover:border-leaf/50", chip: "bg-leaf/10 text-leaf" },
  cyan: { text: "text-cyanhl", border: "hover:border-cyanhl/50", chip: "bg-cyanhl/10 text-cyanhl" },
};

const SPANS = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

const SchemesBento = () => {
  const [selected, setSelected] = useState(null);

  const schemeWhatsapp = (name) =>
    `https://wa.me/917406135366?text=${encodeURIComponent(
      `Hello, I want to apply for ${name}.`
    )}`;

  return (
    <section id="schemes" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Government Schemes</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Flagship schemes,{" "}
              <span className="font-serif italic font-medium text-saffron">
                applied for you
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              Walk in with your documents — we register, submit and track your
              application from start to finish.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-6">
          {SCHEMES.map((scheme, i) => {
            const Icon = scheme.icon;
            const a = ACCENTS[scheme.accent] || ACCENTS.saffron;
            return (
              <Reveal
                key={scheme.id}
                delay={0.06 * i}
                className={`${SPANS[i]} h-full`}
              >
                <motion.button
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  onClick={() => setSelected(scheme)}
                  data-testid={`scheme-card-${slug(scheme.name)}`}
                  className={`group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl border border-white/8 bg-ink-surface/80 p-6 text-left transition-colors duration-300 md:p-7 ${a.border}`}
                >
                  <span className="tricolor-bar absolute inset-x-0 top-0 h-[3px] opacity-70" />
                  <div className="flex items-start justify-between">
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-ink-elevated ${a.text}`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] ${a.chip}`}
                    >
                      {scheme.tag}
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                      {scheme.name}
                    </h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-slate-400">
                      {scheme.desc}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-body text-xs font-bold text-slate-300 transition-colors group-hover:text-white">
                    Enquire now
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </motion.button>
              </Reveal>
            );
          })}
        </div>
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
                  {selected.tag}
                </DialogDescription>
              </DialogHeader>
              <p className="font-body text-sm leading-relaxed text-slate-300">
                {selected.desc}
              </p>
              <ol className="space-y-3">
                {[
                  `Call or WhatsApp us on ${CONTACT.phoneDisplay} to confirm your eligibility and document list.`,
                  "Visit our centre with your Aadhaar, bank passbook and a passport-size photo.",
                  "We submit the application and track it until it reaches you.",
                ].map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-ink-surface/80 p-4 font-body text-sm text-slate-300"
                  >
                    <span className="font-mono text-xs font-bold text-saffron">
                      0{i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <a
                href={schemeWhatsapp(selected.name)}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="scheme-dialog-whatsapp-button"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-whatsapp font-body text-sm font-bold text-ink"
              >
                <MessageCircle className="h-4 w-4" /> Apply via WhatsApp
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SchemesBento;
