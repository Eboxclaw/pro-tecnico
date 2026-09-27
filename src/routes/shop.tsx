import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { useT } from "@/lib/i18n";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/shop/ProductCard";
import { ReferenceProductCard } from "@/components/shop/ReferenceProductCard";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";
import { JAPAN_TOOL_REFERENCES, QUICK_BRANDS, QUICK_FOCUS, referencesForFocus } from "@/data/curated-tool-references";
import { BRAND_STORY_MAP } from "@/data/brand-stories";
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

const TASKS: Array<{ id: "precision" | "fastening" | "sockets" | "grip" | "cutting" | "hvac" | "power"; label: string; jp: string; icon: ToolGlyphName }> = [
  { id: "precision", label: "Precisão & eletrónica", jp: "精密工具", icon: "precision" },
  { id: "fastening", label: "Chaves, bits & aperto", jp: "締結工具", icon: "driver" },
  { id: "sockets", label: "Roquetes & sockets", jp: "ソケット", icon: "socket" },
  { id: "grip", label: "Alicates, grip & chaves", jp: "作業工具", icon: "grip" },
  { id: "cutting", label: "Corte & lâminas", jp: "切削工具", icon: "cut" },
  { id: "hvac", label: "AVAC, medição & instalação", jp: "設備工具", icon: "hvac" },
  { id: "power", label: "Máquinas 18V+", jp: "電動工具", icon: "power" },
];

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { brand?: string; task?: string; focus?: string } => ({
    brand: typeof search["brand"] === "string" ? (search["brand"] as string) : undefined,
    task: typeof search["task"] === "string" ? (search["task"] as string) : undefined,
    focus: typeof search["focus"] === "string" ? (search["focus"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Loja de ferramenta profissional — REJENDARI" },
      {
        name: "description",
        content: "Ferramenta profissional japonesa organizada por trabalho, marca e especificação: precisão, sockets, grip, corte, AVAC e máquinas 18V+.",
      },
      { property: "og:title", content: "Loja — REJENDARI" },
      { property: "og:description", content: "Explora referências japonesas por trabalho e marca, com filtros rápidos e especificações úteis para Portugal." },
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

function shopifyMatchesBrand(vendor: string, brand: string) {
  const normalizedVendor = vendor.toUpperCase();
  return normalizedVendor === brand || normalizedVendor.startsWith(brand) || normalizedVendor.includes(brand);
}

function ShopPage() {
  const t = useT();
  const search = Route.useSearch();
  const [brand, setBrand] = useState<string>(search.brand?.toUpperCase() ?? "all");
  const [category, setCategory] = useState<string>("all");
  const [task, setTask] = useState<string>(search.task ?? "all");
  const [focus, setFocus] = useState<string>(search.focus ?? "all");
  const [maxPrice, setMaxPrice] = useState<string>("");

  useEffect(() => {
    if (search.brand) setBrand(search.brand.toUpperCase());
    if (search.task) setTask(search.task);
    if (search.focus) setFocus(search.focus);
  }, [search.brand, search.task, search.focus]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "shop"],
    queryFn: () => fetchProducts(100),
  });

  const shopifyBrands = useMemo(
    () => Array.from(new Set((products ?? []).map((p) => p.node.vendor).filter(Boolean))).sort(),
    [products],
  );
  const categories = useMemo(
    () => Array.from(new Set((products ?? []).map((p) => p.node.productType).filter(Boolean))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    let list = products ?? [];
    if (brand !== "all") list = list.filter((p) => shopifyMatchesBrand(p.node.vendor, brand));
    if (category !== "all") list = list.filter((p) => p.node.productType === category);
    if (task !== "all") list = list.filter((p) => hasTask(p.node.tags, task));
    const cap = parseFloat(maxPrice);
    if (Number.isFinite(cap) && cap > 0) {
      list = list.filter((p) => parseFloat(p.node.priceRange.minVariantPrice.amount) <= cap);
    }
    return list;
  }, [products, brand, category, task, maxPrice]);

  const referenceFiltered = useMemo(() => {
    const focusedIds = focus === "all" ? null : new Set(referencesForFocus(focus).map((tool) => tool.id));
    return JAPAN_TOOL_REFERENCES.filter((tool) => {
      if (brand !== "all" && tool.brandSlug !== brand) return false;
      if (task !== "all" && tool.task !== task) return false;
      if (focusedIds && !focusedIds.has(tool.id)) return false;
      return true;
    });
  }, [brand, task, focus]);

  const filterBrands = useMemo(
    () => Array.from(new Set([...QUICK_BRANDS, ...shopifyBrands.map((value) => value.toUpperCase())])),
    [shopifyBrands],
  );

  const hasFilters = brand !== "all" || category !== "all" || task !== "all" || focus !== "all" || maxPrice !== "";

  const clearFilters = () => {
    setBrand("all");
    setCategory("all");
    setTask("all");
    setFocus("all");
    setMaxPrice("");
  };

  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-16">
          <p className="jp-label text-primary">工具一覧 · catálogo REJENDARI</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">{t("shop.title")}</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{t("shop.subtitle")}</p>
            </div>
            <p className="max-w-md border-l border-primary/65 pl-4 text-xs leading-6 text-muted-foreground">
              Sistema métrico/SI por defeito. Encaixes técnicos como 1/4″, 3/8″ e 1/2″ mantêm a medida usada profissionalmente.
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
              className={`category-tile flex min-h-28 flex-col items-start justify-between p-4 text-left ${task === item.id ? "bg-secondary text-foreground" : "bg-surface text-muted-foreground"}`}
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

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-6">
          <div className="flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setBrand("all")}
              className={`min-w-max border px-3 py-2 text-xs transition-colors ${brand === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50"}`}
            >
              Todas as marcas
            </button>
            {QUICK_BRANDS.map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setBrand(value)}
                className={`min-w-max border px-3 py-2 text-xs transition-colors ${brand === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50"}`}
              >
                {BRAND_STORY_MAP[value]?.name ?? value}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[#24211d] text-[#f5f0e5]">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          <span className="mr-2 min-w-max font-mono text-[9px] uppercase tracking-[0.15em] text-white/45">Filtros rápidos</span>
          <button
            type="button"
            onClick={() => setFocus("all")}
            className={`min-w-max border px-3 py-2 text-xs transition-colors ${focus === "all" ? "border-[#d65a41] bg-[#d65a41] text-white" : "border-white/15 text-white/65 hover:border-white/35 hover:text-white"}`}
          >
            Tudo
          </button>
          {QUICK_FOCUS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setFocus(item.id)}
              className={`min-w-max border px-3 py-2 text-xs transition-colors ${focus === item.id ? "border-[#d65a41] bg-[#d65a41] text-white" : "border-white/15 text-white/65 hover:border-white/35 hover:text-white"}`}
            >
              {item.label} <span className="ml-1 font-display text-[9px] text-current/55">{item.jp}</span>
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
              {filterBrands.map((value) => (
                <SelectItem key={value} value={value}>{BRAND_STORY_MAP[value]?.name ?? value}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {categories.length > 0 && (
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
          )}

          {(products?.length ?? 0) > 0 && (
            <Input
              type="number"
              min="0"
              placeholder={t("common.price")}
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="w-36 bg-background"
            />
          )}

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>{t("common.clearFilters")}</Button>
          )}

          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
            {referenceFiltered.length} referências
          </span>
        </div>

        <section className="mt-8">
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="jp-label text-primary">選定工具 · referências selecionadas</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.045em]">
                {focus !== "all"
                  ? QUICK_FOCUS.find((item) => item.id === focus)?.label
                  : brand !== "all"
                    ? BRAND_STORY_MAP[brand]?.name ?? brand
                    : task !== "all"
                      ? TASKS.find((item) => item.id === task)?.label
                      : "Seleção japonesa"}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Explora as referências antes de comprar. Cada cartão mostra a função, medidas úteis e acesso à ficha oficial.
              </p>
            </div>
            {brand !== "all" && BRAND_STORY_MAP[brand] && (
              <Button variant="outline" className="w-fit rounded-none" asChild>
                <Link to="/marcas" search={{ brand }}>
                  História da marca
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {referenceFiltered.length === 0 ? (
            <div className="mt-6 border border-border bg-surface p-8 text-center">
              <p className="font-display text-xl font-semibold">Ainda não encontrámos uma referência para esta combinação.</p>
              <p className="mt-2 text-sm text-muted-foreground">Limpa um filtro ou pede-nos uma referência específica.</p>
              <Button className="mt-5 rounded-none" asChild><Link to="/b2b">Pedir referência</Link></Button>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {referenceFiltered.map((tool) => (
                <ReferenceProductCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </section>

        {(isLoading || (products?.length ?? 0) > 0) && (
          <section className="mt-14 border-t border-border pt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="jp-label text-primary">購入可能 · disponível para compra</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.045em]">Produtos publicados</h2>
              </div>
              <p className="text-xs text-muted-foreground">Stock e preço vêm do catálogo de venda.</p>
            </div>

            <div className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/5] w-full rounded-none" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <p className="border border-border py-16 text-center text-muted-foreground">{t("shop.noResults")}</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {filtered.map((product) => (
                    <ProductCard key={product.node.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mt-12 flex flex-col gap-5 border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="jp-label text-primary">相談 · não encontraste?</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">Diz-nos a marca, modelo ou trabalho.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Podemos procurar uma referência específica, alternativa compatível ou preparar uma seleção para empresa.
            </p>
          </div>
          <Button className="w-fit rounded-none" asChild>
            <Link to="/b2b">
              Pedir ajuda
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
