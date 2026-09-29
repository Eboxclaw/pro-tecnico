import { ProductImage } from "@/components/shop/ProductImage";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";

type LegendaryCombo = {
  name: string;
  jp: string;
  work: string;
  desc: string;
  ids: string[];
};

export const LEGENDARY_COMBOS: LegendaryCombo[] = [
  {
    name: "Impact Beast",
    jp: "衝撃 · impacto",
    work: "Parafuso pesado",
    desc: "Aparafusadora de impacto 18 V de 180 N·m com holder Impaktor e bits dimensionados para impacto forte.",
    ids: ["makita-dtd172z", "wera-897-4-imp-r-impaktor", "wera-impaktor-bits"],
  },
  {
    name: "German Torsion",
    jp: "捻り · torsion",
    work: "Montagem geral",
    desc: "Rapidaptor BiTorsion e o kit de trinta bits: a dupla zona torsional aguenta montagem repetitiva o dia todo.",
    ids: ["makita-dtd173z", "wera-897-4-r-rapidaptor-bitorsion", "wera-bit-check-30-bitorsion"],
  },
  {
    name: "Japanese Impact",
    jp: "龍神 · made in Japan",
    work: "Chapa · madeira · montagem",
    desc: "Bits Ryujin em Cr-Mo-V fabricados no Japão, especificados pela ANEX para máquinas de 18 V e 40 V.",
    ids: ["makita-dtd172z", "anex-ryujin-artm5-01", "anex-ryujin-slim"],
  },
  {
    name: "Ball Grip Hybrid",
    jp: "差替 · intercambiável",
    work: "Manual universal",
    desc: "Ergonomia japonesa Ball Grip com tang-through a aceitar o universo inteiro de bits 1/4″: Wera, ANEX, Wiha.",
    ids: ["vessel-230w", "anex-ryujin-artm5-01", "wera-impaktor-bits"],
  },
  {
    name: "Ratchet Driver",
    jp: "ラチェット · roquete",
    work: "Manutenção · AVAC",
    desc: "A chave longa 1/4″ com roquete e Rapidaptor, com bits longos para acesso através de painéis e condutas.",
    ids: ["wera-838-ra-r-l", "wera-897-4-r-rapidaptor-bitorsion", "vessel-tdbs23"],
  },
  {
    name: "Pocket Mechanic",
    jp: "携帯 · bolso",
    work: "Assistência",
    desc: "Zyklop Pocket de bolso, Quick Spinner 3/8″ e porta-porcas magnéticos: um sistema de assistência num cinto.",
    ids: ["wera-zyklop-pocket-8009", "koken-3756z", "porta-porcas-magneticos-1-4"],
  },
  {
    name: "JDM Mechanic",
    jp: "整備 · mecânica",
    work: "Mecânica",
    desc: "Z-EAL 3725Z em SCM435 made in Japan, o Quick Spinner que o acompanha e o roquete premium Nepros de 90 dentes.",
    ids: ["koken-3725z", "koken-3756z", "nepros-nbr390a"],
  },
  {
    name: "Electrician 1000",
    jp: "絶縁 · 1000 V",
    work: "Elétrico",
    desc: "Sistema VDE com roquete de 40 dentes e 15 lâminas, corte de alta alavanca ~64 HRC e Pliers Wrench isolada até 52 mm.",
    ids: ["wera-kk-vde-17-ra-1", "knipex-74-06-200", "knipex-86-06-250"],
  },
  {
    name: "Slim Electrician",
    jp: "スリム · slim",
    work: "Quadros · bornes fundos",
    desc: "O sistema isolado de 6 mm: cabo modular slimVario, jogo de slimBits e lâminas extra slim para bornes.",
    ids: ["wiha-slimvario", "wiha-slimbits-set", "wera-kk-vde-17-slim"],
  },
  {
    name: "HVAC Grip",
    jp: "設備 · AVAC",
    work: "AVAC · canalização",
    desc: "Cobra auto-bloqueante de dentes ~61 HRC, Pliers Wrench que não marca fittings e a 9031P com mandíbula para tubo.",
    ids: ["knipex-cobra-250", "knipex-pliers-wrench-250", "bahco-9031p"],
  },
  {
    name: "Broken Screw",
    jp: "破損ネジ · resgate",
    work: "Parafuso danificado",
    desc: "ScrewZaurus para agarrar cabeças destruídas, impacto manual para soltar e Ball Grip tang-through para terminar.",
    ids: ["engineer-pz58", "anex-1902", "vessel-230w"],
  },
  {
    name: "Electronics Bench",
    jp: "電子 · bancada",
    work: "Eletrónica",
    desc: "Trinta e seis bits de precisão, stripper de cabos e pinças ESD: a bancada técnica completa para equipamentos.",
    ids: ["vessel-9836", "hozan-p958", "wiha-esd-tweezers", "wera-kraftform-micro"],
  },
  {
    name: "EV High-Voltage",
    jp: "電気自動車 · VE",
    work: "Veículos elétricos",
    desc: "Torque VDE calibrado para terminais, tesoura de cabos isolada e bits 1000 V: a cadeia de ferramenta HV completa.",
    ids: ["wera-safe-torque-vde", "knipex-95-12-165-vde", "knipex-86-06-250", "anex-azm-2698"],
  },
];

export function LegendaryCombos() {
  return (
    <section className="section-reveal border-y border-border bg-[#24211d] text-[#f5f0e5]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="jp-label text-[#d65a41]">伝説の組み合わせ · legendary combos</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
              Combos que juntam fabricantes quando a combinação fica melhor.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/58">
            Mais vendável do que "kit Wera" ou "kit Knipex": cada combo cruza Japão, Alemanha e Suécia quando a mistura
            supera a marca isolada. São seleções editoriais — a disponibilidade de cada peça confirma-se no pedido.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {LEGENDARY_COMBOS.map((combo, comboIndex) => {
            const tools = combo.ids
              .map((id) => CURATED_TOOL_REFERENCES.find((tool) => tool.id === id))
              .filter(Boolean);
            return (
              <article key={combo.name} className="flex flex-col overflow-hidden bg-[#1d1b18] ring-1 ring-white/10">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
                  <div>
                    <p className="jp-label text-[#d65a41]">{combo.jp}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em]">{combo.name}</h3>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/48">{combo.work}</p>
                    <p className="mt-3 text-sm leading-6 text-white/60">{combo.desc}</p>
                  </div>
                  <span className="font-mono text-[10px] text-white/32">
                    {String(comboIndex + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col divide-y divide-white/8">
                  {tools.map((tool) => tool && (
                    <Link
                      key={tool.id}
                      to="/referencia/$id"
                      params={{ id: tool.id }}
                      className="group grid grid-cols-[52px_1fr_auto] items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="aspect-square overflow-hidden bg-[#eee9de]">
                        {tool.imageUrl ? (
                          <ProductImage
                            src={tool.imageUrl}
                            alt={tool.imageAlt ?? tool.namePt}
                            className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center font-display text-[10px] text-black/30">
                            {tool.brand}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#d65a41]">
                          {tool.brand} · {tool.model}
                        </p>
                        <p className="mt-0.5 truncate text-sm leading-5 text-white/85">{tool.namePt}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-[#d65a41]" />
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 border-t border-white/10 pt-5 font-mono text-[9px] uppercase leading-5 tracking-[0.13em] text-white/38">
          Combos editoriais, não conjuntos fechados à venda. Isolamento do cabo não transforma uma ferramenta comum em
          ferramenta para trabalho em tensão: a cadeia completa tem de ser certificada.
        </p>
      </div>
    </section>
  );
}
