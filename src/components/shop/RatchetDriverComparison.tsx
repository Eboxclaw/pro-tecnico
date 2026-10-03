import { ProductImage } from "@/components/shop/ProductImage";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";
import { Button } from "@/components/ui/button";

const IDS = ["anex-397-d", "vessel-td6816mg", "anex-431"];

export function RatchetDriverComparison() {
  const tools = IDS.map((id) => CURATED_TOOL_REFERENCES.find((tool) => tool.id === id)).filter(Boolean);

  return (
    <section className="section-reveal border-y border-border bg-[#1b1917] text-[#f5f0e5]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="jp-label text-[#d65a41]">比較 · comparar antes de comprar</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
              Três formas japonesas de fazer um ratchet screwdriver.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/58">
            ANEX e VESSEL resolvem o mesmo problema de maneiras diferentes: Ball Grip de 72 dentes, cassete de 16 bits ou o Gandora com bits guardados no corpo. A comparação ajuda a escolher pelo modo de trabalho, não só pela marca.
          </p>
        </div>

        <div className="mt-10 grid gap-px border border-white/12 bg-white/12 lg:grid-cols-3">
          {tools.map((tool, index) => tool && (
            <article key={tool.id} className="comparison-card group relative overflow-hidden bg-[#23211d] p-5 sm:p-6">
              <span className="absolute right-4 top-3 font-mono text-5xl font-semibold text-white/[0.035]">0{index + 1}</span>
              <div className="relative aspect-[4/3] overflow-hidden bg-[#eee9de]">
                {tool.imageUrl ? (
                  <ProductImage
                    src={tool.imageUrl}
                    alt={tool.imageAlt ?? `${tool.brand} ${tool.model}`}
                    className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.07] group-hover:-rotate-1"
                  />
                ) : null}
              </div>
              <div className="mt-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#d65a41]">{tool.brand}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold">{tool.model}</h3>
                <p className="mt-2 text-xs leading-5 text-white/52">{tool.namePt}</p>
                {tool.specPt && <p className="mt-4 border-t border-white/12 pt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-white/70">{tool.specPt}</p>}
                <p className="mt-4 text-sm leading-6 text-white/60">{tool.storyPt ?? tool.notePt}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" className="rounded-none" asChild>
                    <Link to="/referencia/$id" params={{ id: tool.id }}>
                      Ver produto
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-none text-white/65 hover:text-white" asChild>
                    <a href={tool.referenceUrl} target="_blank" rel="noreferrer">
                      Oficial
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-px border border-white/12 bg-white/12 sm:grid-cols-3">
          <div className="bg-[#23211d] p-5">
            <p className="jp-label text-[#d65a41]">ANEX 397-D</p>
            <p className="mt-2 text-sm font-medium">Quick Ball 72</p>
            <p className="mt-2 text-xs leading-5 text-white/52">72 dentes, 25 N·m e formato Ball Grip para avanço rápido e aperto final forte.</p>
          </div>
          <div className="bg-[#23211d] p-5">
            <p className="jp-label text-[#d65a41]">VESSEL TD-6816MG</p>
            <p className="mt-2 text-sm font-medium">Punho clássico + 16 bits</p>
            <p className="mt-2 text-xs leading-5 text-white/52">72 dentes, 5° e cobertura PH, SL, HEX e Torx tamper-resistant.</p>
          </div>
          <div className="bg-[#23211d] p-5">
            <p className="jp-label text-[#d65a41]">ANEX 431</p>
            <p className="mt-2 text-sm font-medium">Bits guardados no corpo</p>
            <p className="mt-2 text-xs leading-5 text-white/52">Roquete de vaivém com 10 dentes e bits Neji-Pita (+2/−6) guardados no próprio punho.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
