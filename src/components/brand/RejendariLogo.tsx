type LogoProps = {
  className?: string;
  inverted?: boolean;
  compact?: boolean;
  showTagline?: boolean;
};

export function RejendariMark({ className = "", inverted = false }: Pick<LogoProps, "className" | "inverted">) {
  const ink = inverted ? "#f5f0e5" : "#24211d";
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="REJENDARI">
      <path
        d="M51.5 18.5c-6.8-8.2-18-11.8-28-8.7C13.3 13 6.8 22.7 7.8 33.4c1.1 11.3 10.9 20.1 22.3 20.1 10.2 0 18.6-6.6 21.7-15.4"
        fill="none"
        stroke="#b54530"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M47.7 13.3c4.4 4.1 7.2 9.7 7.6 15.7"
        fill="none"
        stroke="#d35a42"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".68"
      />
      <path
        d="M20 17h12.7c8.1 0 12.9 4.1 12.9 10.2 0 4.8-2.9 8.3-7.8 9.7L47 48H37.8l-8-10h-2.9v10H20V17Zm7 6.2v8.7h5.3c3.9 0 6.1-1.6 6.1-4.4 0-2.9-2.1-4.3-6.1-4.3H27Z"
        fill={ink}
      />
    </svg>
  );
}

function RejendariA({ inverted = false }: { inverted?: boolean }) {
  const ink = inverted ? "#f5f0e5" : "#24211d";
  return (
    <svg viewBox="0 0 42 42" className="h-[0.88em] w-[0.86em] overflow-visible" aria-hidden="true">
      <path d="M4 36 19.8 5.5h5.3L38 36h-8.1l-2.8-7.3H15.5L12 36H4Zm14.2-13.7h6.2l-2.8-7.5-3.4 7.5Z" fill={ink} />
      <path d="m16.9 29.2 4.6-9.8 4.3 9.8h-8.9Z" fill="#b54530" />
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
          className={`flex items-baseline whitespace-nowrap font-display text-[1.36rem] font-bold leading-none tracking-[-0.085em] sm:text-[1.5rem] ${inkClass}`}
          aria-label="REJENDARI"
        >
          <span>REJEND</span>
          <RejendariA inverted={inverted} />
          <span>RI</span>
        </div>
        {showTagline && (
          <div className={`mt-1 flex items-center gap-2 whitespace-nowrap font-mono text-[6.5px] uppercase tracking-[0.18em] ${mutedClass}`}>
            <span className="font-sans text-[8px] tracking-[0.08em]">日本の工具</span>
            <span aria-hidden="true">·</span>
            <span>ferramenta profissional</span>
          </div>
        )}
      </div>
    </div>
  );
}
