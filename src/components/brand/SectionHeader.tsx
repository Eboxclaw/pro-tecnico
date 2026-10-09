import type { ReactNode } from "react";

/**
 * USAR ESTE componente em TODA a secção de página — nada de hand-rolar
 * kicker+título. É o cabeçalho canónico REJENDARI: índice + rótulo JP +
 * título (text-display-2) + lede (text-body), com slot de ação alinhado
 * ao fundo à direita.
 *
 * Tone "light" = sobre fundo escuro (texto claro, acento dourado primary).
 * Tone "dark"  = sobre banda clara/prato (acento dourado bright #d4a53f).
 */
export function SectionHeader({
  index,
  jp,
  title,
  lede,
  tone = "light",
  action,
  id,
}: {
  index?: string;
  jp: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "light" | "dark";
  action?: ReactNode;
  /** Âncora opcional no wrapper (ex.: id="systems") — o scroll-margin do header sticky é automático. */
  id?: string;
}) {
  const accent = tone === "dark" ? "text-[#d4a53f]" : "text-primary";
  const body = tone === "dark" ? "text-white/58" : "text-muted-foreground";
  return (
    <div id={id} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className={`jp-label ${accent}`}>
          {index && <span className="mr-3 font-mono">{index}</span>}
          {jp}
        </p>
        <h2 className="text-display-2 mt-4 max-w-2xl">{title}</h2>
        {lede && <p className={`text-body mt-5 max-w-2xl ${body}`}>{lede}</p>}
      </div>
      {action && <div className="shrink-0 sm:ml-auto">{action}</div>}
    </div>
  );
}
