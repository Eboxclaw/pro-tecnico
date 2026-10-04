import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
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
    desc: "Aparafusadora de impacto 18 V de 180 N·m com bits Black Ryujin HRC 62,5 em Cr-Mo-V, dimensionados pela ANEX para 18 V e 40 V.",
    ids: ["makita-dtd172z", "anex-abrs5-2065", "anex-abrs5-01"],
  },
  {
    name: "Zyklop Speed",
    jp: "速さ · velocidade",
    work: "Montagem · mecânica",
    desc: "O kit Zyklop Speed 3/8″ de 29 peças — catraca de 72 dentes, sockets 8–19 mm, adaptador de bits — e a 838 RA-R M para o aperto manual.",
    ids: ["wera-8100-sb-6", "wera-838-ra-r-m"],
  },
  {
    name: "Japanese Impact",
    jp: "龍靭 · made in Japan",
    work: "Chapa · madeira · montagem",
    desc: "Bits Ryujin em Cr-Mo-V fabricados no Japão, especificados pela ANEX para máquinas de 18 V e 40 V.",
    ids: ["makita-dtd172z", "anex-ryujin-artm5-01", "anex-ryujin-slim"],
  },
  {
    name: "Ball Grip Hybrid",
    jp: "差替 · intercambiável",
    work: "Manual universal",
    desc: "Ergonomia japonesa Ball Grip com tang-through a aceitar o universo inteiro de bits 1/4″, com Ryujin de série.",
    ids: ["vessel-230w", "anex-ryujin-artm5-01", "anex-abrs5-2065"],
  },
  {
    name: "Ratchet Driver",
    jp: "ラチェット · roquete",
    work: "Manutenção · AVAC",
    desc: "A 838 RA-R L de movimento curto, o Gandora 431 com bits guardados no punho e bits longos para acesso através de painéis.",
    ids: ["wera-838-ra-r-l", "anex-431", "vessel-tdbs23"],
  },
  {
    name: "Pocket Mechanic",
    jp: "携帯 · bolso",
    work: "Assistência",
    desc: "Catraca compacta de bolso 52, Quick Spinner 3/8″ e porta-porcas magnéticos: um sistema de assistência num cinto.",
    ids: ["anex-525", "koken-3756z", "porta-porcas-magneticos-1-4"],
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
    desc: "Bits AZM isolados 1000 V, chave slim isolada VESSEL, corte de alta alavanca ~64 HRC e o alicate de seis funções 1000 V: o circuito completo do eletricista.",
    ids: ["anex-azm-2698", "vessel-960-ph2-100", "knipex-74-06-200", "knipex-13-96-200"],
  },
  {
    name: "Drywall Finish",
    jp: "石膏ボード · pladur",
    work: "Pladur · acabamento",
    desc: "Serrote de ponta para aberturas, raspador inox para juntas e o catch&stop ANEX que segura o parafuso de gesso: montar pladur sem parafuso no chão.",
    ids: ["tajima-ng165js-k1", "olfa-scr-l", "anex-abs-2065"],
  },
  {
    name: "Slim Electrician",
    jp: "スリム · slim",
    work: "Quadros · bornes fundos",
    desc: "O sistema isolado de 6 mm: cabo modular slimVario com slimBits e a chave slim isolada ANEX para bornes fundos.",
    ids: ["wiha-slimvario", "wiha-slimbits-set", "anex-7920"],
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
    desc: "Trinta e seis bits de precisão, stripper de cabos e pinças de precisão: a bancada técnica completa para equipamentos.",
    ids: ["vessel-9836", "vessel-mr36", "hozan-p958"],
  },
  {
    name: "EV High-Voltage",
    jp: "電気自動車 · VE",
    work: "Veículos elétricos",
    desc: "Bits 1000 V AZM, adaptadores de binário ATA e a chave USB isolada: a cadeia de aperto calibrada para HV.",
    ids: ["anex-azm-2698", "anex-ata-s1", "vessel-220usb-s1eb"],
  },
];

export function LegendaryCombos() {
  return (
    <section className="section-reveal border-y border-border bg-[#1b1917] text-[#f5f0e5]">
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
              <article key={combo.name} className="flex flex-col overflow-hidden bg-[#23211d] ring-1 ring-white/10">
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
                      <div className="product-plate relative aspect-square overflow-hidden">
                        {tool.imageUrl ? (
                          <ProductImage
                            src={tool.imageUrl}
                            alt={tool.imageAlt ?? tool.namePt}
                            className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <ProductMonogram brand={tool.brand} label={tool.model} className="h-full w-full" />
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
