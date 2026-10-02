import { motion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1];

export const Reveal = ({ children, delay = 0, y = 28, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.9, ease: EASE, delay }}
  >
    {children}
  </motion.div>
);

export const Eyebrow = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.25em] text-saffron ${className}`}
  >
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
      <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
      <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
    </span>
    {children}
  </span>
);
