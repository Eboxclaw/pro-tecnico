/**
 * Registo de métodos de pagamento REJENDARI.
 *
 * Um método só fica ativo quando o provedor correspondente tem chaves
 * configuradas (env). Sem chaves, o método aparece como "em breve" e nada
 * parte, o mesmo padrão de degradação do Supabase.
 *
 * Stripe cobre cartões (Visa/Mastercard), Apple Pay, Google Pay e PayPal.
 * O MB WAY chega via ifthenpay e a crypto via Coinbase Commerce (fase P3).
 */

export type PaymentProvider = "stripe" | "ifthenpay" | "coinbase";

export type PaymentMethodId = "card" | "applepay" | "googlepay" | "paypal" | "mbway" | "crypto";

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  notePt: string;
  provider: PaymentProvider;
  /** Client-side: o método tem chaves publicáveis para arrancar? */
  enabled: () => boolean;
};

function stripePublishableKey(): string | undefined {
  const key = import.meta.env["VITE_STRIPE_PUBLISHABLE_KEY"] as string | undefined;
  return key && key.trim().length > 0 ? key : undefined;
}

/** Ativo no cliente quando a chave publicável existe. */
export function isStripeConfigured(): boolean {
  return Boolean(stripePublishableKey());
}

export function stripePublishable(): string | undefined {
  return stripePublishableKey();
}

function stripePaypalEnabled(): boolean {
  return import.meta.env["VITE_STRIPE_PAYPAL_ENABLED"] === "true";
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "card",
    label: "Visa / Mastercard",
    notePt: "Cartão de crédito ou débito, pagamento seguro via Stripe.",
    provider: "stripe",
    enabled: isStripeConfigured,
  },
  {
    id: "applepay",
    label: "Apple Pay",
    notePt: "Pagamento com um toque em iPhone, iPad e Mac.",
    provider: "stripe",
    enabled: isStripeConfigured,
  },
  {
    id: "googlepay",
    label: "Google Pay",
    notePt: "Pagamento rápido com a conta Google.",
    provider: "stripe",
    enabled: isStripeConfigured,
  },
  {
    id: "paypal",
    label: "PayPal",
    notePt: "Pagamento com a conta PayPal.",
    provider: "stripe",
    enabled: () => isStripeConfigured() && stripePaypalEnabled(),
  },
  {
    id: "mbway",
    label: "MB WAY",
    notePt: "Confirmação no telemóvel via ifthenpay.",
    provider: "ifthenpay",
    enabled: () => Boolean(import.meta.env["VITE_IFTHENPAY_ENABLED"] === "true"),
  },
  {
    id: "crypto",
    label: "Crypto",
    notePt: "BTC, ETH e USDC via Coinbase Commerce.",
    provider: "coinbase",
    enabled: () => Boolean(import.meta.env["VITE_COINBASE_ENABLED"] === "true"),
  },
];

export function paymentMethods() {
  return PAYMENT_METHODS;
}

export function enabledPaymentMethods() {
  return PAYMENT_METHODS.filter((method) => method.enabled());
}

export function paymentMethodById(id: string) {
  return PAYMENT_METHODS.find((method) => method.id === id);
}
