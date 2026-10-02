import { useState } from "react";
import { ArrowUp, MapPin, MessageCircle, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Logo from "./Logo";
import { CONTACT } from "../data/content";

const EXPLORE = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Government Schemes", href: "#schemes" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const TOP_SERVICES = [
  { label: "Aadhaar Update", href: "#services" },
  { label: "PAN Card", href: "#services" },
  { label: "DigiPay Banking", href: "#banking" },
  { label: "Train Booking", href: "#services" },
  { label: "Insurance", href: "#services" },
  { label: "PVC Cards", href: "#services" },
];

const SOCIALS = [
  { icon: MessageCircle, href: CONTACT.whatsapp, label: "WhatsApp", id: "whatsapp" },
  { icon: Phone, href: CONTACT.tel, label: "Phone", id: "phone" },
  { icon: MapPin, href: CONTACT.directions, label: "Directions", id: "directions" },
];

const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const toTop = () =>
    window.__lenis
      ? window.__lenis.scrollTo(0)
      : window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-white/8 bg-ink-surface/40">
      <div className="tricolor-bar h-[3px] w-full opacity-60" />
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs font-body text-sm leading-relaxed text-slate-400">
              Trusted government and digital services under one roof — serving
              Hubballi with fast, reliable and affordable support.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label, id }) => (
                <a
                  key={id}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-testid={`footer-social-${id}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-colors hover:border-saffron hover:text-saffron"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Explore">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    data-testid={`footer-link-${l.href.replace("#", "")}`}
                    className="font-body text-sm text-slate-300 transition-colors hover:text-saffron"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Top services">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
              Services
            </p>
            <ul className="mt-4 space-y-2.5">
              {TOP_SERVICES.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    data-testid={`footer-service-${l.label
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}`}
                    className="font-body text-sm text-slate-300 transition-colors hover:text-saffron"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
              Reach Us
            </p>
            <ul className="mt-4 space-y-2.5 font-body text-sm text-slate-300">
              <li>{CONTACT.address}</li>
              <li>
                <a
                  href={CONTACT.tel}
                  data-testid="footer-phone-link"
                  className="transition-colors hover:text-saffron"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>Monday – Saturday · 10:00 AM – 9:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-7 sm:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
            © {new Date().getFullYear()} CSC Bhavani Digital Seva Kendra · All
            rights reserved
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setPrivacyOpen(true)}
              data-testid="footer-privacy-policy-button"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 transition-colors hover:text-saffron"
            >
              Privacy Policy
            </button>
            <a
              href="/admin"
              data-testid="footer-admin-link"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 transition-colors hover:text-saffron"
            >
              Admin
            </a>
            <button
              onClick={toTop}
              data-testid="back-to-top-button"
              aria-label="Back to top"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-colors hover:border-saffron hover:text-saffron"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="border-white/10 bg-ink-elevated text-slate-100 sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold text-white">
              Privacy Policy
            </DialogTitle>
            <DialogDescription className="font-mono text-[11px] uppercase tracking-[0.2em] text-saffron">
              CSC Bhavani Digital Seva Kendra
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 font-body text-sm leading-relaxed text-slate-300">
            <p>
              Your documents and personal details are used only to complete the
              service you request from our centre. We never sell or share your
              information with any third party for marketing purposes.
            </p>
            <p>
              Applications are submitted only on official government portals,
              and we keep nothing beyond what the service requires. Physical
              documents are handled carefully and returned to you.
            </p>
            <p>
              Questions about your data? Call us on {CONTACT.phoneDisplay} or
              visit the centre — we are happy to walk you through it.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
