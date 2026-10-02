import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import Logo from "./Logo";
import { CONTACT, NAV_LINKS } from "../data/content";
import { EASE } from "./Reveal";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "border-b border-white/10 bg-ink/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="tricolor-bar h-[3px] w-full opacity-80" />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-[72px] md:px-8">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-testid={`nav-link-${link.href.replace("#", "")}`}
                className="group relative font-body text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-saffron transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={CONTACT.tel}
              data-testid="navbar-call-button"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 font-body text-sm font-semibold text-slate-100 transition-colors hover:border-saffron/60 hover:text-saffron"
            >
              <Phone className="h-4 w-4" />
              {CONTACT.phoneDisplay}
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="navbar-whatsapp-button"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-whatsapp px-4 font-body text-sm font-bold text-ink transition-transform duration-300 hover:scale-[1.04]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>

          <button
            onClick={() => setOpen(!open)}
            data-testid="navbar-mobile-menu-button"
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-100 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink/95 px-6 pb-10 pt-28 backdrop-blur-2xl lg:hidden"
            data-testid="mobile-menu"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.06 * i }}
                  onClick={() => setOpen(false)}
                  data-testid={`mobile-nav-link-${link.href.replace("#", "")}`}
                  className="border-b border-white/8 py-4 font-display text-3xl font-bold text-white"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <a
                href={CONTACT.tel}
                onClick={() => setOpen(false)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-saffron font-body font-bold text-ink"
              >
                <Phone className="h-4 w-4" /> Call {CONTACT.phoneDisplay}
              </a>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp font-body font-bold text-ink"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
