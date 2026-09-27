import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, PackageSearch, ShieldCheck, Sparkles } from "lucide-react";
import { useT, useLocale, type Locale } from "@/lib/i18n";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/shop/ProductCard";
import { ReferenceProductCard } from "@/components/shop/ReferenceProductCard";
import { JAPAN_TOOL_REFERENCES, JAPAN_REFERENCE_QUEUE } from "@/data/curated-tool-references";
import { LegendaryProductStage } from "@/components/brand/LegendaryProductStage";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import heroJapanese from "@/assets/hero-japanese-tools.jpg";
import heroTools from "@/assets/hero-tools.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "REJENDARI — Ferramenta profissional japonesa, curada em Portugal" },
      {
        name: "description",
        content:
          "Ferramenta profissional japonesa selecionada por trabalho, especificação e suporte. VESSEL, Ko-ken, OLFA, LOBSTER, ANEX, Makita, Tajima e mais.",
      },
      { property: "og:title", content: "REJENDARI — Ferramentas que vale a pena conhecer" },
      {
        property: "og:description",
        content: "Precisão japonesa para profissionais europeus, organizada pelo trabalho real e não pelo hype.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const BRANDS = [
  "VESSEL",
  "KO-KEN",
  "OLFA",
  "LOBSTER / LOBTEX",
  "ANEX",
  "MAKITA",
  "ENGINEER",
  "FUJIYA",
  "TSUNODA",
  "TONE",
  "KTC",
  "TAJIMA",
  "SILKY",
];

const CATEGORIES: Array<{
  task: string;
  icon: ToolGlyphName;
  label: Record<Locale, string>;
  note: Record<Locale, string>;
}> = [
  {
    task: "precision",
    icon: "precision",
    label: { pt: "Precisão & eletrónica", en: "Precision & electronics", es: "Precisión y electrónica" },
    note: { pt: "ESD, microparafusos, PCs", en: "ESD, micro screws, PCs", es: "ESD, microtornillos, PCs" },
  },
  {
    task: "fastening",
    icon: "driver",
    label: { pt: "Chaves, bits & aperto", en: "Drivers, bits & fastening", es: "Puntas y apriete" },
    note: { pt: "Mão, impacto e torque", en: "Hand, impact and torque", es: "Manual, impacto y par" },
  },
  {
    task: "sockets",
    icon: "socket",
    label: { pt: "Roquetes & sockets", en: "Ratchets & sockets", es: "Carracas y vasos" },
    note: { pt: "Ko-ken, TONE, KTC", en: "Ko-ken, TONE, KTC", es: "Ko-ken, TONE, KTC" },
  },
  {
    task: "grip",
    icon: "grip",
    label: { pt: "Alicates & chaves", en: "Pliers & wrenches", es: "Alicates y llaves" },
    note: { pt: "Grip, corte e canalização", en: "Grip, cutting and plumbing", es: "Agarre, corte y fontanería" },
  },
  {
    task: "cutting",
    icon: "cut",
    label: { pt: "Corte & lâminas", en: "Cutting & blades", es: "Corte y cuchillas" },
    note: { pt: "OLFA, Tajima, Silky", en: "OLFA, Tajima, Silky", es: "OLFA, Tajima, Silky" },
  },
  {
    task: "hvac",
    icon: "hvac",
    label: { pt: "AVAC & instalação", en: "HVAC & installation", es: "HVAC e instalación" },
    note: { pt: "Ferramenta real de obra", en: "Real field tools", es: "Herramienta real de obra" },
  },
  {
    task: "power",
    icon: "power",
    label: { pt: "Máquinas 18V+", en: "Power tools 18V+", es: "Máquinas 18V+" },
    note: { pt: "Ecossistemas profissionais", en: "Professional ecosystems", es: "Ecosistemas profesionales" },
  },
];

const PACKS: { key: string; label: Record<Locale, string> }[] = [
  { key: "hvac", label: { pt: "AVAC", en: "HVAC", es: "HVAC" } },
  { key: "eletricista", label: { pt: "Eletricidade", en: "Electrical", es: "Electricidad" } },
  { key: "manutencao", label: { pt: "Manutenção", en: "Maintenance", es: "Mantenimiento" } },
  { key: "solar", label: { pt: "Solar", en: "Solar", es: "Solar" } },
];

