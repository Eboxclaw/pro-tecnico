import { Link } from "@tanstack/react-router";
import { RejendariSeal } from "@/components/brand/RejendariSeal";
import { ArrowRight, Ruler, Wrench } from "lucide-react";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";
import { SmartProductVisual } from "@/components/shop/SmartProductVisual";
import { ProductQuickStudy } from "@/components/shop/ProductQuickStudy";
import { Button } from "@/components/ui/button";

const VISUAL_IDS = ["top-hm32", "tsunoda-wp250sc", "knipex-cobra-250", "bahco-9031p"];
const COMPACT_COMPARE_IDS = ["lobster-um24xg", "lobster-um30xg", "lobster-um36xg"];

export function GripWrenchSpotlight() {
  const tools = VISUAL_IDS.map((id) =>
    CURATED_TOOL_REFERENCES.find((tool) => tool.id === id),
  ).filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  const compact = COMPACT_COMPARE_IDS.map((id) =>
    CURATED_TOOL_REFERENCES.find((tool) => tool.id === id),
  ).filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  return (
    <section className="section-reveal border-y border-border bg-[#1b1917] text-[#f5f0e5]">
      <div className="relative mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
        <RejendariSeal className="absolute top-6 right-6 z-10 hidden h-20 w-20 opacity-80 lg:grid" />
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d65a41]">
              GRIP / CHAVES · 握る・回す
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
              A pega certa. O aperto controlado.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/58">
            AVAC, canalização e manutenção pedem mais do que bits e roquetes. Aqui entram a Cobra
            auto-bloqueante, a 9031P com mandíbula para tubo e as ajustáveis japonesas, Japão e
            Europa no mesmo regime de agarrar.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tools.map((tool) => (
            <article
              key={tool.id}
              className="group overflow-hidden border border-white/12 bg-[#23211d]"
            >
              <div className="relative">
                <SmartProductVisual tool={tool} />
                <div className="absolute right-3 top-12 z-30">
                  <ProductQuickStudy tool={tool} compact />
                </div>
              </div>
              <div className="p-5">
                <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#d65a41]">
                  {tool.brand} · REF {tool.officialCode}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold leading-tight">
                  {tool.namePt}
                </h3>
                <p className="mt-3 text-xs leading-5 text-white/52">
                  {tool.storyPt ?? tool.notePt}
                </p>
                <div className="mt-4 border-t border-white/10 pt-4 font-mono text-[9px] uppercase tracking-[0.11em] text-white/66">
                  {tool.specPt}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-0 border border-white/12 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="border-b border-white/12 bg-[#23211d] p-6 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-[#d65a41]" />
              <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#d65a41]">
                LOBSTER / LOBTEX · UM-XG
              </p>
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold">
              Uma chave ajustável à medida do trabalho.
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/50">
              Compara abertura, comprimento e peso dos três modelos UM-XG. Escolhe pela dimensão da
              união e pelo espaço disponível para trabalhar.
            </p>
          </div>

          <div className="divide-y divide-white/10 bg-[#23211d]">
            {compact.map((tool) => (
              <Link
                key={tool.id}
                to="/referencia/$id"
                params={{ id: tool.id }}
                className="group flex flex-col gap-3 p-5 transition-colors hover:bg-white/[0.035] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#d65a41]">
                    {tool.model}
                  </p>
                  <p className="mt-1 text-sm font-medium">{tool.namePt}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Ruler className="h-3.5 w-3.5 text-white/35" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.11em] text-white/55">
                    {tool.specPt}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-[#d65a41]" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="secondary" className="rounded-none" asChild>
            <Link to="/shop" search={{ focus: "wrenches" }}>
              Ver chaves ajustáveis
            </Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-none border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link to="/shop" search={{ focus: "water-pump" }}>
              Ver alicates extensíveis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
