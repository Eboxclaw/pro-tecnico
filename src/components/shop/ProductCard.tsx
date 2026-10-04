import { ProductImage } from "@/components/shop/ProductImage";
import { Link } from "@tanstack/react-router";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const JP_TASK: Record<string, string> = {
  precision: "精密工具",
  fastening: "締結工具",
  sockets: "ソケット",
  grip: "作業工具",
  cutting: "切削工具",
  hvac: "設備工具",
  power: "電動工具",
};

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
  const task = taskTag?.replace(/^task:/i, "").trim().toLowerCase() ?? "";
  const japaneseTask = JP_TASK[task] ?? "選定工具";

  const handleAdd = async () => {
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
    <article className="product-card catalogue-card group relative flex min-h-full flex-col overflow-hidden">
      <Link
        to="/product/$handle"
        params={{ handle: node.handle }}
        aria-label={node.title}
        className="absolute inset-0 z-10"
      />
      <div className="product-image-stage relative aspect-[5/4] overflow-hidden">
        {isLegendary && (
          <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 border border-black/10 bg-black/82 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-white">
            <Sparkles className="h-3 w-3 text-primary" />
            Ícone
          </span>
        )}
        <span className="absolute right-3 top-3 z-10 font-display text-[11px] font-semibold tracking-[0.06em] text-black/45">
          {japaneseTask}
        </span>

        {image ? (
          <ProductImage
            src={image.url}
            alt={image.altText ?? node.title}
            className="h-full w-full object-contain p-6 transition duration-500 ease-out group-hover:scale-[1.045] group-hover:-rotate-[0.35deg]"
            loading="lazy"
            width={700}
            height={560}
          />
        ) : (
          <div className="micro-grid flex h-full w-full items-end p-5">
            <span className="font-display text-5xl font-semibold tracking-[-0.08em] text-black/[0.08]">道具</span>
          </div>
        )}

        <div className="absolute inset-x-4 bottom-3 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.14em] text-black/43">
          <span>{originTag ? originTag.replace(/^made-in:/i, "") : "Origem na ficha"}</span>
          <span>RJD / SELEÇÃO</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="tech-label text-primary">{node.vendor || "REJENDARI"}</span>
          {!available && <Badge variant="secondary">{t("common.outOfStock")}</Badge>}
        </div>

        <h3 className="mt-3 font-display text-lg font-semibold leading-[1.2] tracking-[-0.02em]">
          {node.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-muted-foreground">{node.description}</p>

        <div className="mb-6 mt-4 flex min-h-5 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          <span>{task || "Uso profissional"}</span>
          <span className="h-1 w-1 rounded-full bg-primary/70" />
          <span>Ficha técnica</span>
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
            className="relative z-20 h-11 w-11 rounded-none p-0"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </article>
  );
}
