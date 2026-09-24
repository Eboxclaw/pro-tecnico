import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PackageSearch, SlidersHorizontal } from "lucide-react";
import { useT } from "@/lib/i18n";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/shop/ProductCard";
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

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    brand: typeof search.brand === "string" ? search.brand : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Loja — Rejendarī" },
      {
        name: "description",
        content: "Catálogo profissional de ferramenta Rejendarī: filtra por marca, categoria e preço.",
      },
      { property: "og:title", content: "Loja — Rejendarī" },
      {
        property: "og:description",
        content: "Catálogo profissional de ferramenta: filtra por marca, categoria e preço.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const t = useT();
  const search = Route.useSearch();
  const [brand, setBrand] = useState<string>(search.brand ?? "all");
  const [category, setCategory] = useState<string>("all");
  const [task, setTask] = useState<string>("all");
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
    if (task !== "all") list = list.filter((p) => p.node.tags.some((tag) => tag.toLowerCase() === task.toLowerCase()));
    const cap = parseFloat(maxPrice);
    if (Number.isFinite(cap) && cap > 0) {
      list = list.filter((p) => parseFloat(p.node.priceRange.minVariantPrice.amount) <= cap);
    }
    return list;
  }, [products, brand, category, task, maxPrice]);

  const tasks = ["Aparafusar", "Impacto", "Precisão", "Corte", "Aperto", "Manutenção"];
  const hasFilters = brand !== "all" || category !== "all" || task !== "all" || maxPrice !== "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t("shop.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("shop.subtitle")}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("common.allBrands")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.allBrands")}</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("common.allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.allCategories")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={task} onValueChange={setTask}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("shop.allTasks")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("shop.allTasks")}</SelectItem>
            {tasks.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input
          type="number"
          min="0"
          placeholder={t("common.price")}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-32"
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
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            {filtered.length} {t("common.results")}
          </span>
        )}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full rounded-lg" />
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-16 text-center">
            <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-display text-lg font-semibold">{t("shop.empty")}</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("shop.emptyHint")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">{t("shop.noResults")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
