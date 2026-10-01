import { ProductImage } from "@/components/shop/ProductImage";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Minus, Plus, Trash2, Loader2, ShoppingCart } from "lucide-react";

export function CartDrawer({
  trigger,
}: {
  trigger: React.ReactElement;
}) {
  const t = useT();
  const navigate = useNavigate();
  const { items, isLoading, isSyncing, updateQuantity, removeItem, syncCart } =
    useCartStore();

  useEffect(() => {
    if (items.length > 0) syncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const currency = items[0]?.price.currencyCode ?? "EUR";

  const handleCheckout = () => {
    // O checkout REJENDARI valida os preços no servidor e aceita os métodos ativos.
    // Se ainda não houver chaves de pagamento, a própria página explica o estado e
    // oferece o pedido profissional em alternativa.
    void navigate({ to: "/checkout" });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{t("common.cart")}</SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? t("common.emptyCart")
              : `${totalItems} ${totalItems === 1 ? "artigo" : "artigos"}`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">{t("common.emptyCart")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("common.emptyCartHint")}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3 rounded-md border border-border p-2">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-secondary">
                    {item.product.node.images?.edges?.[0]?.node && (
                      <ProductImage
                        src={item.product.node.images.edges[0].node.url}
                        alt={item.product.node.title}
                        className="h-full w-full object-contain p-1"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.product.node.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.selectedOptions.map((o) => o.value).join(" · ")}
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(item.price.amount, item.price.currencyCode)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11"
                      aria-label="remover"
                      onClick={() => removeItem(item.variantId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11"
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-7 text-center font-mono text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11"
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{t("common.total")}</span>
                <span className="font-display text-xl font-bold">
                  {formatPrice(totalPrice, currency)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
                disabled={isLoading || isSyncing}
              >
                {isLoading || isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    
                    {t("common.checkout")}
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">{t("common.checkoutNote")}</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
