import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";
import { LEGENDARY_COMBOS } from "@/data/legendary-combos";
import { Button } from "@/components/ui/button";

type LegendaryCombo = {
  name: string;
  jp: string;
  work: string;
  desc: string;
  ids: string[];
};

export function LegendaryCombos() {
  return (
    <section className="section-reveal border-b border-border bg-[#1b1917] text-[#f5f0e5]">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="jp-label text-[#d4a53f]">
              <span className="font-mono">10</span> · 伝説の組み合わせ · legendary combos
            </p>
            <h2 className="mt-4 max-w-xl text-display-2">
              Combos que juntam fabricantes quando a combinação fica melhor.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/58">
            Mais vendável do que "kit Wera" ou "kit Knipex": cada combo cruza Japão, Alemanha e
            Suécia quando a mistura supera a marca isolada. São seleções editoriais, a
            disponibilidade de cada peça confirma-se no pedido.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {LEGENDARY_COMBOS.map((combo, comboIndex) => {
            const tools = combo.ids
              .map((id) => CURATED_TOOL_REFERENCES.find((tool) => tool.id === id))
              .filter(Boolean);
            return (
              <article
                key={combo.name}
                className="flex flex-col overflow-hidden bg-[#23211d] ring-1 ring-white/10"
              >
                <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
                  <div>
                    <p className="jp-label text-[#d4a53f]">{combo.jp}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em]">
                      {combo.name}
                    </h3>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/48">
                      {combo.work}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/60">{combo.desc}</p>
                  </div>
                  <span className="font-mono text-[10px] text-white/32">
                    {String(comboIndex + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col divide-y divide-white/8">
                  {tools.map(
                    (tool) =>
                      tool && (
                        <Link
                          key={tool.id}
                          to="/referencia/$id"
                          params={{ id: tool.id }}
                          className="group grid grid-cols-[52px_1fr_auto] items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.04]"
                        >
                          <div className="product-plate relative aspect-square overflow-hidden">
                            {tool.imageUrl ? (
                              <ProductImage
                                src={tool.imageUrl}
                                alt={tool.imageAlt ?? tool.namePt}
                                className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <ProductMonogram
                                brand={tool.brand}
                                label={tool.model}
                                className="h-full w-full"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#d4a53f]">
                              {tool.brand} · {tool.model}
                            </p>
                            <p className="mt-0.5 truncate text-sm leading-5 text-white/85">
                              {tool.namePt}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-[#d4a53f]" />
                        </Link>
                      ),
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 border-t border-white/10 pt-7">
          <Button
            asChild
            size="lg"
            className="rounded-none px-7 font-semibold shadow-[0_14px_36px_rgba(212,165,63,0.25)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(212,165,63,0.38)]"
          >
            <Link to="/b2b">
              Pedir no B2B · estes combos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
