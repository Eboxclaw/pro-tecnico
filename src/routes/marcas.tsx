import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReferenceProductCard } from "@/components/shop/ReferenceProductCard";
import { BRAND_STORIES, BRAND_STORY_MAP } from "@/data/brand-stories";
import { QUICK_BRANDS, referencesForBrand } from "@/data/curated-tool-references";

export const Route = createFileRoute("/marcas")({
  validateSearch: (search: Record<string, unknown>): { brand?: string } => ({
    brand: typeof search["brand"] === "string" ? (search["brand"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Marcas de ferramenta japonesa — REJENDARI" },
      {
        name: "description",
        content:
          "Histórias, especialidades e referências selecionadas de ANEX, Makita, VESSEL, OLFA, Tajima, Ko-ken, Fujiya, ENGINEER, HOZAN, LOBTEX e TONE.",
      },
      { property: "og:title", content: "Marcas japonesas — REJENDARI" },
      { property: "og:description", content: "Conhece a história de cada marca e explora todas as referências REJENDARI selecionadas desse fabricante." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  const search = Route.useSearch();
  const requested = search.brand?.toUpperCase();
  const selectedSlug = requested && BRAND_STORY_MAP[requested] ? requested : QUICK_BRANDS[0];
  const selected = BRAND_STORY_MAP[selectedSlug];
  const products = referencesForBrand(selectedSlug);
  const otherBrands = BRAND_STORIES.filter((brand) => brand.slug !== selectedSlug);

  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-18">
          <p className="jp-label text-primary">ブランド · marcas japonesas</p>
          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
              A ferramenta começa
              <br />
              <span className="text-primary">na história de quem a faz.</span>
            </h1>
            <div>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                Escolhe uma marca para perceber onde ela é realmente forte e ver todas as referências que já fazem parte da seleção REJENDARI.
              </p>
              <p className="mt-5 border-l border-primary/70 pl-4 font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-muted-foreground">
                Filtros rápidos por marca · produtos organizados por aplicação · medidas adaptadas a Portugal / UE
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-[137px] z-30 border-b border-border bg-background/94 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {QUICK_BRANDS.map((brand) => {
            const story = BRAND_STORY_MAP[brand];
            const active = brand === selectedSlug;
            const count = referencesForBrand(brand).length;
            return (
              <Link
                key={brand}
                to="/marcas"
                search={{ brand }}
                className={`flex min-w-max items-center gap-2 border px-3 py-2 text-xs transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
              >
                <span className="font-semibold">{story?.name ?? brand}</span>
                <span className={`font-mono text-[9px] ${active ? "text-primary-foreground/65" : "text-muted-foreground/55"}`}>{count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="paper-panel overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative overflow-hidden border-b border-black/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
            <div className="washi-noise absolute inset-0 opacity-45" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="jp-label text-[#b54530]">{selected.jp} · {selected.specialty}</p>
                  <h2 className="mt-4 font-display text-5xl font-semibold tracking-[-0.06em] text-[#24211d] sm:text-6xl">
                    {selected.name}
                  </h2>
                </div>
                <ShieldCheck className="h-6 w-6 text-[#b54530]" />
              </div>
              <h3 className="mt-10 max-w-2xl font-display text-3xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#24211d]">
                {selected.headline}
              </h3>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-black/65">{selected.story}</p>
              <p className="mt-5 max-w-2xl border-l border-[#b54530]/55 pl-4 text-sm leading-7 text-black/58">{selected.whyPt}</p>

              {selected.sourceUrl && (
                <a
                  href={selected.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-black/52 hover:text-[#b54530]"
                >
                  {selected.sourceLabel ?? "Fonte da marca"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="bg-background p-7 sm:p-10 lg:p-14">
            <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="jp-label text-primary">選定工具 · seleção REJENDARI</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.045em]">
                  Todas as referências {selected.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {products.length} {products.length === 1 ? "referência selecionada" : "referências selecionadas"}.
                </p>
              </div>
              <Button variant="outline" className="w-fit rounded-none" asChild>
                <Link to="/shop" search={{ brand: selectedSlug }}>
                  Filtrar na loja
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {products.map((tool) => (
                <ReferenceProductCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="jp-label text-primary">次のブランド · descobrir mais</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.045em]">Outros especialistas japoneses</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Cada marca entra por uma especialidade concreta. Usa estes cartões como filtro rápido para saltar diretamente para a história e os produtos.
          </p>
        </div>

        <div className="mt-7 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {otherBrands.map((brand) => {
            const count = referencesForBrand(brand.slug).length;
            return (
              <Link
                key={brand.slug}
                to="/marcas"
                search={{ brand: brand.slug }}
                className="group flex min-h-56 flex-col bg-card p-6 transition-colors hover:bg-secondary"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="jp-label text-primary">{brand.jp}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{count} refs.</span>
                </div>
                <h3 className="mt-8 font-display text-3xl font-semibold tracking-[-0.05em]">{brand.name}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{brand.specialty}</p>
                <p className="mt-5 line-clamp-2 text-sm leading-6 text-muted-foreground">{brand.headline}</p>
                <span className="mt-auto inline-flex items-center text-xs font-medium text-primary">
                  Ver marca
                  <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
