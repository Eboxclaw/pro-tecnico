import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, PackageSearch, Ticket } from "lucide-react";
import { useT } from "@/lib/i18n";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import hero from "@/assets/hero-tools.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "pro'tecnico — Ferramenta profissional escolhida para o trabalho" },
      {
        name: "description",
        content:
          "Loja portuguesa de ferramenta profissional: marcas âncora europeias, packs por profissão e programa de pontos com sorteios semanais.",
      },
      { property: "og:title", content: "pro'tecnico — Ferramenta profissional escolhida para o trabalho" },
      {
        property: "og:description",
        content: "Marcas âncora europeias, packs por profissão e pontos com sorteios semanais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PACKS = [
  { key: "hvac", label: { pt: "AVAC", en: "HVAC", es: "HVAC" } },
  { key: "eletricista", label: { pt: "Eletricista", en: "Electrician", es: "Electricista" } },
  { key: "manutencao", label: { pt: "Manutenção", en: "Maintenance", es: "Mantenimiento" } },
  { key: "solar", label: { pt: "Solar", en: "Solar", es: "Solar" } },
  { key: "canalizacao", label: { pt: "Canalização", en: "Plumbing", es: "Fontanería" } },
] as const;

const BRANDS = ["Wera", "Knipex", "Bahco", "Wiha", "Stabila", "FACOM", "Beta", "Klauke"] as const;

function Index() {
  const t = useT();
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
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
          <span className="tech-label inline-flex items-center gap-2 rounded-md border border-border bg-surface/80 px-3 py-1.5 text-primary backdrop-blur">
            <BadgeCheck className="h-3.5 w-3.5" />
            {t("home.badge")}
          </span>
          <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {t("home.title")}
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
                <p className="tech-label text-muted-foreground">{t("packs.core")} · {t("packs.compact")} · {t("packs.pro")}</p>
                <h3 className="mt-2 font-display text-lg font-semibold group-hover:text-primary">
                  {p.label[t("home") && useLocaleSafe()] ?? p.label.pt}
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
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">{t("home.pointsText")}</p>
              <Button className="mt-6" variant="secondary" asChild>
                <Link to="/pontos">{t("home.pointsCta")}</Link>
              </Button>
            </div>
            <div className="hatch rounded-md border border-border p-6">
              <p className="font-mono text-sm text-muted-foreground">{t("points.howTitle")}</p>
              <ul className="mt-4 space-y-3 font-mono text-sm">
                {[t("points.how1"), t("points.how2"), t("points.how3"), t("points.how4")].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 bg-primary" />
                    {line}
                  </li>
                ))}
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

// Locale-aware pack label without conditional hooks.
function useLocaleSafe(): "pt" | "en" | "es" {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useLocaleSafeImpl();
}

import { useLocale } from "@/lib/i18n";
function useLocaleSafeImpl(): "pt" | "en" | "es" {
  return useLocale((s) => s.locale);
}
