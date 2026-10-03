import { ProductImage } from "@/components/shop/ProductImage";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";

const EDIT_IDS = [
  "wera-kompakt-vde-17-ra-1",
  "anex-3980-2-100",
  "vessel-td6816mg",
  "knipex-cobra-250",
  "anex-436",
  "olfa-xh-1",
];

export function RejendariEdit() {
  const tools = EDIT_IDS.map((id) => CURATED_TOOL_REFERENCES.find((tool) => tool.id === id)).filter(Boolean);
  const [lead, ...rest] = tools;

  if (!lead) return null;

  return (
    <section className="section-reveal mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">THE REJENDARI EDIT · 今週の選定</p>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
            Ferramentas que merecem espaço na mala.
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Uma seleção editorial para comparar soluções compactas, acesso difícil e controlo no aperto. Cada ferramenta entra pela utilidade que acrescenta ao trabalho.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Link
          to="/referencia/$id"
          params={{ id: lead.id }}
          className="editorial-lead group relative min-h-[520px] overflow-hidden border border-border bg-[#1b1917] text-white"
        >
          <div className="absolute inset-0 technical-grid opacity-[0.08]" />
          {lead.imageUrl && (
            <ProductImage
              src={lead.imageUrl}
              alt={lead.imageAlt ?? lead.namePt}
              className="absolute inset-0 h-full w-full object-contain p-10 transition-transform duration-700 group-hover:scale-[1.06] group-hover:-rotate-1 sm:p-16"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/65 to-transparent p-6 pt-28 sm:p-8 sm:pt-32">
            <div className="flex items-center gap-3">
              <span className="border border-white/20 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-white/65">RJD / 01</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#ef7158]">{lead.brand}</span>
            </div>
            <h3 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">{lead.namePt}</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/58">{lead.storyPt ?? lead.notePt}</p>
            <span className="mt-6 inline-flex items-center text-xs font-medium text-white">
              Ver referência
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        <div className="grid gap-3 sm:grid-cols-2">
          {rest.map((tool, index) => tool && (
            <Link
              key={tool.id}
              to="/referencia/$id"
              params={{ id: tool.id }}
              className="editorial-tile group flex min-h-60 flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_18px_50px_rgba(42,36,29,0.14)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#eee9de]">
                {tool.imageUrl ? (
                  <ProductImage
                    src={tool.imageUrl}
                    alt={tool.imageAlt ?? tool.namePt}
                    className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.07]"
                  />
                ) : null}
                <span className="absolute left-3 top-3 bg-[#1b1917] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-white/72">
                  RJD / 0{index + 2}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-primary">{tool.brand} · {tool.model}</p>
                <h3 className="mt-2 font-display text-lg font-semibold leading-tight">{tool.namePt}</h3>
                <p className="mt-auto pt-4 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">{tool.specPt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
