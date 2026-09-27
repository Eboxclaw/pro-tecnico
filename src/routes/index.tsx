import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, PackageSearch, ShieldCheck, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/shop/ProductCard";
import { ReferenceProductCard } from "@/components/shop/ReferenceProductCard";
import { JAPAN_TOOL_REFERENCES } from "@/data/curated-tool-references";
import { HeroToolConstellation } from "@/components/brand/HeroToolConstellation";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "REJENDARI — Ferramenta profissional japonesa" },
      {
        name: "description",
        content:
          "Ferramentas profissionais japonesas escolhidas por tarefa, construção e utilidade. ANEX, Makita, VESSEL, OLFA, TAJIMA, Ko-ken e outros especialistas.",
      },
      { property: "og:title", content: "REJENDARI — Ferramenta japonesa escolhida para trabalhar" },
      {
        property: "og:description",
        content: "Encontra ferramentas japonesas por trabalho, marca e especificação, com curadoria em Portugal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const BRANDS = [
  "ANEX",
  "MAKITA",
  "VESSEL",
  "OLFA",
  "TAJIMA",
  "KO-KEN",
  "LOBSTER / LOBTEX",
  "ENGINEER",
  "FUJIYA",
  "TSUNODA",
  "TONE",
  "KTC",
  "SILKY",
];

const CATEGORIES: Array<{
  task: string;
  icon: ToolGlyphName;
  label: string;
  note: string;
}> = [
  { task: "precision", icon: "precision", label: "Precisão & eletrónica", note: "ESD, microparafusos, PCs e bancada" },
  { task: "fastening", icon: "driver", label: "Chaves, bits & aperto", note: "Manual, impacto e controlo de torque" },
  { task: "sockets", icon: "socket", label: "Roquetes & sockets", note: "Ko-ken, TONE, KTC e mecânica" },
  { task: "grip", icon: "grip", label: "Alicates & chaves", note: "Grip, corte, canalização e manutenção" },
  { task: "cutting", icon: "cut", label: "Corte & lâminas", note: "OLFA, TAJIMA, Silky e corte de obra" },
  { task: "hvac", icon: "hvac", label: "AVAC & instalação", note: "Instalação, manutenção e trabalho de campo" },
  { task: "power", icon: "power", label: "Máquinas 18V+", note: "Plataformas profissionais a bateria" },
];

const PACKS = ["AVAC", "Eletricidade", "Manutenção", "Solar"];

