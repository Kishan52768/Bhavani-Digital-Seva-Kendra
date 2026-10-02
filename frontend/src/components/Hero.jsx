import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { ChakraMark } from "./Logo";
import { CONTACT } from "../data/content";
import { EASE } from "./Reveal";

export const getOpenStatus = () => {
  try {
    const ist = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const day = ist.getDay();
    const mins = ist.getHours() * 60 + ist.getMinutes();
    const within = day >= 1 && day <= 6 && mins >= 600 && mins < 1260;
    if (within)
      return { open: true, label: "Open now · closes 9:00 PM" };
    if (day === 0) return { open: false, label: "Closed · opens Monday 10:00 AM" };
    if (mins < 600)
      return { open: false, label: "Closed · opens 10:00 AM today" };
    return { open: false, label: "Closed · opens 10:00 AM tomorrow" };
  } catch {
    return { open: false, label: "Mon – Sat · 10:00 AM – 9:00 PM" };
  }
};

const Line = ({ children, delay }) => (
  <span className="block overflow-hidden pb-1">
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.span>
  </span>
);

const Hero = () => {
  const ref = useRef(null);
  const [status, setStatus] = useState(getOpenStatus);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const chakraY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setStatus(getOpenStatus()), 60000);
    return () => clearInterval(t);
  }, []);

  const onSpot = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-28 md:pt-32"
    >
      {/* backdrop */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-saffron/15 blur-[140px]" />
        <div className="absolute -bottom-52 -right-24 h-[560px] w-[560px] rounded-full bg-leaf/10 blur-[150px]" />
        <motion.div
          style={{ y: chakraY }}
          className="absolute right-[-140px] top-1/2 hidden -translate-y-1/2 opacity-[0.13] lg:block"
        >
          <ChakraMark spin className="h-[560px] w-[560px]" />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        {/* copy */}
        <motion.div style={{ opacity: fade }}>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-ink-surface/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-300 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
            </span>
            Common Service Center · Hubballi
          </motion.span>

          <h1 className="mt-7 font-display text-[2.7rem] font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-[4.4rem]">
            <Line delay={0.25}>Your Trusted</Line>
            <Line delay={0.37}>
              <span className="text-saffron">Digital</span>{" "}
              <span className="font-serif italic font-medium text-slate-100">
                Service
              </span>
            </Line>
            <Line delay={0.49}>
              Center<span className="text-leaf">.</span>
            </Line>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
            className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-400 sm:text-sm"
          >
            <span className="text-slate-200">Fast</span>
            <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
            <span className="text-slate-200">Reliable</span>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span className="text-slate-200">Affordable</span>
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
            <span>Government &amp; Digital Services</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href={CONTACT.tel}
              data-testid="call-now-button"
              className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-saffron px-6 font-body text-sm font-bold text-ink shadow-saffron transition-transform duration-300 hover:scale-[1.03]"
            >
              <Phone className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              Call Now
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="whatsapp-button"
              className="inline-flex h-12 items-center gap-2.5 rounded-full border border-whatsapp/50 bg-whatsapp/10 px-6 font-body text-sm font-bold text-whatsapp transition-colors duration-300 hover:bg-whatsapp hover:text-ink"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={CONTACT.directions}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="directions-button"
              className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/15 px-6 font-body text-sm font-semibold text-slate-100 transition-colors duration-300 hover:border-white/40"
            >
              <MapPin className="h-4 w-4 text-saffron" />
              Get Directions
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 1.15 }}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500"
          >
            <span><span className="text-saffron">39</span> services</span>
            <span><span className="text-slate-200">6</span> categories</span>
            <span><span className="text-leaf">Mon – Sat</span> · 10:00 AM – 9:00 PM</span>
          </motion.div>
        </motion.div>

        {/* visual */}
        <motion.div
          style={{ y: imgY }}
          initial={{ opacity: 0, scale: 0.94, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.55 }}
          className="relative hidden lg:block"
        >
          <div
            onMouseMove={onSpot}
            className="clip-frame relative overflow-hidden rounded-3xl border border-white/10 bg-ink-surface"
            data-testid="hero-visual"
          >
            <img
              src="https://images.unsplash.com/photo-1566112718365-4c8ccbedc3d9?q=85&auto=format&fit=crop&w=1200"
              alt="Digital service workstation at CSC Bhavani Digital Seva Kendra"
              className="h-[480px] w-full object-cover"
              loading="eager"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(300px circle at var(--mx, 70%) var(--my, 20%), rgba(255,153,51,0.22), transparent 70%)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          </div>

          <div
            data-testid="open-status-badge"
            className="absolute -left-6 top-8 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-elevated/90 px-4 py-3 shadow-card backdrop-blur-xl"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  status.open ? "animate-ping bg-leaf" : "bg-saffron"
                }`}
              />
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  status.open ? "bg-leaf" : "bg-saffron"
                }`}
              />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-200">
              {status.label}
            </span>
          </div>

          <div className="absolute -bottom-6 right-6 rounded-2xl border border-white/10 bg-ink-elevated/90 px-5 py-4 shadow-card backdrop-blur-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
              Popular at our centre
            </p>
            <p className="mt-1.5 font-display text-sm font-bold text-white">
              Aadhaar · PAN · DigiPay · Insurance
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
