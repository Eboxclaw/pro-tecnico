import { ProductImage } from "@/components/shop/ProductImage";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, PackageSearch, ShieldCheck, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";
import { fetchProductByHandle, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { LegendaryProductStage } from "@/components/brand/LegendaryProductStage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { playFail } from "@/lib/sounds";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "Produto, REJENDARI" },
      {
        name: "description",
        content: "Ficha de produto profissional com dados técnicos, variantes, origem e garantia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function getTaggedValue(tags: string[], prefix: string) {
  const found = tags.find((tag) => tag.toLowerCase().startsWith(prefix.toLowerCase() + ":"));
  return found ? found.slice(found.indexOf(":") + 1).trim() : null;
}

function ProductPage() {
  const { handle } = Route.useParams();
  const t = useT();
  const addItem = useCartStore((s) => s.addItem);
  const isLoadingCart = useCartStore((s) => s.isLoading);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const failedStock = useRef(false);
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
  });

  const stock = product?.variants?.edges?.find(
    (edge: { node: { id: string } }) =>
      edge.node.id === (selectedVariantId ?? product?.variants?.edges?.[0]?.node.id),
  )?.node;
  useEffect(() => {
    if (stock && !stock.availableForSale && !failedStock.current) {
      failedStock.current = true;
      playFail();
    }
  }, [stock]);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Skeleton className="aspect-square w-full rounded-none" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError)
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Não foi possível carregar o produto.</h1>
        <p className="mt-4 text-muted-foreground">Verifica a ligação e tenta novamente.</p>
        <Button className="mt-6" onClick={() => void refetch()}>
          Tentar novamente
        </Button>
      </div>
    );

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-semibold">{t("product.notFound")}</h1>
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
  const variants = node.variants.edges.map((edge) => edge.node);
  const selected = variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];
  const price = selected?.price ?? node.priceRange.minVariantPrice;
  const images = node.images.edges.map((edge) => edge.node);
  const mainImage = images.find((image) => image.url === selectedImage) ?? images[0];
  const normalizedTags = node.tags.map((tag) => tag.toLowerCase());
  const isLegendary = normalizedTags.some((tag) => ["legendary", "flagship", "icon"].includes(tag));

  const sku = selected?.sku ?? variants.find((variant) => variant.sku)?.sku ?? null;
  const ean = selected?.barcode ?? variants.find((variant) => variant.barcode)?.barcode ?? null;
  const madeIn = getTaggedValue(node.tags, "made-in");
  const material = getTaggedValue(node.tags, "material");
  const standard = getTaggedValue(node.tags, "standard");
  const task = getTaggedValue(node.tags, "task");

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
    <div>
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("product.backToShop")}
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-0 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          {isLegendary ? (
            <LegendaryProductStage
              imageUrl={mainImage?.url}
              alt={mainImage?.altText ?? node.title}
              eyebrow={`${node.vendor || "REJENDARI"} / 選定 · SELEÇÃO REJENDARI`}
              className="min-h-[480px] lg:min-h-[680px]"
            />
          ) : (
            <div className="product-image-stage relative flex min-h-[480px] items-center justify-center overflow-hidden border border-border lg:min-h-[680px]">
              <div className="micro-grid absolute inset-0 opacity-35" />
              {mainImage ? (
                <ProductImage
                  src={mainImage.url}
                  alt={mainImage.altText ?? node.title}
                  className="relative z-10 max-h-[620px] w-full object-contain p-8 sm:p-14"
                  width={1000}
                  height={1000}
                />
              ) : (
                <div className="hatch h-64 w-64 border border-black/10" />
              )}
              <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.13em] text-black/40">
                Detalhe da referência
              </span>
            </div>
          )}

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {images.map((image, index) => (
                <button
                  type="button"
                  onClick={() => setSelectedImage(image.url)}
                  aria-label={`Ver fotografia ${index + 1} de ${node.title}`}
                  aria-pressed={mainImage?.url === image.url}
                  key={image.url + index}
                  className="product-image-stage aspect-square overflow-hidden border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary aria-pressed:border-primary"
                >
                  <ProductImage
                    src={image.url}
                    alt={image.altText ?? ""}
                    className="h-full w-full object-contain p-2"
                    loading="lazy"
                    width={220}
                    height={220}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 sm:p-10 lg:p-12 xl:p-16">
          <div className="flex flex-wrap items-center gap-3">
            <span className="tech-label text-primary">{node.vendor || "REJENDARI"}</span>
            {isLegendary && (
              <Badge variant="secondary" className="gap-1.5 rounded-full">
                <Sparkles className="h-3 w-3 text-primary" />
                Ícone
              </Badge>
            )}
            {selected && !selected.availableForSale && (
              <Badge variant="secondary">{t("common.outOfStock")}</Badge>
            )}
          </div>

          <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl">
            {node.title}
          </h1>

          <p className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em]">
            {formatPrice(price.amount, price.currencyCode)}
          </p>

          <p className="mt-6 max-w-xl whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {node.description}
          </p>

          <div className="signal-rule mt-8 border-y border-border py-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="jp-label text-primary">選定理由 · {t("product.whySelected")}</p>
                <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  {t("product.whySelectedText")}
                </p>
              </div>
            </div>
          </div>

          {variants.length > 1 && (
            <div className="mt-7">
              <p className="tech-label text-muted-foreground">{t("product.variants")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    disabled={!variant.availableForSale}
                    className={`border px-3 py-2 text-sm transition-colors ${
                      selected?.id === variant.id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="mt-8 w-full rounded-none sm:w-auto"
            onClick={handleAdd}
            disabled={isLoadingCart || !selected || !selected.availableForSale}
          >
            {isLoadingCart ? <Loader2 className="h-4 w-4 animate-spin" /> : t("common.addToCart")}
          </Button>

          <div className="mt-10 border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <p className="jp-label text-muted-foreground">仕様 · {t("product.specs")}</p>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                Medidas apresentadas em sistema métrico/SI sempre que aplicável. Encaixes
                normalizados, como drive 1/4″, 3/8″ ou 1/2″, mantêm a medida técnica original.
              </p>
            </div>
            <dl className="divide-y divide-border font-mono text-[11px]">
              {[
                [t("product.vendor"), node.vendor || "-"],
                [t("product.sku"), sku || "-"],
                [t("product.ean"), ean || "-"],
                ["Aplicação", task || node.productType || "-"],
                ["Material", material || "-"],
                ["Norma", standard || "-"],
                ["País de fabrico", madeIn || "Informação a confirmar"],
                [t("product.warranty"), t("product.warrantyValue")],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[0.9fr_1.1fr] gap-4 px-5 py-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