function Index() {
  const t = useT();
  const locale = useLocale((s) => s.locale);
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
              <span className="jp-label text-primary">日本の工具 · Curadoria em Portugal</span>
            </div>

            <div className="reveal-line mt-8">
              <span>
                <h1 className="max-w-3xl font-display text-[clamp(3.4rem,7vw,7.2rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
                  Ferramentas que vale
                  <br />
                  <span className="text-primary">a pena conhecer.</span>
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
                <Link to="/marcas">{t("nav.brands")}</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 border-y border-border">
              {[
                ["JP", locale === "pt" ? "foco de curadoria" : "curation focus"],
                ["EU", locale === "pt" ? "entrega e suporte" : "delivery & support"],
                ["SKU", locale === "pt" ? "origem verificada" : "origin verified"],
              ].map(([code, label]) => (
                <div key={code} className="border-r border-border px-3 py-4 first:pl-0 last:border-r-0">
                  <p className="font-display text-xl font-semibold">{code}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-3 -top-5 z-20 hidden w-44 border border-border bg-background/90 p-3 backdrop-blur md:block">
              <p className="jp-label text-primary">選定基準 · critério de seleção</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Trabalho → material → ergonomia → suporte → origem.
              </p>
            </div>
            <LegendaryProductStage
              imageUrl={heroTools}
              alt="Ferramentas profissionais selecionadas pela REJENDARI"
              eyebrow="REJENDARI / ESTUDO DE OBJETO 001"
              className="min-h-[430px] lg:min-h-[590px]"
            />
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

      <section className="border-b border-border bg-surface/35">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="jp-label text-primary">日本の定番 · seleção japonesa</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
                Best sellers, ícones e ferramentas assinatura do Japão.
              </h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Aqui a regra é simples: só entram marcas japonesas. Escolhemos uma referência forte por fabricante para
                evitar repetir a mesma marca e para mostrar melhor a amplitude real do catálogo japonês — aparafusamento,
                roquetes, corte, medição, eletricidade, grip e ferramentas de resolução de problemas.
              </p>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                Referências editoriais · não significam stock · país de fabrico continua a ser verificado por SKU
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {JAPAN_TOOL_REFERENCES.slice(0, 3).map((tool) => (
              <ReferenceProductCard key={tool.id} tool={tool} featured />
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {JAPAN_TOOL_REFERENCES.slice(3).map((tool) => (
              <ReferenceProductCard key={tool.id} tool={tool} />
            ))}
          </div>

          <div className="mt-7 border border-border bg-background p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="jp-label text-primary">次の候補 · próximos japoneses</p>
                <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  Próxima camada de pesquisa, sem misturar Global Specials nesta secção.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:max-w-3xl lg:justify-end">
                {JAPAN_REFERENCE_QUEUE.map((item) => (
                  <span key={item} className="border border-border bg-card px-3 py-2 font-mono text-[9px] uppercase tracking-[0.11em] text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <p className="jp-label text-primary">仕事別 · comprar pelo trabalho real</p>
            <h2 className="mt-4 max-w-md font-display text-4xl font-semibold leading-[0.98] sm:text-5xl">
              Categorias feitas para a forma como as ferramentas são realmente usadas.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
              Precisão vive com eletrónica. Canalização conduz naturalmente a alicates e chaves. Sockets vivem com roquetes.
              A loja segue o trabalho real em vez de repetir prateleiras herdadas do retalho.
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
                <h3 className="mt-10 font-display text-xl font-semibold tracking-[-0.035em]">
                  {category.label[locale]}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">{category.note[locale]}</p>
                <ArrowRight className="mt-5 h-4 w-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:text-primary group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="paper-panel overflow-hidden">
        <div className="mx-auto grid max-w-[1440px] gap-0 lg:grid-cols-2">
          <div className="relative min-h-[430px] overflow-hidden lg:min-h-[640px]">
            <img
              src={heroJapanese}
              alt="Ferramentas manuais profissionais japonesas"
              className="absolute inset-0 h-full w-full object-cover grayscale-[12%] contrast-[1.04]"
              width={1200}
              height={900}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 border border-white/25 bg-black/55 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
              Fotografia de produto / especificação primeiro / sem ratings inventados
            </div>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.19em] text-black/50">基準 · o padrão REJENDARI</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl">
              O Japão é o ponto de partida. Boa engenharia é a regra.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-black/65">
              VESSEL, Ko-ken, OLFA, LOBSTER, ANEX, Makita, ENGINEER, Fujiya, Tsunoda, TONE, KTC, Tajima e Silky
              formam o primeiro núcleo de pesquisa. Disponibilidade, direitos de imagem, fornecedor, garantia e margem
              continuam a decidir o que entra realmente na loja.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                ["01", "Aplicação", "Resolve melhor um trabalho profissional real?"],
                ["02", "Evidência", "Materiais, normas, dimensões e compatibilidade ficam explícitos."],
                ["03", "Pós-venda", "Fornecimento, garantia e reposição contam tanto como a primeira impressão."],
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

      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="flex items-end justify-between gap-6 border-b border-border pb-5">
          <div>
            <p className="jp-label text-primary">販売準備 · catálogo real</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{t("nav.shop")}</h2>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/shop">
              {t("common.viewDetails")}
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
              <div className="border-t border-border bg-surface p-8 lg:border-l lg:border-t-0">
                <span className="jp-label text-primary">商品情報 · integridade do catálogo</span>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Não vamos encher a loja com SKUs inventados, reviews falsas ou claims copiados. O catálogo Shopify aparece aqui
                  à medida que entram produtos reais com dados e imagens aprovados pelo fornecedor.
                </p>
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
        <div className="mx-auto grid max-w-[1440px] gap-px bg-border lg:grid-cols-2">
          <div className="bg-background p-7 sm:p-12 lg:p-16">
            <div className="flex items-center gap-3 text-primary">
              <ToolGlyph name="reward" className="h-8 w-8" />
              <span className="jp-label">ポイント · REJENDARI Points</span>
            </div>
            <h2 className="mt-6 max-w-lg font-display text-4xl font-semibold leading-[1] tracking-[-0.05em]">
              Fidelização com valor útil mesmo sem depender da sorte.
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
              O teu link, a tua atribuição, o mesmo saldo de pontos.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground">
              Os links de convite são guardados antes do login e associados à conta depois do registo. Quando a condição da
              campanha for cumprida, a recompensa entra no mesmo saldo de pontos.
            </p>
            <Button className="mt-7 rounded-none" variant="outline" asChild>
              <Link to="/pontos">Pontos & convites</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <p className="jp-label text-primary">職人キット · malas profissionais</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PACKS.map((pack) => (
            <Link
              key={pack.key}
              to="/packs"
              className="group flex min-h-32 items-end justify-between border border-border bg-card p-5 transition-colors hover:border-primary/55"
            >
              <div>
                <p className="font-display text-xl font-semibold">{pack.label[locale]}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                  Core / Compact / Pro
                </p>
              </div>
              <Sparkles className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
