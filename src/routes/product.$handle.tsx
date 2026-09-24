import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Loader2, PackageSearch } from "lucide-react";
import { useT } from "@/lib/i18n";
import { fetchProductByHandle, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "Produto — Rejendarī" },
      { name: "description", content: "Ficha de produto profissional: especificações, variantes e garantia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const t = useT();
  const addItem = useCartStore((s) => s.addItem);
  const isLoadingCart = useCartStore((s) => s.isLoading);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
  });

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-bold">{t("product.notFound")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("product.notFoundHint")}</p>
        <Button className="mt-6" variant="secondary" asChild>
          <Link to="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("product.backToShop")}
          </Link>
        </Button>
      </div>
    );
  }

  const node = product.node;
  const variants = node.variants.edges.map((e) => e.node);
  const selected = variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const price = selected?.price ?? node.priceRange.minVariantPrice;
  const images = node.images.edges.map((e) => e.node);
  const mainImage = images[0];

  const sku = selected?.sku ?? variants.find((v) => v.sku)?.sku ?? null;
  const ean = selected?.barcode ?? variants.find((v) => v.barcode)?.barcode ?? null;

  const handleAdd = async () => {
    if (!selected) return;
    await addItem({
      product,
      variantId: selected.id,
      variantTitle: selected.title,
      price: selected.price,
      quantity: 1,
      selectedOptions: selected.selectedOptions ?? [],
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("product.backToShop")}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={mainImage.altText ?? node.title}
                className="h-full w-full object-cover"
                width={800}
                height={800}
              />
            ) : (
              <div className="hatch h-full w-full" />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.slice(1, 6).map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-md border border-border bg-secondary">
                  <img src={img.url} alt={img.altText ?? ""} className="h-full w-full object-cover" loading="lazy" width={200} height={200} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <span className="tech-label text-muted-foreground">{node.vendor}</span>
            {selected && !selected.availableForSale && (
              <Badge variant="secondary">{t("common.outOfStock")}</Badge>
            )}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{node.title}</h1>
          <p className="mt-3 font-display text-2xl font-bold text-primary">
            {formatPrice(price.amount, price.currencyCode)}
          </p>
          <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">{node.description}</p>

          <div className="mt-6 border-l-2 border-primary pl-4">
            <p className="tech-label text-primary">{t("product.whySelected")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("product.whySelectedText")}</p>
          </div>

          {variants.length > 1 && (
            <div className="mt-6">
              <p className="tech-label text-muted-foreground">{t("product.variants")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    disabled={!v.availableForSale}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      selected?.id === v.id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="mt-8 w-full sm:w-auto"
            onClick={handleAdd}
            disabled={isLoadingCart || !selected || !selected.availableForSale}
          >
            {isLoadingCart ? <Loader2 className="h-4 w-4 animate-spin" /> : t("common.addToCart")}
          </Button>

          <div className="mt-8 rounded-lg border border-border bg-surface p-5">
            <p className="tech-label text-muted-foreground">{t("product.specs")}</p>
            <dl className="mt-3 space-y-2 font-mono text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("product.vendor")}</dt>
                <dd>{node.vendor || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("product.sku")}</dt>
                <dd>{sku || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("product.ean")}</dt>
                <dd>{ean || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("product.warranty")}</dt>
                <dd>{t("product.warrantyValue")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
