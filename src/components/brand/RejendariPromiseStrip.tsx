import { BadgeCheck, Gauge, ScanSearch, Sparkles } from "lucide-react";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";

const ITEMS = [
  {
    icon: ScanSearch,
    title: "Referência oficial",
    text: "Código e fonte do fabricante sempre que a referência está validada.",
  },
  {
    icon: Gauge,
    title: "Portugal / UE",
    text: "Métrico e SI primeiro; polegadas apenas onde a interface técnica assim exige.",
  },
  {
    icon: Sparkles,
    title: "Menos catálogo",
    text: "Escolhemos sistemas, sets e problem-solvers em vez de despejar variantes repetidas.",
  },
  {
    icon: BadgeCheck,
    title: "Contexto técnico",
    text: "Explicamos para que serve, o que substitui e com que alternativas faz sentido comparar.",
  },
];

export function RejendariPromiseStrip() {
  return (
    <section className="section-reveal border-y border-border bg-[#1b1917] text-[#f5f0e5]">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:py-10">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d65a41]">
              REJENDARI STANDARD · 選定基準
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">
              Curadoria que se consegue verificar.
            </h2>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/38">
            {CURATED_TOOL_REFERENCES.length} referências selecionadas · Japan-first · Portugal-ready
          </p>
        </div>
        <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-[#1b1917] p-5">
                <Icon className="h-5 w-5 text-[#d65a41]" />
                <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/48">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
