// Webhook da Stripe como Supabase Edge Function (Deno).
// O app não expõe rotas HTTP próprias (runtime cloudflare + createServerFn),
// pelo que o webhook vive aqui: corpo em bruto + verificação de assinatura.
//
// Deploy (quando as chaves existirem):
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_... SUPABASE_SERVICE_ROLE_KEY=... STRIPE_SECRET_KEY=...
//   supabase functions deploy stripe-webhook
//   Na Stripe: adicionar webhook → https://<projeto>.supabase.co/functions/v1/stripe-webhook
//   com os eventos payment_intent.succeeded e payment_intent.payment_failed.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

async function verifyStripeSignature(payload: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=") as [string, string]));
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature || !secret) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
  // Comparação em tempo constante aproximado.
  let diff = expected.length ^ signature.length;
  for (let i = 0; i < Math.min(expected.length, signature.length); i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

async function setOrderStatus(intentId: string, status: string): Promise<boolean> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?provider_intent_id=eq.${encodeURIComponent(intentId)}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ status }),
  });
  return response.ok;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }
  if (!STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return new Response("not configured", { status: 503 });
  }
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";
  if (!(await verifyStripeSignature(payload, signature, STRIPE_WEBHOOK_SECRET))) {
    return new Response("invalid signature", { status: 400 });
  }
  const event = JSON.parse(payload) as {
    type: string;
    data: { object: { id: string } };
  };
  if (event.type === "payment_intent.succeeded") {
    const ok = await setOrderStatus(event.data.object.id, "paid");
    return new Response(ok ? "ok" : "order not found", { status: ok ? 200 : 404 });
  }
  if (event.type === "payment_intent.payment_failed") {
    const ok = await setOrderStatus(event.data.object.id, "failed");
    return new Response(ok ? "ok" : "order not found", { status: ok ? 200 : 404 });
  }
  return new Response("ignored", { status: 200 });
});
