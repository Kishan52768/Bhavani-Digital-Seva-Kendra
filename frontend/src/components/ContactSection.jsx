import { MapPin, MessageCircle, Phone, Copy } from "lucide-react";
import { toast } from "sonner";
import { Reveal, Eyebrow } from "./Reveal";
import { getOpenStatus } from "./Hero";
import { CONTACT } from "../data/content";

const ContactSection = () => {
  const status = getOpenStatus();

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.address);
      toast.success("Address copied to clipboard");
    } catch {
      toast.error("Could not copy — long-press to copy the address");
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Visit us in{" "}
              <span className="font-serif italic font-medium text-saffron">
                Hubballi
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-9 space-y-4">
              <div
                className="group flex items-start gap-4 rounded-2xl border border-white/8 bg-ink-surface/80 p-5"
                data-testid="contact-address-card"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron/10 text-saffron">
                  <MapPin className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Address
                  </p>
                  <p className="mt-1.5 font-body text-sm font-medium leading-relaxed text-slate-100">
                    {CONTACT.address}
                  </p>
                  <button
                    onClick={copyAddress}
                    data-testid="copy-address-button"
                    className="mt-2 inline-flex items-center gap-1.5 font-body text-xs font-semibold text-slate-400 transition-colors hover:text-saffron"
                  >
                    <Copy className="h-3 w-3" /> Copy address
                  </button>
                </div>
              </div>

              <a
                href={CONTACT.tel}
                data-testid="contact-phone-card"
                className="flex items-center gap-4 rounded-2xl border border-white/8 bg-ink-surface/80 p-5 transition-colors hover:border-saffron/40"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron/10 text-saffron">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Phone
                  </p>
                  <p className="mt-1.5 font-display text-lg font-bold text-white">
                    {CONTACT.phoneDisplay}
                  </p>
                </div>
              </a>

              <div
                className="rounded-2xl border border-white/8 bg-ink-surface/80 p-5"
                data-testid="contact-hours-card"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leaf/10 text-leaf">
                    <Clock />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Working Hours
                    </p>
                    <p className="mt-1.5 font-body text-sm font-semibold text-slate-100">
                      Monday – Saturday
                      <span className="mx-2 text-slate-500">·</span>
                      10:00 AM – 9:00 PM
                    </p>
                    <p
                      className={`mt-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
                        status.open ? "text-leaf" : "text-saffron"
                      }`}
                    >
                      {status.label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={CONTACT.tel}
                data-testid="contact-call-button"
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-saffron px-5 font-body text-sm font-bold text-ink transition-transform duration-300 hover:scale-[1.02]"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contact-whatsapp-button"
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-5 font-body text-sm font-bold text-ink transition-transform duration-300 hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="h-full">
          <div
            className="h-full min-h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-ink-surface"
            data-testid="contact-map"
          >
            <iframe
              title="CSC Bhavani Digital Seva Kendra — location map"
              src={CONTACT.mapEmbed}
              className="h-full min-h-[380px] w-full"
              style={{ border: 0, filter: "contrast(1.05) saturate(0.85)" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

function Clock() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default ContactSection;
