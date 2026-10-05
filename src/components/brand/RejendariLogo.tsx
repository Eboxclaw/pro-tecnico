type LogoProps = {
  className?: string;
  inverted?: boolean;
  compact?: boolean;
  showTagline?: boolean;
};

export function RejendariMark({
  className = "",
  inverted = false,
}: Pick<LogoProps, "className" | "inverted">) {
  const field = inverted ? "#f5f0e5" : "#1b1917";
  const letter = inverted ? "#1b1917" : "#f5f0e5";

  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="REJENDARI">
      <rect x="6" y="6" width="52" height="52" rx="2.5" fill={field} />
      <path
        d="M18 47V17h15.2c8.1 0 13.2 4.1 13.2 10.6 0 4.8-2.8 8.3-7.5 9.8L47 47h-8.7l-7.1-8.8H26V47h-8Zm8-23.8v8.5h6.4c3.8 0 5.9-1.5 5.9-4.3 0-2.8-2.1-4.2-5.9-4.2H26Z"
        fill={letter}
      />
      <rect x="44" y="12" width="8" height="8" fill="#6f5fd0" />
      <rect x="12" y="51" width="19" height="2" fill="#6f5fd0" opacity=".92" />
    </svg>
  );
}

export function RejendariLogo({
  className = "",
  inverted = false,
  compact = false,
  showTagline = true,
}: LogoProps) {
  const inkClass = inverted ? "text-[#f5f0e5]" : "text-[#1b1917]";
  const mutedClass = inverted ? "text-white/48" : "text-black/46";

  if (compact) {
    return <RejendariMark inverted={inverted} className={`h-10 w-10 ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <RejendariMark inverted={inverted} className="h-11 w-11 shrink-0" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`whitespace-nowrap font-display text-[1.34rem] font-bold leading-none tracking-[-0.045em] sm:text-[1.52rem] ${inkClass}`}
          >
            REJENDARI
          </span>
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-[#6f5fd0]" aria-hidden="true" />
        </div>
        {showTagline && (
          <div
            className={`mt-1.5 flex items-center gap-2 whitespace-nowrap font-mono text-[6.5px] uppercase tracking-[0.16em] ${mutedClass}`}
          >
            <span className="font-sans text-[8px] tracking-[0.07em]">選定工具</span>
            <span aria-hidden="true">/</span>
            <span>japan first</span>
            <span aria-hidden="true">/</span>
            <span>portugal ready</span>
          </div>
        )}
      </div>
    </div>
  );
}
