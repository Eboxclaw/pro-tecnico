import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";
import { LegendaryCombos } from "@/components/shop/LegendaryCombos";
import { SmartPacksSection } from "@/components/shop/SmartPacksSection";
import { KitsShowcase } from "@/components/shop/KitsShowcase";
import { KitBuilder } from "@/components/shop/KitBuilder";
import { KitMaker } from "@/components/shop/KitMaker";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";
import { cn } from "@/lib/utils";
import { communityDemand, featuredSystem, labSystems, systemsOfKind } from "@/data/systems";
import { useSystemDemand } from "@/lib/systems-demand";
import {
  CommunityDemandList,
  FeaturedDropCard,
  LabCard,
  ModuleCard,
  SystemCard,
} from "@/components/systems/SystemCards";

export const Route = createFileRoute("/packs")({
  head: () => ({
    meta: [
      { title: "Curated tool systems, reservas e procura da comunidade, REJENDARI" },
      {
        name: "description",
        content:
          "Systems curados à volta das melhores ferramentas, ANEX 397, Wera Zyklop, com reservas sem pagar, preço-alvo aberto e procura da comunidade a decidir os próximos drops.",
      },
      { property: "og:title", content: "Curated tool systems, REJENDARI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PacksPage,
});

const OFFICIAL_SET_IDS = [
  "anex-anh-s3",
  "makita-dlx2549tj",
  "makita-dlx2431tj",
  "makita-dlx3221tj",
  "anex-307-s1",
  "anex-525-10b",
  "anex-1902",
  "anex-ata-s1",
  "vessel-220w-3",
  "vessel-td2100",
  "vessel-td70",
  "vessel-td72",
  "vessel-td6808tx",
  "vessel-900rt-7p",
];

// Tabs do construtor: réplica do padrão PACK_TAB do KitBuilder (min-h-11, mono-caps,
// ativa dourada com sombra), com texto claro para o fundo escuro da secção.
const BUILDER_TAB_BASE =
  "min-h-11 shrink-0 whitespace-nowrap border border-b-2 px-5 py-3 mono-caps transition-all duration-200";
const BUILDER_TAB_ACTIVE =
  "border-primary bg-primary font-semibold text-[#1b1917] shadow-[0_12px_32px_rgba(212,165,63,0.30)]";
const BUILDER_TAB_INACTIVE =
  "border-white/20 bg-transparent text-white/60 hover:border-primary/50 hover:text-[#e3c27c]";

const TRADES: Array<{ key: string; icon: ToolGlyphName; label: string; desc: string }> = [
  { key: "hvac", icon: "hvac", label: "AVAC", desc: "Tubo, cobre e acesso difícil." },
  {
    key: "precision",
    icon: "precision",
    label: "Eletricidade",
    desc: "1000 V, slim e aperto controlado.",
  },
  { key: "maintenance", icon: "socket", label: "Manutenção", desc: "Roquetes, sockets e grip." },
  { key: "solar", icon: "power", label: "Solar", desc: "Montagem e assistência em obra." },
  { key: "plumbing", icon: "grip", label: "Canalização", desc: "Grip, ajustáveis e corte." },
  {
    key: "electronics",
    icon: "electronics",
    label: "Eletrónica",
    desc: "Bancada, ESD e equipamentos.",
  },
  { key: "ev", icon: "ev", label: "Veículos elétricos", desc: "1000 V, torque e cabos HV." },
];

function PacksPage() {
  const featured = featuredSystem();
  const systems = systemsOfKind("system");
  const modules = systemsOfKind("module");
  const lab = labSystems();
  const { data: demandBySystem } = useSystemDemand();
  // tab do construtor: "modular" (slot a slot) ou "maker" (wizard guiado)
  const [makerMode, setMakerMode] = useState(false);

  const realUnitsBySystem: Record<string, number> = {};
  const realLikesBySystem: Record<string, number> = {};
  for (const [systemId, demand] of Object.entries(demandBySystem ?? {})) {
    realUnitsBySystem[systemId] = demand.units;
    realLikesBySystem[systemId] = demand.likes;
  }
  const comunidadeTemDados =
    Object.values(realUnitsBySystem).some((units) => units > 0) ||
    Object.values(realLikesBySystem).some((likes) => likes > 0);
  const community = communityDemand(realUnitsBySystem, realLikesBySystem);

  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <p className="jp-label text-primary">システム · curated tool systems</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
            DO MORE
            <br />
            <span className="text-primary">WITH LESS.</span>
          </h1>
          <p className="mt-5 max-w-2xl font-display text-2xl font-semibold tracking-[-0.04em]">
            Menos peças repetidas. Mais trabalho resolvido.
          </p>
          <p className="mono-caps mt-5 inline-block border border-primary/35 bg-primary/[0.05] px-3 py-1.5 text-primary">
            Especialistas em bits & soquetes · canalização & AVAC
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            A REJENDARI encontra ferramentas excecionais, testa compatibilidades e cria sistemas
            mais inteligentes combinando-as. Aqui, os drops nascem de procura real: reservas sem
            pagar decidem o que entra em produção.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild className="rounded-none bg-black text-white hover:bg-black/85">
              <a href="#systems">
                Explorar Systems
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-none">
              <a href="#lab">Ver o Lab</a>
            </Button>
          </div>
        </div>
      </section>

      {featured && (
        <section className="bg-[#1b1917]">
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
            <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="jp-label text-[#e3c27c]">
                  <span className="font-mono">01</span> · 注目のドロップ · featured drop
                </p>
                <h2 className="mt-3 text-display-2 text-white">
                  O primeiro drop está em reservas.
                </h2>
                <p className="mono-caps mt-4 inline-block border border-[#e3c27c]/40 px-3 py-1.5 text-[#e3c27c]">
                  Lock oficial · Milwaukee SHOCKWAVE
                </p>
              </div>
              <p className="max-w-md text-sm leading-6 text-white/55">
                Quando a procura atingir o MOQ, o drop é confirmado e os reservas têm prioridade de
                48 horas. Sem pagamento, sem cartão.
              </p>
            </div>
            <FeaturedDropCard system={featured} />
          </div>
        </section>
      )}

      {/* ── construtor: tabs Modular | Kit Maker ─────────────── */}
      <section className="border-b border-border bg-[#1b1917]">
        <div className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-6">
          <p className="jp-label text-[#e3c27c]">
            <span className="font-mono">02</span> · 組立 · construtor
          </p>
          <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Modo do construtor">
            <button
              type="button"
              role="tab"
              aria-selected={!makerMode}
              onClick={() => setMakerMode(false)}
              className={cn(
                BUILDER_TAB_BASE,
                !makerMode ? BUILDER_TAB_ACTIVE : BUILDER_TAB_INACTIVE,
              )}
            >
              Packs modulares
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={makerMode}
              onClick={() => setMakerMode(true)}
              className={cn(
                BUILDER_TAB_BASE,
                makerMode ? BUILDER_TAB_ACTIVE : BUILDER_TAB_INACTIVE,
              )}
            >
              Kit Maker · guiado
            </button>
          </div>
          <p className="mt-4 max-w-2xl text-xs leading-5 text-white/50">
            Escolhe-se à marca. Declara-se o que já tens — o construtor cruza as duas listas antes
            de propor peça.
          </p>
        </div>
        {makerMode ? <KitMaker /> : <KitBuilder />}
      </section>

      <KitsShowcase />

      <section id="systems" className="scroll-mt-28 border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="jp-label text-primary">
                <span className="font-mono">04</span> · systems
              </p>
              <h2 className="mt-3 text-display-2">Composições, não catálogos.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Cada system resolve um nível de trabalho. O módulo seguinte aproveita o anterior sem
              recomprar nada: ferramentas como sinergias, não objectos soltos.
            </p>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {systems.map((system) => (
              <SystemCard key={system.id} system={system} />
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="scroll-mt-28 border-b border-border bg-surface/45">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="jp-label text-primary">
                <span className="font-mono">05</span> · módulos
              </p>
              <h2 className="mt-3 text-display-2">
                Um módulo entra só se resolver o problema seguinte.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Módulos funcionais, PH, Torx, Hex, Lock, Reach: impacto antes de bits standard, sempre
              que existir opção documentada. Antes de fechar, o atendimento cruza o módulo com o
              punho e as máquinas que já trabalharam.
            </p>
          </div>

          <div className="mt-6 border border-primary/25 bg-primary/[0.04] p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-primary">
              AÇO E TÊMPERA · A PREFERÊNCIA REJENDARI
            </p>
            <p className="mt-2 max-w-4xl text-xs leading-5 text-muted-foreground">
              Bits de impacto e torsão em S2 ou S5, ou Cr-Mo-V equivalente, com HRC equilibrado:
              dureza com tenacidade, nunca o número maior. Escolhemos pela combinação de liga,
              tratamento térmico e método de corte, documentada pelo fabricante.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <ModuleCard key={module.id} system={module} />
            ))}
          </div>
        </div>
      </section>

      <section id="lab" className="scroll-mt-28 border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="jp-label text-primary">
                <span className="font-mono">06</span> · 実験室 · lab
              </p>
              <h2 className="mt-3 text-display-2">Combinações ainda em estudo.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              O que vês no Lab não está à venda nem em reserva. Um like é um pedido: orienta o que
              negociamos a seguir — e quem pediu fica a saber quando entra.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lab.map((system) => (
              <LabCard key={system.id} system={system} />
            ))}
          </div>
        </div>
      </section>

      {comunidadeTemDados && (
        <section className="border-b border-border">
          <div className="paper-panel mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
            <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="jp-label text-primary">
                  <span className="font-mono">07</span> · 需要 · community demand
                </p>
                <h2 className="mt-3 text-display-2">A procura decide o próximo drop.</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                Reservas e likes de contas reais, nada estimado. É a procura que dita a ordem de
                negociação com os fabricantes.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <CommunityDemandList
                title="Mais desejados"
                jp="一番人気"
                systems={community.mostWanted}
                realUnitsBySystem={realUnitsBySystem}
                metric={(system) => `${realUnitsBySystem[system.id] ?? 0} unidades`}
              />
              <CommunityDemandList
                title="Crescimento mais rápido"
                jp="急成長"
                systems={community.fastestGrowing}
                realUnitsBySystem={realUnitsBySystem}
                metric={(system) => `${realLikesBySystem[system.id] ?? 0} likes`}
              />
              <CommunityDemandList
                title="Quase desbloqueados"
                jp="もうすぐ"
                systems={community.almostUnlocked}
                realUnitsBySystem={realUnitsBySystem}
                metric={(system) =>
                  `${Math.min(100, Math.round(((realUnitsBySystem[system.id] ?? 0) / (system.targetMoq ?? 1)) * 100))}% do MOQ`
                }
              />
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-border bg-surface/45">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="jp-label text-primary">
                <span className="font-mono">08</span> · メーカーセット · sets das próprias marcas
              </p>
              <h2 className="mt-3 text-display-2">
                Conjuntos de origem. Peças pensadas em conjunto.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Pouca ferramenta. Alta performance: só entram conjuntos com código de fabricante, para
              comparar composição e aplicação — a versão fornecida confirma-se no pedido.
            </p>
          </div>

          <div className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2">
            <div className="bg-card p-5">
              <p className="mono-caps text-primary">Makita LXT · corpos + conjuntos</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Uma bateria 18 V para a mala inteira: os conjuntos DLX e os corpos que juntares
                depois vivem na mesma plataforma.
              </p>
            </div>
            <div className="bg-card p-5">
              <p className="mono-caps text-foreground/80">Ryobi · em sourcing</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Na mesa de negociação com o distribuidor — sem referência confirmada, sem promessa
                de catálogo.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OFFICIAL_SET_IDS.map((id) => {
              const tool = CURATED_TOOL_REFERENCES.find((entry) => entry.id === id);
              if (!tool) return null;
              return (
                <Link
                  key={id}
                  to="/referencia/$id"
                  params={{ id }}
                  className="group overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_20px_50px_rgba(42,36,29,0.14)]"
                >
                  <div className="product-plate aspect-[16/10] overflow-hidden">
                    {tool.imageUrl ? (
                      <ProductImage
                        src={tool.imageUrl}
                        alt={tool.imageAlt ?? tool.namePt}
                        className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <ProductMonogram
                        brand={tool.brand}
                        label={tool.namePt}
                        className="flex h-full w-full items-center justify-center"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                        {tool.brand}
                      </p>
                      <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                        REF {tool.officialCode ?? tool.model}
                      </p>
                    </div>
                    <h3 className="mt-2 font-display text-xl font-semibold">{tool.namePt}</h3>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">{tool.specPt}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SmartPacksSection />

      <LegendaryCombos />

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <p className="jp-label text-primary">
            <span className="font-mono">11</span> · 職業 · escolhe pelo teu ofício
          </p>
          <h2 className="mt-3 text-display-2">Sete ofícios. Sete entradas diretas.</h2>
          <p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground">
            O tile abre a loja já filtrada; o acerto final faz-se no atendimento.
          </p>
          <div className="mt-7 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {TRADES.map((trade, index) => (
              <Link
                key={trade.key}
                to="/shop"
                search={{ task: trade.key }}
                className="category-tile group flex min-h-48 flex-col bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <ToolGlyph name={trade.icon} className="h-7 w-7 text-primary" />
                  <span className="font-mono text-[9px] text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-auto font-display text-xl font-semibold">{trade.label}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{trade.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
        <div className="paper-panel grid gap-7 p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#a87c1f]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                相談 · kit à medida
              </p>
            </div>
            <h2 className="mt-4 text-display-2">Diz-nos o que já tens antes de comprares mais.</h2>
          </div>
          <div>
            <p className="text-sm leading-7 text-foreground/75">
              Para empresa, equipa ou profissional, podemos construir uma seleção à volta das
              ferramentas existentes. A regra é evitar redundância: um bom roquete multi-bit, um
              sistema de sockets coerente e ferramentas de acesso específicas antes de encher a mala
              com duplicados.
            </p>
            <p className="mt-3 text-sm leading-7 text-foreground/75">
              Quem responde conhece as fichas peça a peça: o orçamento volta justificado,
              alternativa a alternativa.
            </p>
            <Button className="mt-6 rounded-none bg-black text-white hover:bg-black/85" asChild>
              <Link to="/b2b">
                Pedir no B2B · orçamento
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
