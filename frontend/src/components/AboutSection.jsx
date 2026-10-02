import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { Reveal, Eyebrow, EASE } from "./Reveal";
import { getOpenStatus } from "./Hero";
import { CONTACT } from "../data/content";

const PILLARS = [
  "E-Governance & Certificates",
  "Banking & Money Transfer",
  "Insurance & Schemes",
  "Travel & Education",
];

const AboutSection = () => {
  const status = getOpenStatus();

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>About Us</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              Welcome to CSC Bhavani{" "}
              <span className="font-serif italic font-medium text-saffron">
                Digital Seva Kendra
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300">
              We provide trusted government and digital services under one
              roof. Our mission is to make government services accessible,
              simple, and affordable for everyone.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {PILLARS.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-ink-surface/70 px-4 py-3 font-body text-sm font-medium text-slate-200"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.28}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span
                data-testid="about-open-status"
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] ${
                  status.open
                    ? "border-leaf/40 bg-leaf/10 text-leaf"
                    : "border-saffron/40 bg-saffron/10 text-saffron"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                {status.label}
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-saffron" />
                Vikas Nagar, Hubballi
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <motion.div
            style={{ transform: "translateY(0)" }}
            whileHover={{ scale: 0.995 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="clip-frame relative overflow-hidden rounded-3xl border border-white/10"
            data-testid="about-visual"
          >
            <img
              src="https://images.unsplash.com/photo-1737574994780-e31827afaed7?q=85&auto=format&fit=crop&w=1200"
              alt="CSC operator processing an online government application"
              className="h-[420px] w-full object-cover transition-transform duration-700 hover:scale-105 md:h-[500px]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-ink-elevated/90 px-5 py-4 backdrop-blur-xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
                One roof. Every service.
              </p>
              <p className="mt-1 font-display text-sm font-bold text-white">
                {CONTACT.hours}
              </p>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutSection;
