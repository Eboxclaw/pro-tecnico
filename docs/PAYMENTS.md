# Pagamentos REJENDARI — arquitetura e checklist

## Métodos e provedores

| Método | Provedor | Estado | Env para ativar |
|---|---|---|---|
| Visa / Mastercard | Stripe | pronto (fase 2) | `VITE_STRIPE_PUBLISHABLE_KEY` + `STRIPE_SECRET_KEY` |
| Apple Pay | Stripe | pronto (fase 2) | idem (requer domínio verificado na Stripe para o botão nativo) |
| Google Pay | Stripe | pronto (fase 2) | idem |
| PayPal | Stripe | pronto, desligado | idem + `VITE_STRIPE_PAYPAL_ENABLED=true` (ativar PayPal na conta Stripe primeiro) |
| MB WAY | ifthenpay | fase 3 | `IFTHENPAY_API_KEY` + `VITE_IFTHENPAY_ENABLED=true` |
| Crypto (BTC/ETH/USDC) | Coinbase Commerce | fase 3 | `COINBASE_COMMERCE_API_KEY` + `VITE_COINBASE_ENABLED=true` |

Sem chaves, nada parte: o `/checkout` lista os métodos com "em breve" e oferece o pedido B2B.

## Como funciona

1. O carrinho continua sincronizado com a Shopify (Storefront).
2. `POST createStripeCheckout` (server function):
   - revalida **no servidor** cada variante contra a Storefront (preço, moeda, disponibilidade);
   - grava a encomenda (`orders` + `order_items`, service_role apenas — RLS dá SELECT ao próprio utilizador);
   - cria o PaymentIntent na Stripe por REST (`fetch`, sem SDK — compatível com o runtime cloudflare);
   - devolve `clientSecret` + `orderId`.
3. `/checkout` monta o Payment Element (Stripe.js) e confirma o pagamento no cliente.
4. `/encomenda/$id` mostra o estado e sondeia enquanto não resolvido.
5. Webhook `payment_intent.succeeded|payment_failed` marca a encomenda — implementado como
   **Supabase Edge Function** (`supabase/functions/stripe-webhook`) porque o app não expõe
   rotas HTTP próprias (TanStack Start 1.168 só tem `createServerFn` RPC + CSRF).

## Migração

`supabase/migrations/20261001120000_rejendari_orders.sql` — aplicar no projeto Supabase
(Dashboard → SQL Editor, ou `supabase db push`). Sem ela, o checkout devolve erro honesto.

## Checklist do que só tu podes fazer

- [ ] **Vercel**: definir `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`,
      `SUPABASE_PUBLISHABLE_KEY` (conta continua morta em produção sem elas — já pedidas antes).
- [ ] **Stripe**: criar conta, ativar modo de teste, definir `VITE_STRIPE_PUBLISHABLE_KEY` (pk_test)
      e `STRIPE_SECRET_KEY` (sk_test) na Vercel. Compra de teste com `4242 4242 4242 4242`.
- [ ] **Stripe PayPal**: ativar PayPal como método na conta → `VITE_STRIPE_PAYPAL_ENABLED=true`.
- [ ] **Apple Pay**: verificar o domínio na Stripe (Apple Pay domain verification).
- [ ] **Webhook**: `supabase secrets set STRIPE_WEBHOOK_SECRET=… SUPABASE_SERVICE_ROLE_KEY=…`
      e `supabase functions deploy stripe-webhook`; registar o URL na Stripe.
- [ ] **ifthenpay** (MB WAY, fase 3): contrato com entidade PT → chaves.
- [ ] **Coinbase Commerce** (crypto, fase 3): criar conta → API key.
- [ ] **Shopify**: o catálogo de preços vem da Storefront — sem produtos publicados e plano
      ativo não há compras (hoje: 0 produtos e sinais de plano inativo, HTTP 402).
- [ ] **Antes de dinheiro real**: política de devoluções completa, entidade/fiscalização,
      `SITE_OPEN=true` e chaves de produção da Stripe.
