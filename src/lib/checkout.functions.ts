import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

/**
 * Server functions do checkout.
 *
 * Princípios:
 * - O preço é SEMPRE recalculado no servidor contra a Storefront API da
 *   Shopify (fonte autoritativa). O cliente só envia variantes e quantidades.
 * - A Stripe é chamada por REST (fetch), sem SDK, compatível com o runtime
 *   cloudflare do deploy.
 * - As encomendas são escritas com a service_role key; nenhum utilizador
 *   escreve diretamente na tabela.
 * - Sem chaves configuradas, as funções devolvem { error: "not_configured" }
 *   e a UI degrada com mensagem honesta.
 */

const SHOPIFY_DOMAIN = "toolsmith-collective-r3n4h-fzudg00z.myshopify.com";
const SHOPIFY_STOREFRONT_TOKEN = "5360ed5408aebecfe42387a65aa2e216";
const SHOPIFY_API_VERSION = "2025-07";

const VARIANT_PRICE_QUERY = /* GraphQL */ `
  query validatedVariants($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        availableForSale
        title
        price {
          amount
          currencyCode
        }
        product {
          handle
          title
          featuredImage {
            url
          }
        }
      }
    }
  }
`;

export type CheckoutItemInput = { variantId: string; quantity: number };

type ValidatedItem = {
  variant_gid: string;
  product_handle: string;
  product_title: string;
  variant_title: string;
  image_url: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  currency: string;
  available: boolean;
};

type StorefrontVariant = {
  id: string;
  availableForSale: boolean;
  title: string;
  price: { amount: string; currencyCode: string };
  product: { handle: string; title: string; featuredImage: { url: string } | null };
};

async function storefontRequest<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T | null> {
  const response = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  if (!response.ok) return null;
  const json = (await response.json()) as { data?: T };
  return json.data ?? null;
}

function stripeSecret(): string | undefined {
  const key = process.env["STRIPE_SECRET_KEY"];
  return key && key.trim().length > 0 ? key : undefined;
}

async function supabaseAdmin() {
  const { supabaseAdmin: admin } = await import("@/integrations/supabase/client.server");
  return admin;
}

