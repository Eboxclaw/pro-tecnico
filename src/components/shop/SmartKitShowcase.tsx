import { ProductImage } from "@/components/shop/ProductImage";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";

const SMART = [
  {
    id: "anex-307-s1",
    title: "Aperto compacto",
    label: "28 perfis num estojo",
    text: "Um mini roquete, bits ultra-curtos, holder e sockets métricos reduzem vários cabos e caixas separadas.",
  },
  {
    id: "vessel-mr36",
    title: "Precisão",
    label: "36 bits num único sistema",
    text: "Para eletrónica e pequenos equipamentos, um punho de precisão e uma seleção ampla evitam microchaves soltas.",
  },
  {
    id: "vessel-td6816mg",
    title: "Manutenção",
    label: "Punho + 16 bits",
    text: "Um ratchet screwdriver com armazenamento integrado cobre os perfis mais frequentes sem levar um estojo grande.",
  },
];

export function SmartKitShowcase() {
  return (
    <section className="section-reveal mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="jp-label text-primary">少ない道具 · kits inteligentes</p>
          <h2 className="mt-4 max-w-md font-display text-4xl font-semibold leading-[0.98] sm:text-5xl">
            Menos peças. Mais funções por ferramenta.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
            Nos kits REJENDARI não queremos repetir cinco cabos para cinco tarefas. Damos prioridade a roquetes, bits intercambiáveis e sistemas compactos que aumentam cobertura sem aumentar volume.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {SMART.map((item, index) => {
            const tool = CURATED_TOOL_REFERENCES.find((entry) => entry.id === item.id);
            if (!tool) return null;
            return (
              <Link
                key={item.id}
                to="/referencia/$id"
                params={{ id: item.id }}
                className="smart-kit-card group flex min-h-[390px] flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_22px_55px_rgba(42,36,29,0.14)]"
              >
                <div className="relative aspect-square overflow-hidden bg-[#eee9de]">
                  {tool.imageUrl ? (
                    <ProductImage src={tool.imageUrl} alt={tool.imageAlt ?? tool.namePt} className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-3xl text-black/15">{tool.brand}</div>
                  )}
                  <span className="absolute left-3 top-3 bg-[#24211d] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-white">0{index + 1}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="jp-label text-primary">{item.label}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{tool.brand} · {tool.model}</p>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  <span className="mt-auto inline-flex items-center pt-5 text-xs font-medium text-primary">
                    Explorar sistema
                    <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
