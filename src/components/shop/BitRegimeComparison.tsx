import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";
import { Button } from "@/components/ui/button";

const IDS = ["anex-abrs5-2065", "anex-adrs-2065", "anex-ryujin-artm5-01", "anex-azm-2698"];

const REGIME_FOOTNOTES = [
  {
    ref: "ANEX BLACK RYUJIN",
    regime: "Impacto",
    note: "HRC 62,5 em Cr-Mo-V com zona torsional: a ponta para chapa grossa e impacto forte.",
  },
  {
    ref: "ANEX DIAMOND RYUJIN",
    regime: "Inox · aderência",
    note: "Partículas de diamante que mordem o parafuso inox que o ímã não segura.",
  },
  {
    ref: "ANEX 龍靭 RYUJIN",
    regime: "Montagem geral",
    note: "Fabricado no Japão em Cr-Mo-V, especificado para 18 V e 40 V, em três alcances.",
  },
  {
    ref: "ANEX AZM 1000 V",
    regime: "Elétrico",
    note: "Bit isolado 1000 V sobre haste hex 6,35 mm: o aperto dentro do quadro.",
  },
];

export function BitRegimeComparison() {
  const tools = IDS.map((id) => CURATED_TOOL_REFERENCES.find((tool) => tool.id === id)).filter(Boolean);

  return (
    <section className="section-reveal border-b border-border bg-surface/35">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="jp-label text-primary">用途別ビット · a parede de bits</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
              O melhor bit para cada regime de trabalho.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Não vendemos todos os bits de todas as marcas: vendemos o bit certo para impacto, aderência em inox,
            montagem geral e 1000 V — e depois os holders, adaptadores e máquinas que os transformam num sistema.
            A família Ryujin da ANEX é o fio condutor.
          </p>
        </div>

        <div className="mt-10 grid gap-4 border border-border bg-background p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
          {tools.map((tool, index) => tool && (
            <article key={tool.id} className="group flex h-full flex-col border border-border bg-card p-4">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-primary">{tool.brand}</span>
                <span className="font-mono text-[9px] text-muted-foreground">0{index + 1}</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold leading-tight tracking-[-0.03em]">{tool.model}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{tool.namePt}</p>
              {tool.specPt && (
                <p className="mt-4 border-t border-border pt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                  {tool.specPt}
                </p>
              )}
              <p className="mt-3 flex-1 text-xs leading-5 text-muted-foreground">{tool.notePt}</p>
              <Button size="sm" variant="outline" className="mt-5 w-fit rounded-none" asChild>
                <Link to="/referencia/$id" params={{ id: tool.id }}>
                  Ver referência
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
            </article>
          ))}
        </div>

        <div className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {REGIME_FOOTNOTES.map((item) => (
            <div key={item.ref} className="bg-background p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">{item.ref}</p>
              <p className="mt-2 text-sm font-medium">{item.regime}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-none" asChild>
            <Link to="/shop" search={{ focus: "impact-bits" }}>
              Impacto & torsion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="rounded-none" asChild>
            <Link to="/shop" search={{ focus: "insulated" }}>
              1000 V isolado
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