function Index() {
  const t = useT();
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "home"],
    queryFn: () => fetchProducts(8),
  });

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="technical-grid absolute inset-0 opacity-35" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-16">
          <div className="relative z-10 py-5 lg:py-12">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <span className="jp-label text-primary">日本の工具 · Ferramenta profissional japonesa</span>
            </div>

            <div className="reveal-line mt-8">
              <span>
                <h1 className="max-w-3xl font-display text-[clamp(3.2rem,6.8vw,7rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
                  Ferramenta japonesa
                  <br />
                  <span className="text-primary">escolhida para trabalhar.</span>
                </h1>
              </span>
            </div>

            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              {t("home.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild className="rounded-none px-6">
                <Link to="/shop">
                  {t("home.ctaShop")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-none border-border bg-transparent px-6">
                <Link to="/marcas">Explorar marcas</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 border-y border-border">
              {[
                ["JP", "seleção japonesa"],
                ["PT", "curadoria em Portugal"],
                ["PRO", "dados técnicos claros"],
              ].map(([code, label]) => (
                <div key={code} className="border-r border-border px-3 py-4 first:pl-0 last:border-r-0">
                  <p className="font-display text-xl font-semibold">{code}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-3 -top-5 z-30 hidden w-52 border border-black/15 bg-[#f5f0e5]/94 p-3 text-[#25211c] shadow-[0_12px_35px_rgba(40,33,26,0.12)] backdrop-blur md:block">
              <p className="jp-label text-primary">選定 · escolha técnica</p>
              <p className="mt-2 text-xs leading-5 text-black/58">
                Menos tempo a comparar centenas de referências. Mais contexto para escolher a ferramenta certa.
              </p>
            </div>
            <HeroToolConstellation />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[#0d0f12]">
        <div className="brand-marquee py-5">
          <div className="brand-marquee-track gap-12 pr-12">
            {[...BRANDS, ...BRANDS].map((brand, index) => (
              <Link
                key={brand + index}
                to="/marcas"
                className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[0.19em] text-white/46 transition-colors hover:text-white"
              >
                {brand}
                <span className="h-1 w-1 rounded-full bg-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <p className="jp-label text-primary">仕事別 · comprar por trabalho</p>
            <h2 className="mt-4 max-w-md font-display text-4xl font-semibold leading-[0.98] sm:text-5xl">
              Começa pelo trabalho que tens para fazer.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
              Em vez de navegar por corredores genéricos, entra diretamente em precisão, aperto, sockets, grip, corte,
              AVAC ou máquinas.
            </p>
          </div>

          <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
            {CATEGORIES.map((category, index) => (
              <Link
                key={category.task}
                to="/shop"
                search={{ task: category.task }}
                className="category-tile group min-h-48 bg-surface p-6"
              >
                <div className="flex items-start justify-between">
                  <ToolGlyph name={category.icon} className="h-9 w-9 text-primary" />
                  <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-10 font-display text-xl font-semibold tracking-[-0.035em]">{category.label}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{category.note}</p>
                <ArrowRight className="mt-5 h-4 w-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:text-primary group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/35">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="jp-label text-primary">日本の定番 · destaques japoneses</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
                Seis referências para conhecer a seleção.
              </h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                ANEX, Makita, VESSEL, OLFA, TAJIMA e Ko-ken mostram seis formas diferentes de engenharia japonesa:
                acesso, potência, aparafusamento, corte, medição e mecânica.
              </p>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                Disponibilidade e país de fabrico são indicados por referência quando confirmados
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {JAPAN_TOOL_REFERENCES.slice(0, 6).map((tool) => (
              <ReferenceProductCard key={tool.id} tool={tool} featured />
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-semibold">Procuras uma referência específica?</p>
              <p className="mt-1 text-sm text-muted-foreground">Diz-nos a marca, o modelo ou o trabalho a fazer.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild className="rounded-none">
                <Link to="/marcas">Ver marcas</Link>
              </Button>
              <Button asChild className="rounded-none">
                <Link to="/b2b">
                  Pedir disponibilidade
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="paper-panel overflow-hidden">
        <div className="mx-auto grid max-w-[1440px] gap-0 lg:grid-cols-2">
          <div className="washi-noise relative grid min-h-[430px] grid-cols-2 gap-px overflow-hidden bg-black/10 p-px lg:min-h-[620px]">
            {JAPAN_TOOL_REFERENCES.slice(2, 6).map((tool, index) => (
              <a
                key={tool.id}
                href={tool.referenceUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden bg-[#eee9de]"
              >
                <img
                  src={tool.imageUrl}
                  alt={tool.imageAlt}
                  className="absolute inset-0 h-full w-full object-contain p-7 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent p-4 pt-12 text-white">
                  <p className="jp-label text-white/65">{tool.japanese}</p>
                  <p className="mt-1 font-display text-lg font-semibold">{tool.brand}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/65">{tool.model}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.19em] text-black/50">基準 · como escolhemos</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl">
              O Japão é o ponto de partida. A utilidade decide.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-black/65">
              Procuramos ferramentas que façam sentido no trabalho profissional: boa construção, ergonomia, aplicação clara
              e informação suficiente para saberes o que estás a comprar.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                ["01", "Trabalho", "A ferramenta resolve melhor uma tarefa concreta?"],
                ["02", "Construção", "Materiais, medidas e compatibilidades estão claros?"],
                ["03", "Confiança", "Há informação suficiente para comprar e manter a ferramenta?"],
              ].map(([number, title, text]) => (
                <div key={number} className="border-t border-black/20 pt-4">
                  <span className="font-mono text-[10px] text-black/40">{number}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-black/58">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex items-end justify-between gap-6 border-b border-border pb-5">
          <div>
            <p className="jp-label text-primary">買い物 · comprar</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Loja REJENDARI</h2>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/shop">
              Ir para a loja
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full rounded-none" />
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="grid gap-0 border border-border lg:grid-cols-[1fr_0.8fr]">
              <div className="technical-grid flex min-h-72 items-center justify-center p-10">
                <div className="text-center">
                  <PackageSearch className="mx-auto h-10 w-10 text-primary" />
                  <p className="mt-5 font-display text-2xl font-semibold">{t("shop.empty")}</p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{t("shop.emptyHint")}</p>
                </div>
              </div>
              <div className="flex flex-col justify-center border-t border-border bg-surface p-8 lg:border-l lg:border-t-0">
                <span className="jp-label text-primary">相談 · ajuda a escolher</span>
                <h3 className="mt-3 font-display text-2xl font-semibold">Diz-nos o que procuras.</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Marca, referência, profissão ou tarefa: quanto mais contexto deres, mais fácil é apontar-te para a opção certa.
                </p>
                <Button className="mt-6 w-fit rounded-none" asChild>
                  <Link to="/b2b">Pedir contacto</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-18">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="jp-label text-primary">職人キット · kits profissionais</p>
              </div>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                Menos ferramentas repetidas. Mais cobertura útil.
              </h2>
            </div>
            <Button variant="outline" asChild className="w-fit rounded-none">
              <Link to="/packs">Ver todos os kits</Link>
            </Button>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PACKS.map((pack) => (
              <Link
                key={pack}
                to="/packs"
                className="group flex min-h-32 items-end justify-between border border-border bg-card p-5 transition-colors hover:border-primary/55"
              >
                <div>
                  <p className="font-display text-xl font-semibold">{pack}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                    Core / Compact / Pro
                  </p>
                </div>
                <Sparkles className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-4 border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg font-semibold">Compras para empresa ou equipa?</p>
              <p className="mt-1 text-sm text-muted-foreground">Pede condições para volume, compras recorrentes ou um kit à medida.</p>
            </div>
            <Button asChild className="w-fit rounded-none">
              <Link to="/b2b">Falar com a REJENDARI</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-px bg-border lg:grid-cols-2">
        <div className="bg-background p-7 sm:p-12 lg:p-16">
          <div className="flex items-center gap-3 text-primary">
            <ToolGlyph name="reward" className="h-8 w-8" />
            <span className="jp-label">ポイント · Pontos</span>
          </div>
          <h2 className="mt-6 max-w-lg font-display text-4xl font-semibold leading-[1] tracking-[-0.05em]">
            As tuas compras também acumulam vantagens.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground">{t("home.pointsText")}</p>
          <Button className="mt-7 rounded-none" variant="secondary" asChild>
            <Link to="/pontos">{t("home.pointsCta")}</Link>
          </Button>
        </div>

        <div className="bg-background p-7 sm:p-12 lg:p-16">
          <div className="flex items-center gap-3 text-primary">
            <ToolGlyph name="referral" className="h-8 w-8" />
            <span className="jp-label">紹介 · Convites</span>
          </div>
          <h2 className="mt-6 max-w-lg font-display text-4xl font-semibold leading-[1] tracking-[-0.05em]">
            Partilha a REJENDARI e acompanha as tuas vantagens.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground">
            Cada conta tem um link de convite. Quando existirem campanhas de convite ativas, as condições e os pontos disponíveis aparecem na tua conta.
          </p>
          <Button className="mt-7 rounded-none" variant="outline" asChild>
            <Link to="/pontos">Ver pontos e convites</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
