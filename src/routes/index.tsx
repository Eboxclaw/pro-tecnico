import { AnexSignatureSolutions } from "@/components/shop/AnexSignatureSolutions";
import { AnexDuoHero } from "@/components/shop/AnexDuoHero";
import { AnexFeature } from "@/components/shop/AnexFeature";
import { ProductImage } from "@/components/shop/ProductImage";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, PackageSearch, ShieldCheck, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/shop/ProductCard";
import { ReferenceProductCard } from "@/components/shop/ReferenceProductCard";
import { RatchetDriverComparison } from "@/components/shop/RatchetDriverComparison";
import { BitRegimeComparison } from "@/components/shop/BitRegimeComparison";
import { SmartKitShowcase } from "@/components/shop/SmartKitShowcase";
import { BitKitRail } from "@/components/shop/BitKitRail";
import { RejendariEdit } from "@/components/shop/RejendariEdit";
import { GripWrenchSpotlight } from "@/components/shop/GripWrenchSpotlight";
import { RejendariPromiseStrip } from "@/components/brand/RejendariPromiseStrip";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";
import { LxtCollection } from "@/components/shop/LxtCollection";
import { ArtisanHero } from "@/components/brand/ArtisanHero";
import { HeroToolConstellation } from "@/components/brand/HeroToolConstellation";
import { RejendariSeal } from "@/components/brand/RejendariSeal";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "REJENDARI — O melhor para cada regime de trabalho" },
      {
        name: "description",
        content:
          "Ferramenta profissional escolhida por regime de trabalho: bits e impacto, 1000 V isolado, grip, sockets, eletrónica e veículos elétricos. Japão e Europa no mesmo critério.",
      },
      { property: "og:title", content: "REJENDARI — Ferramenta escolhida para trabalhar" },
      {
        property: "og:description",
        content: "VESSEL, Ko-ken, ANEX, Wera, Knipex, Wiha e Bahco: curadoria técnica em Portugal, do impacto ao 1000 V.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const BRANDS = [
  { label: "ANEX", slug: "ANEX" },
  { label: "MAKITA", slug: "MAKITA" },
  { label: "VESSEL", slug: "VESSEL" },
  { label: "WERA", slug: "WERA" },
  { label: "KNIPEX", slug: "KNIPEX" },
  { label: "WIHA", slug: "WIHA" },
  { label: "BAHCO", slug: "BAHCO" },
  { label: "OLFA", slug: "OLFA" },
  { label: "TAJIMA", slug: "TAJIMA" },
  { label: "KO-KEN", slug: "KO-KEN" },
  { label: "FUJIYA", slug: "FUJIYA" },
  { label: "TSUNODA", slug: "TSUNODA" },
  { label: "TOP KOGYO", slug: "TOP" },
  { label: "ENGINEER", slug: "ENGINEER" },
  { label: "HOZAN", slug: "HOZAN" },
  { label: "LOBSTER / LOBTEX", slug: "LOBSTER" },
  { label: "TONE", slug: "TONE" },
  { label: "KTC", slug: "KTC" },
  { label: "NEPROS", slug: "NEPROS" },
];

const CATEGORIES: Array<{
  task: string;
  icon: ToolGlyphName;
  label: string;
  note: string;
}> = [
  { task: "precision", icon: "precision", label: "Precisão & slim", note: "Elétrico slim, microparafusos e bancada" },
  { task: "fastening", icon: "driver", label: "Chaves, bits & aperto", note: "Impacto, torsion e controlo de torque" },
  { task: "sockets", icon: "socket", label: "Roquetes & sockets", note: "Ko-ken, TONE, KTC e Wera VDE" },
  { task: "grip", icon: "grip", label: "Alicates & chaves", note: "Cobra, Pliers Wrench e ajustáveis" },
  { task: "cutting", icon: "cut", label: "Corte & lâminas", note: "OLFA, TAJIMA e corte de obra" },
  { task: "hvac", icon: "hvac", label: "AVAC & instalação", note: "Tubo, cobre e trabalho de campo" },
  { task: "power", icon: "power", label: "Máquinas 18V+", note: "Plataformas profissionais a bateria" },
  { task: "electronics", icon: "electronics", label: "Eletrónica & bancada", note: "ESD, precisão, PCBs e equipamentos" },
  { task: "ev", icon: "ev", label: "Veículos elétricos", note: "1000 V, torque e cabos HV" },
];

