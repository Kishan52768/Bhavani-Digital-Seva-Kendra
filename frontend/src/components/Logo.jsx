export const ChakraMark = ({ className = "", spin = false }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    className={`${className} ${spin ? "animate-spin-slow" : ""}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="chakra-s" x1="0" y1="0" x2="64" y2="64">
        <stop stopColor="#FF9933" />
        <stop offset="1" stopColor="#FFB866" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="24" stroke="url(#chakra-s)" strokeWidth="3" />
    <circle cx="32" cy="32" r="17" stroke="rgba(255,153,51,0.3)" strokeWidth="1.5" />
    <g stroke="#FF9933" strokeWidth="2.4" strokeLinecap="round">
      {[...Array(12)].map((_, i) => (
        <line
          key={i}
          x1="32"
          y1="10"
          x2="32"
          y2="20"
          transform={`rotate(${i * 30} 32 32)`}
        />
      ))}
    </g>
    <path
      d="M56 32 A24 24 0 0 1 32 56"
      stroke="#2EA84F"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="32" cy="32" r="5" fill="#2EA84F" />
  </svg>
);

const Logo = ({ compact = false }) => (
  <a
    href="#home"
    className="group flex items-center gap-3"
    data-testid="logo-link"
    aria-label="CSC Bhavani Digital Seva Kendra — home"
  >
    <ChakraMark className="h-10 w-10 transition-transform duration-500 group-hover:rotate-45" />
    {!compact && (
      <span className="leading-none">
        <span className="block font-display text-lg font-bold tracking-tight text-white">
          CSC Bhavani
        </span>
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.28em] text-slate-400">
          Digital Seva Kendra
        </span>
      </span>
    )}
  </a>
);

export default Logo;
