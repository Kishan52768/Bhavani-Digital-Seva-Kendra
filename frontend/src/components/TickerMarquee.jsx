import { MARQUEE_ITEMS } from "../data/content";

const Dots = ({ i }) => (
  <span className="inline-flex items-center gap-1" aria-hidden="true">
    <span className="h-1 w-1 rounded-full bg-saffron" />
    <span className="h-1 w-1 rounded-full bg-slate-300" />
    <span className="h-1 w-1 rounded-full bg-leaf" />
  </span>
);

const Track = ({ ariaHidden }) => (
  <div
    aria-hidden={ariaHidden}
    className="flex w-max shrink-0 items-center gap-10 pr-10"
  >
    {MARQUEE_ITEMS.map((item) => (
      <span
        key={item}
        className="flex items-center gap-10 font-mono text-xs uppercase tracking-[0.28em] text-slate-400"
      >
        {item}
        <Dots />
      </span>
    ))}
  </div>
);

const TickerMarquee = () => (
  <div
    className="group relative overflow-hidden border-y border-white/8 bg-ink-surface/50 py-5"
    data-testid="services-marquee"
  >
    <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
      <Track ariaHidden={false} />
      <Track ariaHidden={true} />
    </div>
    <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
    <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
  </div>
);

export default TickerMarquee;
