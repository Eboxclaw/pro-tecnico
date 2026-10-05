export function RejendariSeal({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rejendari-seal relative grid h-24 w-24 place-items-center rounded-full border border-primary/45 bg-[#f3ede1]/88 text-[#1b1917] shadow-[0_14px_35px_rgba(45,37,29,0.12)] backdrop-blur ${className}`}
      aria-label="REJENDARI Select"
    >
      <div className="absolute inset-2 rounded-full border border-primary/25" />
      <div className="relative text-center">
        <p className="font-mono text-[7px] uppercase tracking-[0.24em] text-primary">REJENDARI</p>
        <p className="mt-1 font-display text-lg font-bold tracking-[-0.06em]">SELECT</p>
        <p className="mt-1 font-sans text-[9px] font-semibold tracking-[0.08em] text-black/48">
          選定工具
        </p>
      </div>
    </div>
  );
}
