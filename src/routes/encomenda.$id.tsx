import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { getOrder, type OrderView } from "@/lib/checkout.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/encomenda/$id")({
  head: () => ({
    meta: [
      { title: "Encomenda — REJENDARI" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

const STATUS_VIEW: Record<string, { label: string; tone: "pending" | "ok" | "bad" }> = {
  pending: { label: "A aguardar pagamento", tone: "pending" },
  requires_payment: { label: "Aguarda confirmação do pagamento", tone: "pending" },
  paid: { label: "Pagamento confirmado", tone: "ok" },
  failed: { label: "Pagamento não concluído", tone: "bad" },
  expired: { label: "Encomenda expirada", tone: "bad" },
  canceled: { label: "Encomenda cancelada", tone: "bad" },
};

function OrderPage() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<OrderView | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let stop = false;
    const poll = async () => {
      const result = await getOrder({ data: { orderId: id } });
      if (stop) return;
      if ("error" in result) {
        setMissing(true);
        return;
      }
      setOrder(result);
      // Continua a sonar enquanto o pagamento não estiver resolvido.
      if (!["paid", "failed", "expired", "canceled"].includes(result.status)) {
        setTimeout(() => void poll(), 5000);
      }
    };
    void poll();
    return () => {
      stop = true;
    };
  }, [id]);

  if (missing) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-20">
        <h1 className="font-display text-3xl font-semibold tracking-[-0.04em]">Encomenda não encontrada.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Verifica o link ou volta à loja.</p>
        <Button className="mt-8 rounded-none" asChild>
          <Link to="/shop">Ir para a loja</Link>
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[300px] items-center justify-center" role="status">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const view = STATUS_VIEW[order.status] ?? { label: order.status, tone: "pending" as const };
  const currency = order.total_currency || "EUR";

  return (
    <div className="mx-auto max-w-[720px] px-4 py-16">
      <p className="jp-label text-primary">注文 · encomenda</p>
      <div className="mt-4 flex items-center gap-3">
        {view.tone === "ok" ? (
          <CheckCircle2 className="h-8 w-8 text-primary" />
        ) : view.tone === "bad" ? (
          <XCircle className="h-8 w-8 text-red-700" />
        ) : (
          <Clock className="h-8 w-8 text-primary" />
        )}
        <h1 className="font-display text-3xl font-semibold tracking-[-0.04em]">{view.label}</h1>
      </div>
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
        {order.id} · {new Date(order.created_at).toLocaleString("pt-PT")} · {order.provider}
      </p>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {order.items.map((item, index) => (
          <li key={index} className="flex items-center justify-between gap-4 py-3 text-sm">
            <span>
              {item.product_title}
              {item.variant_title ? ` — ${item.variant_title}` : ""}
              <span className="ml-2 text-muted-foreground">× {item.quantity}</span>
            </span>
            <span className="font-semibold">
              {new Intl.NumberFormat("pt-PT", { style: "currency", currency }).format(item.line_total)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-semibold">Total</span>
        <span className="font-display text-2xl font-bold">
          {new Intl.NumberFormat("pt-PT", { style: "currency", currency }).format(order.total_amount)}
        </span>
      </div>

      {view.tone === "pending" && (
        <p className="mt-6 border border-border bg-surface p-4 text-sm leading-6 text-muted-foreground">
          Esta página atualiza sozinha enquanto o pagamento é confirmado pelo provedor. Não feches se já
          concluiste o pagamento.
        </p>
      )}
      <Button variant="outline" className="mt-8 rounded-none" asChild>
        <Link to="/shop">Continuar a explorar</Link>
      </Button>
    </div>
  );
}
