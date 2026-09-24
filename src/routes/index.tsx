import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, PackageSearch, Ticket } from "lucide-react";
import { useT, useLocale, type Locale } from "@/lib/i18n";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import hero from "@/assets/hero-japanese-tools.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rejendarī — Ferramenta profissional japonesa" },
      {
        name: "description",
        content:
          "Loja portuguesa especialista em ferramenta profissional japonesa, com VESSEL e ANEX como marcas âncora.",
      },
      { property: "og:title", content: "Rejendarī — Ferramenta profissional japonesa" },
      {
        property: "og:description",
        content: "Precisão japonesa para profissionais europeus. VESSEL e ANEX em destaque.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PACKS: { key: string; label: Record<Locale, string> }[] = [
  { key: "hvac", label: { pt: "AVAC", en: "HVAC", es: "HVAC" } },
  { key: "eletricista", label: { pt: "Eletricista", en: "Electrician", es: "Electricista" } },
  { key: "manutencao", label: { pt: "Manutenção", en: "Maintenance", es: "Mantenimiento" } },
  { key: "solar", label: { pt: "Solar", en: "Solar", es: "Solar" } },
  { key: "canalizacao", label: { pt: "Canalização", en: "Plumbing", es: "Fontanería" } },
];

const BRANDS = ["VESSEL", "ANEX", "ENGINEER", "FUJIYA", "TSUNODA", "TONE", "KO-KEN", "OLFA"];

const TASKS = [
  { pt: "Aparafusar", en: "Driving", es: "Atornillar" },
  { pt: "Impacto", en: "Impact", es: "Impacto" },
  { pt: "Precisão", en: "Precision", es: "Precisión" },
  { pt: "Corte", en: "Cutting", es: "Corte" },
  { pt: "Aperto", en: "Fastening", es: "Apriete" },
  { pt: "Manutenção", en: "Maintenance", es: "Mantenimiento" },
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
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          width={1600}
          height={900}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <p className="font-display text-2xl font-bold sm:text-3xl">Rejendarī</p>
          <span className="tech-label mt-8 inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-primary">
            <BadgeCheck className="h-3.5 w-3.5" />
            {t("home.badge")}
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {t("home.japanTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            {t("home.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/shop">
                {t("home.ctaShop")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/packs">{t("home.ctaPacks")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="tech-label text-primary">{t("home.japanLabel")}</p>
              <h2 className="mt-3 font-display text-3xl font-bold">VESSEL / ANEX</h2>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">{t("home.japanText")}</p>
            </div>
            <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3">
              {TASKS.map((task) => (
                <Link key={task.pt} to="/shop" className="bg-surface px-4 py-5 font-mono text-sm transition-colors hover:bg-secondary">
                  {task[locale]}
                </Link>
              ))}
            </div>
          </div>
          <p className="mt-6 border-l border-border pl-3 font-mono text-xs text-muted-foreground">{t("home.originNote")}</p>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
          {[
            { icon: BadgeCheck, title: t("home.value1Title"), text: t("home.value1Text") },
            { icon: PackageSearch, title: t("home.value2Title"), text: t("home.value2Text") },
            { icon: Ticket, title: t("home.value3Title"), text: t("home.value3Text") },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <Icon className="h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-display font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {t("nav.shop")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("shop.subtitle")}</p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/shop">
              {t("common.viewDetails")}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full rounded-lg" />
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center">
              <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 font-display text-lg font-semibold">{t("shop.empty")}</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {t("shop.emptyHint")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Packs */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {t("home.packsTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("home.packsSubtitle")}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PACKS.map((p) => (
              <Link
                key={p.key}
                to="/packs"
                className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50"
              >
                <p className="tech-label text-muted-foreground">
                  {t("packs.core")} · {t("packs.compact")} · {t("packs.pro")}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold group-hover:text-primary">
                  {p.label[locale]}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Points teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-lg border border-border bg-card p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="tech-label text-primary">{t("nav.points")}</span>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {t("home.pointsTitle")}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                {t("home.pointsText")}
              </p>
              <Button className="mt-6" variant="secondary" asChild>
                <Link to="/pontos">{t("home.pointsCta")}</Link>
              </Button>
            </div>
            <div className="hatch rounded-md border border-border p-6">
              <p className="font-mono text-sm text-muted-foreground">{t("points.howTitle")}</p>
              <ul className="mt-4 space-y-3 font-mono text-sm">
                {[t("points.how1"), t("points.how2"), t("points.how3"), t("points.how4")].map(
                  (line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 bg-primary" />
                      {line}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {t("home.brandsTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("home.brandsSubtitle")}</p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {BRANDS.map((brand) => (
              <Link
                key={brand}
                to="/marcas"
                className="flex h-16 items-center justify-center rounded-md border border-border bg-card font-mono text-sm tracking-widest text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {brand.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
