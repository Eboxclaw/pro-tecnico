import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { loadStripe, type Stripe, type StripeElements } from "@stripe/stripe-js";
import { AlertTriangle, ArrowRight, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";
import { createStripeCheckout } from "@/lib/checkout.functions";
import { paymentMethods, isStripeConfigured, type PaymentMethodId } from "@/lib/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductImage } from "@/components/shop/ProductImage";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — REJENDARI" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, isLoading } = useCartStore();
  const methods = useMemo(() => paymentMethods(), []);
  const [selected, setSelected] = useState<PaymentMethodId | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [intent, setIntent] = useState<{ orderId: string; clientSecret: string } | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const elementHostRef = useRef<HTMLDivElement>(null);

  const activeMethods = methods.filter((method) => method.enabled());
  const total = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "EUR";
  const publishable = isStripeConfigured();
  const stripeSelectable = selected !== null && methods.find((m) => m.id === selected)?.provider === "stripe" && publishable;

  // Arranca o Stripe.js apenas quando há intenção + método Stripe ativo.
  useEffect(() => {
    if (!intent || !publishable) return;
    let cancelled = false;
    void (async () => {
      const key = (import.meta.env["VITE_STRIPE_PUBLISHABLE_KEY"] as string).trim();
      const instance = await loadStripe(key);
      if (cancelled || !instance) return;
      setStripe(instance);
      setElements(
        instance.elements({
          clientSecret: intent.clientSecret,
          appearance: { theme: "stripe", variables: { colorPrimary: "#913d29", borderRadius: "0px" } },
        }),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [intent, publishable]);

  // Monta o Payment Element uma vez.
  useEffect(() => {
    if (!elements || !elementHostRef.current || elementHostRef.current.childElementCount > 0) return;
    const paymentElement = elements.create("payment");
    paymentElement.mount(elementHostRef.current);
  }, [elements]);

  async function startPayment() {
    if (!selected) return;
    setBusy(true);
    const result = await createStripeCheckout({
      data: {
        items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
        email: email || undefined,
      },
    });
    setBusy(false);
    if ("error" in result) {
      const detail = "detail" in result ? result.detail : "";
      const messages: Record<string, string> = {
        not_configured: "Pagamentos ainda em preparação. Usa o pedido profissional enquanto ativamos o cartão.",
        empty_cart: "O carrinho está vazio.",
        invalid_items: `Não foi possível validar um artigo${detail ? ` (${detail})` : ""}. Atualiza o carrinho.`,
        shopify_unavailable: "O catálogo de preços não respondeu. Tenta novamente.",
        stripe_error: "A Stripe recusou o pagamento. Tenta novamente.",
      };
      toast.error(messages[result.error] ?? "Não foi possível iniciar o pagamento.");
      return;
    }
    setIntent({ orderId: result.orderId, clientSecret: result.clientSecret });
  }

  async function confirmPayment() {
    if (!stripe || !elements || !intent) return;
    setBusy(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
        ...(email ? { receipt_email: email } : {}),
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message ?? "O pagamento falhou.");
      return;
    }
    if (paymentIntent && ["succeeded", "processing"].includes(paymentIntent.status)) {
      toast.success("Pagamento confirmado. Obrigado!");
      navigate({ to: "/encomenda/$id", params: { id: intent.orderId } });
    }
  }

  if (items.length === 0 && !intent) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-20">
        <p className="jp-label text-primary">決済 · checkout</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">O carrinho está vazio.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Escolhe uma referência publicada na loja e volta para finalizar.</p>
        <Button className="mt-8 rounded-none" asChild>
          <Link to="/shop">Ir para a loja <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="jp-label text-primary">決済 · checkout</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.055em]">Finalizar compra</h1>

        {!publishable && (
          <div className="mt-6 border border-primary/40 bg-primary/5 p-5">
            <p className="flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Pagamentos em preparação
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              O checkout com cartão, Apple Pay, Google Pay e PayPal ativa assim que as chaves de pagamento
              estiverem configuradas. MB WAY e crypto seguem-se. Entretanto, o pedido profissional B2B já
              funciona com composição de packs.
            </p>
            <Button variant="outline" className="mt-4 rounded-none" asChild>
              <Link to="/b2b">Pedido profissional</Link>
            </Button>
          </div>
        )}

        {publishable && !intent && (
          <>
            <div className="mt-8">
              <Label htmlFor="checkout-email">Email para o recibo</Label>
              <Input
                id="checkout-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="o.teu@email.pt"
                className="mt-2 rounded-none bg-background"
              />
            </div>

            <fieldset className="mt-8">
              <legend className="tech-label text-muted-foreground">Método de pagamento</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {methods.map((method) => {
                  const active = selected === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      disabled={!method.enabled()}
                      aria-pressed={active}
                      onClick={() => setSelected(method.id)}
                      className={`flex min-h-14 items-center justify-between border px-4 py-3 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary/5"
                          : method.enabled()
                            ? "border-border hover:border-primary/50"
                            : "cursor-not-allowed border-border/60 opacity-55"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-medium">{method.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {method.enabled() ? method.notePt : "Em breve"}
                        </span>
                      </span>
                      <CreditCard className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} aria-hidden />
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Button
              className="mt-8 w-full rounded-none"
              size="lg"
              disabled={!stripeSelectable || busy || isLoading}
              onClick={startPayment}
            >
              {busy ? "A preparar…" : "Continuar para o pagamento"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}

        {intent && (
          <div className="mt-8 border border-border bg-card p-5">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-primary" />
              Pagamento seguro via Stripe
            </p>
            <div ref={elementHostRef} className="mt-4" />
            <Button className="mt-5 w-full rounded-none" size="lg" disabled={!stripe || busy} onClick={confirmPayment}>
              {busy ? "A confirmar…" : `Pagar ${formatPrice(total, currency)}`}
            </Button>
          </div>
        )}
      </div>

      <aside className="h-fit border border-border bg-surface p-6 lg:sticky lg:top-28">
        <p className="tech-label text-muted-foreground">Resumo da encomenda</p>
        <ul className="mt-4 divide-y divide-border">
          {items.map((item) => (
            <li key={item.variantId} className="flex items-center gap-4 py-3">
              <span className="h-14 w-14 shrink-0 overflow-hidden border border-border bg-background">
                {item.product.node.images?.edges?.[0]?.node ? (
                  <ProductImage
                    src={item.product.node.images.edges[0].node.url}
                    alt={item.product.node.images.edges[0].node.altText ?? item.product.node.title}
                    className="h-full w-full object-contain p-1"
                    loading="lazy"
                  />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{item.product.node.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {item.variantTitle ? `${item.variantTitle} · ` : ""}× {item.quantity}
                </span>
              </span>
              <span className="text-sm font-semibold">
                {formatPrice(parseFloat(item.price.amount) * item.quantity, item.price.currencyCode)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="font-semibold">Total</span>
          <span className="font-display text-2xl font-bold">{formatPrice(total, currency)}</span>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          O valor final é recalculado no servidor contra o catálogo antes do pagamento. Métodos ativos:{" "}
          {activeMethods.length ? activeMethods.map((m) => m.label).join(" · ") : "em preparação"}.
        </p>
      </aside>
    </div>
  );
}