const REGIMES: Array<{ jp: string; label: string; note: string; focus: string }> = [
  { jp: "衝撃", label: "Impacto", note: "Black Ryujin em Cr-Mo-V", focus: "impact-bits" },
  { jp: "捻り", label: "Torsion", note: "Black Ryujin e zonas torsionais", focus: "bits" },
  { jp: "絶縁", label: "1000 V", note: "VDE, slimBits e isolados", focus: "insulated" },
  { jp: "電子", label: "Eletrónica", note: "ESD e precisão de bancada", focus: "electronics" },
  { jp: "電動", label: "VE", note: "Torque e cabos de alta tensão", focus: "ev" },
  { jp: "トルク", label: "Torque", note: "Binário calibrado e controlado", focus: "torque" },
];

const PACKS = ["AVAC", "Eletricidade", "Manutenção", "Solar", "Eletrónica", "Veículos elétricos"];

const HIGHLIGHT_IDS = [
  "anex-397-d",
  "anex-adrs-2065",
  "knipex-cobra-250",
  "vessel-220usb-s1eb",
  "knipex-pliers-wrench-250",
  "olfa-xh-1",
];

const CURATION_IMAGE_IDS = [
  "vessel-220usb-s1eb",
  "top-hm32",
  "tsunoda-wp250sc",
  "olfa-xh-1",
];

