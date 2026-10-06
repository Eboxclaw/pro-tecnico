import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";
import { JapaneseAmbientScene } from "@/components/brand/JapaneseAmbientScene";

const HERO_IDS = [
  "anex-aoa-17s1",
  "anex-ryujin-artm5-01",
  "anex-azm-2698",
  "olfa-xh-1",
  "makita-dtd173z",
];

export function HeroToolConstellation() {
  const tools = HERO_IDS.map((id) => CURATED_TOOL_REFERENCES.find((tool) => tool.id === id)).filter(
    Boolean,
  );

  return (
    <div className="hero-tool-constellation relative min-h-[480px] overflow-hidden border border-white/15 bg-[var(--paper)] lg:min-h-[610px]">
      <JapaneseAmbientScene className="opacity-85" />
      <div className="washi-noise absolute inset-0 opacity-55" aria-hidden="true" />
      <div className="absolute left-5 top-5 z-20">
        <p className="jp-label text-primary">注目の工具 · referências em destaque</p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-foreground/42">
          ANEX · AZM · OLFA · MAKITA, SELEÇÃO DA CASA
        </p>
      </div>

      <div className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 writing-vertical font-display text-[11px] tracking-[0.22em] text-foreground/28 md:block">
        厳選工具 · 選定 · 実用品
      </div>

      {tools.map((tool, index) => {
        if (!tool) return null;
        return (
          <a
            key={tool.id}
            href={tool.referenceUrl}
            target="_blank"
            rel="noreferrer"
            className={`hero-floating-tool hero-floating-tool-${index + 1} group absolute z-10 border border-black/10 bg-white/88 shadow-[0_18px_45px_rgba(35,31,25,0.12)] backdrop-blur-sm`}
          >
            <div className="relative h-full w-full overflow-hidden">
              {tool.imageUrl ? (
                <img
                  src={tool.imageUrl}
                  alt={tool.imageAlt ?? `${tool.brand} ${tool.model}`}
                  className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <span className="jp-label text-primary">{tool.japanese}</span>
                  <span className="mt-3 font-display text-xl font-semibold text-[#1b1917]">
                    {tool.brand}
                  </span>
                  <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                    {tool.model}
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 translate-y-[calc(100%-2.2rem)] border-t border-black/10 bg-[rgba(247,243,234,0.96)] p-3 transition-transform duration-300 group-hover:translate-y-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                    {tool.brand}
                  </span>
                  <span className="font-display text-[10px] text-foreground/42">
                    {tool.japanese}
                  </span>
                </div>
                <p className="mt-1 font-display text-sm font-semibold leading-tight text-[#1b1917]">
                  {tool.model}
                </p>
                <p className="mt-2 text-[10px] leading-4 text-foreground/65">{tool.categoryPt}</p>
              </div>
            </div>
          </a>
        );
      })}

      <div className="absolute bottom-5 left-5 z-20 border-l border-primary/70 pl-3">
        <p className="font-display text-sm font-semibold text-[#1b1917]">
          Ferramentas reais. Escolhidas para o trabalho.
        </p>
        <p className="mt-1 max-w-xs text-[10px] leading-4 text-foreground/48">
          Passa o rato pelas referências: aperto de impacto, 1000 V, grip e acesso, cinco sistemas
          escolhidos pelo trabalho.
        </p>
      </div>
    </div>
  );
}
