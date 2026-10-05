import type { ReactNode } from "react";

/**
 * Cabeçalho único de secção REJENDARI: índice + rótulo JP + título + lede.
 * Substitui os seis estilos de kicker/título que coexistiam na homepage.
 */
export function SectionHeader({
  index,
  jp,
  title,
  lede,
  tone = "light",
  action,
}: {
  index?: string;
  jp: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "light" | "dark";
  action?: ReactNode;
}) {
  const accent = tone === "dark" ? "text-[#d4a53f]" : "text-primary";
  const body = tone === "dark" ? "text-white/58" : "text-muted-foreground";
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className={`jp-label ${accent}`}>
          {index && <span className="mr-3 font-mono">{index}</span>}
          {jp}
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
          {title}
        </h2>
        {lede && <p className={`mt-5 max-w-2xl text-sm leading-7 ${body}`}>{lede}</p>}
      </div>
      {action}
    </div>
  );
}
