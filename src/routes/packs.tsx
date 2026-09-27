import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Layers3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";
import { JAPAN_TOOL_REFERENCES } from "@/data/curated-tool-references";

export const Route = createFileRoute("/packs")({
  head: () => ({
    meta: [
      { title: "Kits inteligentes profissionais — REJENDARI" },
      {
        name: "description",
        content: "Kits compactos para AVAC, eletricidade, manutenção e instalação, construídos com ferramentas multifunção japonesas.",
      },
      { property: "og:title", content: "Kits inteligentes — REJENDARI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PacksPage,
});

const OFFICIAL_SET_IDS = [
  "anex-307-s1",
  "anex-1902",
  "anex-ata-s1",
  "vessel-220w-3",
  "vessel-td70",
  "vessel-td72",
  "vessel-td6808tx",
  "vessel-900rt-7p",
  "ktc-dbr03",
  "ktc-dbr14",
  "tone-brfs27",
  "tone-rdbs11",
  "engineer-pds02",
];

const SMART_PACKS = [
  {
    name: "Aperto compacto",
    jp: "締結 · compacto",
    desc: "Cobertura ampla sem repetir cabos e chaves.",
    ids: ["anex-307-s1", "anex-aoa-17s1", "vessel-tdbs23"],
  },
  {
    name: "Precisão & eletrónica",
    jp: "精密 · bancada",
    desc: "Um sistema de bits de precisão e uma ferramenta de preparação de cabo.",
    ids: ["vessel-mr36", "vessel-9836", "hozan-p958"],
  },
  {
    name: "Manutenção inteligente",
    jp: "整備 · field kit",
    desc: "Roquete completo, mini roquete e acesso ultra-baixo em vez de várias chaves dedicadas.",
    ids: ["vessel-td6816mg", "ktc-dbrm11", "anex-6102-t"],
  },
];

const TRADES: Array<{ key: string; icon: ToolGlyphName; label: string; desc: string }> = [
  { key: "hvac", icon: "hvac", label: "AVAC", desc: "Instalação, manutenção e acesso difícil." },
  { key: "electrical", icon: "precision", label: "Eletricidade", desc: "Aperto, precisão, stripping e segurança." },
  { key: "maintenance", icon: "socket", label: "Manutenção", desc: "Roquetes, sockets, grip e reparação." },
  { key: "solar", icon: "power", label: "Solar", desc: "Montagem, aperto, corte e assistência em obra." },
  { key: "plumbing", icon: "grip", label: "Canalização", desc: "Grip, chaves ajustáveis e manutenção." },
];

function PacksPage() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <p className="jp-label text-primary">職人キット · kits inteligentes</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
            Menos peças repetidas.
            <br />
            <span className="text-primary">Mais trabalho resolvido.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            Um bom kit não é a maior mala. É a combinação mais pequena que cobre mais situações reais. Roquetes, bits intercambiáveis, ferramentas offset e sistemas compactos entram antes de duplicarmos cinco cabos para cinco tarefas.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-surface/45">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="jp-label text-primary">メーカーセット · sets das próprias marcas</p>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Antes de inventar um bundle, vemos o que o fabricante já resolveu.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Estes conjuntos já vêm pensados como sistema: roquete, bits, sockets ou adapters compatíveis entre si e com código oficial único.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OFFICIAL_SET_IDS.map((id) => {
              const tool = JAPAN_TOOL_REFERENCES.find((entry) => entry.id === id);
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
                      <img src={tool.imageUrl} alt={tool.imageAlt ?? tool.namePt} className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105" />
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

      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-18">
        <div className="flex items-end justify-between gap-6 border-b border-border pb-5">
          <div>
            <p className="jp-label text-primary">少ない道具 · bases inteligentes</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Três bases que reduzem volume.</h2>
          </div>
          <Layers3 className="hidden h-6 w-6 text-primary sm:block" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {SMART_PACKS.map((pack, packIndex) => {
            const tools = pack.ids.map((id) => JAPAN_TOOL_REFERENCES.find((tool) => tool.id === id)).filter(Boolean);
            return (
              <article key={pack.name} className="overflow-hidden border border-border bg-card">
                <div className="flex items-start justify-between gap-4 border-b border-border p-5">
                  <div>
                    <p className="jp-label text-primary">{pack.jp}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold">{pack.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{pack.desc}</p>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">0{packIndex + 1}</span>
                </div>

                <div className="divide-y divide-border">
                  {tools.map((tool) => tool && (
                    <Link
                      key={tool.id}
                      to="/referencia/$id"
                      params={{ id: tool.id }}
                      className="group grid grid-cols-[74px_1fr_auto] items-center gap-3 p-4 transition-colors hover:bg-secondary/60"
                    >
                      <div className="aspect-square overflow-hidden bg-[#eee9de]">
                        {tool.imageUrl ? (
                          <img src={tool.imageUrl} alt={tool.imageAlt ?? tool.namePt} className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full items-center justify-center font-display text-xs text-black/30">{tool.brand}</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-primary">{tool.brand} · {tool.model}</p>
                        <p className="mt-1 text-sm font-medium leading-5">{tool.namePt}</p>
                        <p className="mt-1 truncate font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">{tool.specPt}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-16">
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
            {TRADES.map((trade, index) => (
              <Link
                key={trade.key}
                to="/shop"
                search={{ task: trade.key === "electrical" ? "precision" : trade.key === "maintenance" ? "sockets" : trade.key === "solar" ? "power" : trade.key === "plumbing" ? "grip" : "hvac" }}
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
