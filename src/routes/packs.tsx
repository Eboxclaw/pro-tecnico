import { ProductImage } from "@/components/shop/ProductImage";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";
import { LegendaryCombos } from "@/components/shop/LegendaryCombos";
import { SmartPacksSection } from "@/components/shop/SmartPacksSection";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";

export const Route = createFileRoute("/packs")({
  head: () => ({
    meta: [
      { title: "Legendary Combos e kits profissionais — REJENDARI" },
      {
        name: "description",
        content: "Combos que juntam Wera, Knipex, Wiha, Bahco, VESSEL e Ko-ken quando a combinação fica melhor: impacto, 1000 V, AVAC, eletrónica e veículos elétricos.",
      },
      { property: "og:title", content: "Legendary Combos — REJENDARI" },
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
  "tone-brfs27",
  "tone-rdbs11",
  "engineer-pds02",
];

const TRADES: Array<{ key: string; icon: ToolGlyphName; label: string; desc: string }> = [
  { key: "hvac", icon: "hvac", label: "AVAC", desc: "Tubo, cobre e acesso difícil." },
  { key: "precision", icon: "precision", label: "Eletricidade", desc: "1000 V, slim e aperto controlado." },
  { key: "maintenance", icon: "socket", label: "Manutenção", desc: "Roquetes, sockets e grip." },
  { key: "solar", icon: "power", label: "Solar", desc: "Montagem e assistência em obra." },
  { key: "plumbing", icon: "grip", label: "Canalização", desc: "Grip, ajustáveis e corte." },
  { key: "electronics", icon: "electronics", label: "Eletrónica", desc: "Bancada, ESD e equipamentos." },
  { key: "ev", icon: "ev", label: "Veículos elétricos", desc: "1000 V, torque e cabos HV." },
];

function PacksPage() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <p className="jp-label text-primary">伝説の組み合わせ · legendary combos</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
            Menos peças repetidas.
            <br />
            <span className="text-primary">Mais trabalho resolvido.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            Um bom kit não é a maior mala — é a combinação mais pequena que cobre mais situações reais. Os Legendary
            Combos cruzam Japão, Alemanha e Suécia quando a mistura supera a marca isolada: impacto, 1000 V, AVAC,
            eletrónica e veículos elétricos.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-surface/45">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="jp-label text-primary">メーカーセット · sets das próprias marcas</p>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Conjuntos de origem. Peças pensadas em conjunto.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Conjuntos com código de fabricante para comparar composição e aplicação. A disponibilidade e o conteúdo da versão fornecida são confirmados no pedido.
            </p>
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
                  <div className="aspect-[16/10] overflow-hidden bg-[#eee9de]">
                    {tool.imageUrl ? (
                      <ProductImage src={tool.imageUrl} alt={tool.imageAlt ?? tool.namePt} className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-3xl text-black/15">{tool.brand}</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">{tool.brand}</p>
                      <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">REF {tool.officialCode ?? tool.model}</p>
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

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-16">
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

      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-16">
        <div className="paper-panel grid gap-7 p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#b54530]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">相談 · kit à medida</p>
            </div>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1] tracking-[-0.05em]">Diz-nos o que já tens antes de comprares mais.</h2>
          </div>
          <div>
            <p className="text-sm leading-7 text-black/65">
              Para empresa, equipa ou profissional, podemos construir uma seleção à volta das ferramentas existentes. A regra é evitar redundância: um bom roquete multi-bit, um sistema de sockets coerente e ferramentas de acesso específicas antes de encher a mala com duplicados.
            </p>
            <Button className="mt-6 rounded-none bg-black text-white hover:bg-black/85" asChild>
              <Link to="/b2b">
                Pedir proposta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
