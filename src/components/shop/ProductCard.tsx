import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const t = useT();
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const node = product.node;
  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const price = variant?.price ?? node.priceRange.minVariantPrice;
  const available = variant?.availableForSale ?? false;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? node.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            width={600}
            height={600}
          />
        ) : (
          <div className="hatch h-full w-full" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="tech-label text-muted-foreground">{node.vendor}</span>
          {!available && <Badge variant="secondary">{t("common.outOfStock")}</Badge>}
        </div>
        <h3 className="font-display font-semibold leading-snug">{node.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{node.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-display text-lg font-bold text-primary">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={isLoading || !variant || !available}
            aria-label={t("common.addToCart")}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("common.addToCart")}
          </Button>
        </div>
      </div>
    </Link>
  );
}
