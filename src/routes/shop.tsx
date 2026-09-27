import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PackageSearch, SlidersHorizontal } from "lucide-react";
import { useT } from "@/lib/i18n";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/shop/ProductCard";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const TASKS: Array<{ id: string; label: string; jp: string; icon: ToolGlyphName }> = [
  { id: "precision", label: "Precisão & eletrónica", jp: "精密工具", icon: "precision" },
  { id: "fastening", label: "Chaves, bits & aperto", jp: "締結工具", icon: "driver" },
  { id: "sockets", label: "Roquetes & sockets", jp: "ソケット", icon: "socket" },
  { id: "grip", label: "Alicates, grip & chaves", jp: "作業工具", icon: "grip" },
  { id: "cutting", label: "Corte & lâminas", jp: "切削工具", icon: "cut" },
  { id: "hvac", label: "AVAC, mecânica & instalação", jp: "設備工具", icon: "hvac" },
  { id: "power", label: "Máquinas 18V+", jp: "電動工具", icon: "power" },
];

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { brand?: string; task?: string } => ({
    brand: typeof search["brand"] === "string" ? (search["brand"] as string) : undefined,
    task: typeof search["task"] === "string" ? (search["task"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Loja de ferramenta profissional — REJENDARI" },
      {
        name: "description",
        content: "Ferramenta profissional japonesa organizada por trabalho real: precisão, sockets, grip, corte, AVAC e máquinas 18V+.",
      },
      { property: "og:title", content: "Loja — REJENDARI" },
      { property: "og:description", content: "Ferramenta profissional organizada por trabalho, marca, dados técnicos e preço." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function hasTask(productTags: string[], task: string) {
  const normalized = productTags.map((tag) => tag.toLowerCase().trim());
  return normalized.some(
    (tag) =>
      tag === task ||
      tag === `task:${task}` ||
      tag === `use:${task}` ||
      tag.replace(/\s+/g, "-") === task,
  );
}

function ShopPage() {
  const t = useT();
  const search = Route.useSearch();
  const [brand, setBrand] = useState<string>(search.brand ?? "all");
  const [category, setCategory] = useState<string>("all");
  const [task, setTask] = useState<string>(search.task ?? "all");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "shop"],
    queryFn: () => fetchProducts(100),
  });

  const brands = useMemo(
    () => Array.from(new Set((products ?? []).map((p) => p.node.vendor).filter(Boolean))).sort(),
    [products],
  );
  const categories = useMemo(
    () => Array.from(new Set((products ?? []).map((p) => p.node.productType).filter(Boolean))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    let list = products ?? [];
    if (brand !== "all") list = list.filter((p) => p.node.vendor === brand);
    if (category !== "all") list = list.filter((p) => p.node.productType === category);
    if (task !== "all") list = list.filter((p) => hasTask(p.node.tags, task));
    const cap = parseFloat(maxPrice);
    if (Number.isFinite(cap) && cap > 0) {
      list = list.filter((p) => parseFloat(p.node.priceRange.minVariantPrice.amount) <= cap);
    }
    return list;
  }, [products, brand, category, task, maxPrice]);

  const hasFilters = brand !== "all" || category !== "all" || task !== "all" || maxPrice !== "";

  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-16">
          <p className="jp-label text-primary">工具一覧 · REJENDARI / catálogo</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">{t("shop.title")}</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{t("shop.subtitle")}</p>
            </div>
            <p className="max-w-md border-l border-primary/65 pl-4 font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-muted-foreground">
              Origem da marca e país de fabrico são campos separados. “Made in Japan” só aparece quando estiver confirmado para esse SKU.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-7">
          {TASKS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setTask(task === item.id ? "all" : item.id)}
              className={`category-tile flex min-h-28 flex-col items-start justify-between p-4 text-left ${
                task === item.id ? "bg-secondary text-foreground" : "bg-surface text-muted-foreground"
              }`}
            >
              <ToolGlyph name={item.icon} className={`h-6 w-6 ${task === item.id ? "text-primary" : ""}`} />
              <span className="mt-5">
                <span className="block text-[11px] leading-4">{item.label}</span>
                <span className="jp-label mt-1 block text-[9px] text-muted-foreground/55">{item.jp}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:py-10">
        <div className="signal-rule flex flex-wrap items-center gap-3 border border-border bg-card p-4 pt-5">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger className="w-44 bg-background">
              <SelectValue placeholder={t("common.allBrands")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.allBrands")}</SelectItem>
              {brands.map((value) => (
                <SelectItem key={value} value={value}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48 bg-background">
              <SelectValue placeholder={t("common.allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.allCategories")}</SelectItem>
              {categories.map((value) => (
                <SelectItem key={value} value={value}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            min="0"
            placeholder={t("common.price")}
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="w-36 bg-background"
          />

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setBrand("all");
                setCategory("all");
                setTask("all");
                setMaxPrice("");
              }}
            >
              {t("common.clearFilters")}
            </Button>
          )}

          {products && (
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
              {filtered.length} {t("common.results")}
            </span>
          )}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full rounded-none" />
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="grid border border-border lg:grid-cols-[1fr_0.72fr]">
              <div className="technical-grid flex min-h-[380px] items-center justify-center p-10 text-center">
                <div>
                  <PackageSearch className="mx-auto h-11 w-11 text-primary" />
                  <p className="mt-5 font-display text-2xl font-semibold">{t("shop.empty")}</p>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">{t("shop.emptyHint")}</p>
                </div>
              </div>
              <div className="border-t border-border bg-surface p-8 lg:border-l lg:border-t-0">
                <p className="jp-label text-primary">掲載基準 · o que aparece aqui</p>
                <ul className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
                  <li>Imagens de produto aprovadas pelo fornecedor, não renders inventados.</li>
                  <li>SKU / EAN / dimensões / compatibilidade antes de copy de marketing.</li>
                  <li>País de fabrico apenas quando estiver verificado para a referência exata.</li>
                  <li>A apresentação especial de produto é ativada por tags no Shopify.</li>
                </ul>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <p className="border border-border py-20 text-center text-muted-foreground">{t("shop.noResults")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