async function currentUserEmail(): Promise<{ email: string | null; userId: string | null }> {
  try {
    const request = getRequest();
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : null;
    if (!token || !process.env["SUPABASE_URL"] || !process.env["SUPABASE_PUBLISHABLE_KEY"]) {
      return { email: null, userId: null };
    }
    const response = await fetch(`${process.env["SUPABASE_URL"]}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env["SUPABASE_PUBLISHABLE_KEY"],
      },
    });
    if (!response.ok) return { email: null, userId: null };
    const user = (await response.json()) as { id?: string; email?: string };
    return { email: user.email ?? null, userId: user.id ?? null };
  } catch {
    return { email: null, userId: null };
  }
}

type CreateCheckoutResult =
  | { error: "not_configured" }
  | { error: "empty_cart" }
  | { error: "invalid_items"; detail: string }
  | { error: "shopify_unavailable" }
  | { error: "stripe_error"; detail: string }
  | {
      orderId: string;
      clientSecret: string;
      total: number;
      currency: string;
      items: ValidatedItem[];
    };

export const createStripeCheckout = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const value = input as { items?: CheckoutItemInput[]; email?: string } | null;
    const items = Array.isArray(value?.items) ? value!.items! : [];
    const cleaned = items
      .filter((item) => typeof item?.variantId === "string" && item.variantId.length > 10)
      .map((item) => ({
        variantId: item.variantId,
        quantity: Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1))),
      }));
    const email =
      typeof value?.email === "string" && value!.email!.includes("@")
        ? value!.email!.trim().slice(0, 160)
        : undefined;
    return { items: cleaned.slice(0, 40), email };
  })
  .handler(async ({ data }): Promise<CreateCheckoutResult> => {
    const secret = stripeSecret();
    if (!secret) return { error: "not_configured" };
    if (data.items.length === 0) return { error: "empty_cart" };

    // 1) Preços autoritativos: revalidar variantes na Storefront.
    const storefront = await storefontRequest<{ nodes: Array<StorefrontVariant | null> }>(
      VARIANT_PRICE_QUERY,
      {
        ids: data.items.map((item) => item.variantId),
      },
    );
    if (!storefront) return { error: "shopify_unavailable" };

    const byId = new Map<string, ValidatedItem>();
    for (const node of storefront.nodes) {
      if (!node?.id) continue;
      byId.set(node.id, {
        variant_gid: node.id,
        product_handle: node.product?.handle ?? "",
        product_title: node.product?.title ?? node.title,
        variant_title: node.title,
        image_url: node.product?.featuredImage?.url ?? null,
        unit_price: Math.round(parseFloat(node.price?.amount ?? "0") * 100) / 100,
        quantity: 0,
        line_total: 0,
        currency: node.price?.currencyCode ?? "EUR",
        available: node.availableForSale !== false,
      });
    }
    const validated: ValidatedItem[] = [];
    let currency: string | null = null;
    for (const item of data.items) {
      const variant = byId.get(item.variantId);
      if (!variant) return { error: "invalid_items", detail: item.variantId };
      if (!variant.available)
        return { error: "invalid_items", detail: `${variant.product_title} sem stock` };
      if (variant.unit_price <= 0 || !variant.product_title)
        return { error: "invalid_items", detail: "variante inválida" };
      if (currency && variant.currency !== currency)
        return { error: "invalid_items", detail: "moedas mistas no carrinho" };
      currency = variant.currency;
      validated.push({
        ...variant,
        quantity: item.quantity,
        line_total: Math.round(variant.unit_price * item.quantity * 100) / 100,
      });
    }
    if (!currency) return { error: "invalid_items", detail: "sem moeda" };
    const total = Math.round(validated.reduce((sum, item) => sum + item.line_total, 0) * 100) / 100;
    if (total <= 0) return { error: "invalid_items", detail: "total inválido" };

    const { email: sessionEmail, userId } = await currentUserEmail();
    const email = data.email ?? sessionEmail;

    // 2) Encomenda rascunho na Supabase (service_role).
    let orderId: string;
    try {
      const admin = await supabaseAdmin();
      const { data: order, error: orderError } = await admin
        .from("orders")
        .insert({
          user_id: userId,
          email,
          status: "requires_payment",
          provider: "stripe",
          total_amount: total,
          total_currency: currency,
        })
        .select("id")
        .single();
      if (orderError || !order) throw orderError ?? new Error("order insert failed");
      orderId = order.id;
      const { error: itemsError } = await admin.from("order_items").insert(
        validated.map((item) => ({
          order_id: orderId,
          variant_gid: item.variant_gid,
          product_handle: item.product_handle,
          product_title: item.product_title,
          variant_title: item.variant_title,
          image_url: item.image_url,
          unit_price: item.unit_price,
          quantity: item.quantity,
          line_total: item.line_total,
        })),
      );
      if (itemsError) throw itemsError;
    } catch {
      return { error: "stripe_error", detail: "order" };
    }

    // 3) PaymentIntent via REST da Stripe (sem SDK).
    const body = new URLSearchParams();
    body.set("amount", String(Math.round(total * 100)));
    body.set("currency", currency.toLowerCase());
    body.set("automatic_payment_methods[enabled]", "true");
    body.set("metadata[order_id]", orderId);
    if (email) body.set("receipt_email", email);

    const stripeResponse = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    const stripeJson = (await stripeResponse.json()) as {
      client_secret?: string;
      error?: { message?: string };
    };
    if (!stripeResponse.ok || !stripeJson.client_secret) {
      await (await supabaseAdmin()).from("orders").update({ status: "failed" }).eq("id", orderId);
      return { error: "stripe_error", detail: stripeJson.error?.message ?? "intent" };
    }

    return { orderId, clientSecret: stripeJson.client_secret, total, currency, items: validated };
  });

export type OrderView = {
  id: string;
  status: string;
  provider: string;
  total_amount: number;
  total_currency: string;
  created_at: string;
  items: Array<{
    product_title: string;
    variant_title: string | null;
    quantity: number;
    line_total: number;
  }>;
};

export const getOrder = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const value = input as { orderId?: string } | null;
    const orderId = typeof value?.orderId === "string" ? value.orderId.trim() : "";
    return /^[0-9a-f-]{36}$/i.test(orderId) ? { orderId } : { orderId: "" };
  })
  .handler(async ({ data }): Promise<OrderView | { error: "not_found" }> => {
    if (!data.orderId) return { error: "not_found" };
    try {
      const admin = await supabaseAdmin();
      const { data: order, error } = await admin
        .from("orders")
        .select(
          "id,status,provider,total_amount,total_currency,created_at,order_items(product_title,variant_title,quantity,line_total)",
        )
        .eq("id", data.orderId)
        .maybeSingle();
      if (error || !order) return { error: "not_found" };
      const row = order as unknown as OrderView & { order_items: OrderView["items"] };
      return { ...row, items: row.order_items ?? [] };
    } catch {
      return { error: "not_found" };
    }
  });
