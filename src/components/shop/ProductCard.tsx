import { Link } from "@tanstack/react-router";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const t = useT();
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const node = product.node;
  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const price = variant?.price ?? node.priceRange.minVariantPrice;
  const available = variant?.availableForSale ?? false;
  const normalizedTags = node.tags.map((tag) => tag.toLowerCase());
  const isLegendary = normalizedTags.some((tag) => ["legendary", "flagship", "icon"].includes(tag));
  const originTag = node.tags.find((tag) => tag.toLowerCase().startsWith("made-in:"));
  const taskTag = node.tags.find((tag) => tag.toLowerCase().startsWith("task:"));

  const handleAdd = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!variant) return;

    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: node.handle }}
      className="product-card group flex min-h-full flex-col overflow-hidden border border-border bg-card"
    >
      <div className="product-image-stage relative aspect-[5/4] overflow-hidden">
        {isLegendary && (
          <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-black/10 bg-black/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-white">
            <Sparkles className="h-3 w-3 text-primary" />
            Legendary
          </span>
        )}
        <span className="absolute right-3 top-3 z-10 font-mono text-[9px] uppercase tracking-[0.14em] text-black/45">
          {node.productType || "professional tool"}
        </span>
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? node.title}
            className="h-full w-full object-contain p-5 transition duration-500 ease-out group-hover:scale-[1.035] group-hover:-rotate-[0.4deg]"
            loading="lazy"
            width={700}
            height={560}
          />
        ) : (
          <div className="micro-grid h-full w-full opacity-45" />
        )}
        <div className="absolute inset-x-4 bottom-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.13em] text-black/42">
          <span>{originTag ? originTag.replace(/^made-in:/i, "") : "Origin per SKU"}</span>
          <span>RJD / SELECT</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4.5">
        <div className="flex items-center justify-between gap-3">
          <span className="tech-label text-primary">{node.vendor || "REJENDARI"}</span>
          {!available && <Badge variant="secondary">{t("common.outOfStock")}</Badge>}
        </div>

        <h3 className="mt-3 font-display text-[17px] font-semibold leading-[1.2] tracking-[-0.025em]">
          {node.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-muted-foreground">{node.description}</p>

        <div className="mt-4 flex min-h-5 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          {taskTag ? <span>{taskTag.replace(/^task:/i, "")}</span> : <span>Professional grade</span>}
          <span className="h-1 w-1 rounded-full bg-primary/70" />
          <span>Verified specs</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="font-display text-lg font-semibold tracking-[-0.03em]">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAdd}
            disabled={isLoading || !variant || !available}
            aria-label={t("common.addToCart")}
            className="h-9 w-9 p-0"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Link>
  );
}