function Index() {
  const t = useT();
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "home"],
    queryFn: () => fetchProducts(8),
  });

  const highlightTools = HIGHLIGHT_IDS
    .map((id) => CURATED_TOOL_REFERENCES.find((tool) => tool.id === id))
    .filter((tool): tool is (typeof CURATED_TOOL_REFERENCES)[number] => Boolean(tool));

  const curationImageTools = CURATION_IMAGE_IDS
    .map((id) => CURATED_TOOL_REFERENCES.find((tool) => tool.id === id))
    .filter((tool): tool is (typeof CURATED_TOOL_REFERENCES)[number] => Boolean(tool?.imageUrl));

  return (
    <div>
      <ArtisanHero />
      <section id="selecao" className="artisan-introduction scroll-mt-40">
        <p className="artisan-section-index">01 / A NOSSA SELEÇÃO</p>
        <h2>Uma boa ferramenta<br /><span>muda a forma de trabalhar.</span></h2>
        <div><p>O equilíbrio na mão. O encaixe exato. O controlo no último aperto. Procuramos esses detalhes nas ferramentas que escolhemos.</p><p>A ANEX tem um lugar especial nesta seleção, ao lado de VESSEL, Ko-ken e outras marcas que estudamos pelo trabalho que resolvem.</p><Link to="/shop" className="artisan-text-link">Encontrar a ferramenta certa <ArrowRight size={16} aria-hidden="true" /></Link></div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-16 pt-14 sm:px-6 lg:pb-20">
        <div className="relative">
          <RejendariSeal className="absolute -left-5 -top-6 z-40 hidden md:grid" />
          <HeroToolConstellation />
        </div>
      </section>

      <section className="border-b border-border bg-[#0d0f12]">
        <div className="brand-marquee py-5">
          <div className="brand-marquee-track gap-12 pr-12">
            {[...BRANDS, ...BRANDS].map((brand, index) => (
              <Link
                key={brand.slug + index}
                to="/marcas"
                search={{ brand: brand.slug }}
                className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[0.19em] text-white/46 transition-colors hover:text-white"
              >
                {brand.label}
                <span className="h-1 w-1 rounded-full bg-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LxtCollection />

      <AnexFeature />
      <AnexSignatureSolutions />
      <AnexDuoHero />
      <RejendariPromiseStrip />

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

      <section className="paper-panel">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-18">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.19em] text-black/50">仕事の条件 · como organizamos tudo</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl">
                Seis regimes de trabalho. Uma só curadoria.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-black/60">
              Não é uma loja de marcas — é uma loja de regimes. Cada família tem de ter uma razão técnica para estar
              aqui, venha do Japão, da Alemanha ou da Suécia.
            </p>
          </div>

          <div className="mt-10 grid gap-px border border-black/15 bg-black/15 sm:grid-cols-2 lg:grid-cols-3">
            {REGIMES.map((regime, index) => (
              <Link
                key={regime.label}
                to="/shop"
                search={{ focus: regime.focus }}
                className="group relative bg-[#f3eee2] p-6 transition-colors hover:bg-[#efe8d8]"
              >
                <div className="flex items-baseline justify-between">
                  <span className="jp-label text-primary">{regime.jp}</span>
                  <span className="font-mono text-[10px] text-black/38">0{index + 1}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.035em]">{regime.label}</h3>
                <p className="mt-2 text-xs text-black/58">{regime.note}</p>
                <ArrowRight className="mt-5 h-4 w-4 -translate-x-1 text-black/40 opacity-0 transition-all group-hover:translate-x-0 group-hover:text-primary group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <GripWrenchSpotlight />

      <RejendariEdit />

      <section className="border-y border-border bg-surface/35">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="jp-label text-primary">選定 · destaques da seleção</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
                Seis referências para conhecer a seleção.
              </h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                ANEX, WERA, KNIPEX, VESSEL e OLFA mostram cinco escolas da seleção: aperto ratchet, sistema VDE com
                roquete, alicate auto-bloqueante, Ball Grip elétrico e corte industrial.
              </p>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                Medidas de produto seguem o sistema métrico quando aplicável; encaixes técnicos mantêm 1/4″, 3/8″ ou 1/2″ quando esse é o padrão
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlightTools.map((tool) => (
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

      <RatchetDriverComparison />

      <BitRegimeComparison />

      <SmartKitShowcase />

      <BitKitRail />

      <section className="paper-panel overflow-hidden">
        <div className="mx-auto grid max-w-[1440px] gap-0 lg:grid-cols-2">
          <div className="washi-noise relative grid min-h-[430px] grid-cols-2 gap-px overflow-hidden bg-black/10 p-px lg:min-h-[620px]">
            {curationImageTools.map((tool) => (
              <Link
                key={tool.id}
                to="/referencia/$id"
                params={{ id: tool.id }}
                className="group relative overflow-hidden bg-[#eee9de]"
              >
                <ProductImage
                  src={tool.imageUrl!}
                  alt={tool.imageAlt ?? tool.namePt}
                  className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent p-4 pt-12 text-white">
                  <p className="jp-label text-white/65">{tool.japanese}</p>
                  <p className="mt-1 font-display text-lg font-semibold">{tool.brand}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/65">REF {tool.officialCode ?? tool.model}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.19em] text-black/50">基準 · como escolhemos</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl">
              O regime de trabalho é o ponto de partida. A utilidade decide.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-black/65">
              Procuramos ferramentas que façam sentido no trabalho profissional, venham do Japão, da Alemanha ou da
              Suécia: boa construção, ergonomia, aplicação clara e informação suficiente para saberes o que estás a
              comprar.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                ["01", "Trabalho", "A ferramenta resolve melhor uma tarefa concreta?"],
                ["02", "Compatibilidade", "Medidas úteis para Portugal/UE e interfaces técnicas claramente identificadas."],
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

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
