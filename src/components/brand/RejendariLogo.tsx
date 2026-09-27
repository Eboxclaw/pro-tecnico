type LogoProps = {
  className?: string;
  inverted?: boolean;
  compact?: boolean;
  showTagline?: boolean;
};

export function RejendariMark({ className = "", inverted = false }: Pick<LogoProps, "className" | "inverted">) {
  const ink = inverted ? "#f5f0e5" : "#24211d";
  const frame = inverted ? "#f5f0e5" : "#24211d";

  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="REJENDARI">
      <rect x="7.5" y="7.5" width="49" height="49" rx="3" fill="none" stroke={frame} strokeWidth="1.5" opacity=".18" />
      <path
        d="M18 48V16h14.2c8.2 0 13.5 4.4 13.5 11.3 0 5.1-3.1 8.9-8.3 10.2L47 48h-9.1l-8.1-9.5H26V48h-8Zm8-25.5v9.4h5.8c3.8 0 6-1.8 6-4.8 0-3-2.2-4.6-6-4.6H26Z"
        fill={ink}
      />
      <path d="M11 52 53 12" fill="none" stroke="#b54530" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M45.5 9.5H54.5V18.5" fill="none" stroke="#d35a42" strokeWidth="1.8" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

export function RejendariLogo({
  className = "",
  inverted = false,
  compact = false,
  showTagline = true,
}: LogoProps) {
  const inkClass = inverted ? "text-[#f5f0e5]" : "text-[#24211d]";
  const mutedClass = inverted ? "text-white/48" : "text-black/46";

  if (compact) {
    return <RejendariMark inverted={inverted} className={`h-10 w-10 ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <RejendariMark inverted={inverted} className="h-11 w-11 shrink-0" />
      <div className="min-w-0">
        <div
          className={`whitespace-nowrap font-display text-[1.35rem] font-bold leading-none tracking-[-0.065em] sm:text-[1.52rem] ${inkClass}`}
          aria-label="REJENDARI"
        >
          <span>REJEND</span>
          <span className="relative inline-block">
            A
            <span className="absolute -bottom-[0.18em] left-[18%] h-[2px] w-[68%] bg-[#b54530]" aria-hidden="true" />
          </span>
          <span>RI</span>
        </div>
        {showTagline && (
          <div className={`mt-1.5 flex items-center gap-2 whitespace-nowrap font-mono text-[6.5px] uppercase tracking-[0.17em] ${mutedClass}`}>
            <span className="font-sans text-[8px] tracking-[0.08em]">選定工具</span>
            <span aria-hidden="true">·</span>
            <span>japan first · portugal ready</span>
          </div>
        )}
      </div>
    </div>
  );
}
