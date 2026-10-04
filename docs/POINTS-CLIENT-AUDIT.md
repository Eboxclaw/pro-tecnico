# Auditoria: sistema de pontos e base de dados de clientes

> Estado em 2026-10-04. Esta auditoria cobre o motor de pontos, referrals,
> sorteio, e a base de dados de clientes (perfis, encomendas, leads B2B,
> waitlist). O inventário completo do que existe está listado primeiro; os
> gaps e recomendações seguem.

## 1. O que existe hoje

### Motor de pontos (Supabase, server-owned)

| Peça | Onde | Estado |
|---|---|---|
| `profiles.points` (coluna server-owned) | migração base `20260920174147_*.sql` | OK — RLS revoga update de `points` aos utilizadores |
| `points_ledger` (append-only) | migração base | OK — SELECT próprio; escrita só via `security definer` |
| Bónus de registo 50 pts | trigger `handle_new_user()` | Implementado |
| `award_referral_points(p_referral_id, p_referrer_points, p_referred_points)` | `20260927114500_rejendari_referrals.sql` | Existe mas **nada o chama** |
| `draw_weekly_raffle()` (100 pts ao vencedor) | migração base | Existe mas **nunca é agendado** |
| Entradas no sorteio (`raffle_entries`) | `/pontos` | Implementado |
| Ledger visível na conta | `/conta` | Implementado |

### Base de dados de clientes

- `profiles` — dados de contacto editáveis pelo utilizador; pontos e referral
  são server-owned.
- `orders` / `order_items` — multi-gateway (stripe/ifthenpay/coinbase),
  escritas só via `service_role`; leitura própria via RLS.
- `b2b_requests` — leads B2B (insert-only para anon/authenticated).
- `waitlist` — captura de email (banner pré-lançamento).
- `referrals` — atribuição referrer/referred com máquina de estados
  (`signed_up → qualified → rewarded`).

## 2. Gaps críticos encontrados

### G1. "1 ponto por cada 1 €" prometido mas não implementado
A copy em `src/lib/i18n.ts` (chaves `points.*`, nos 3 locales) promete
"1 ponto por cada 1 € em compras elegíveis". O webhook Stripe
(`supabase/functions/stripe-webhook/index.ts`) apenas altera
`orders.status` — nunca escreve no `points_ledger` nem em `profiles.points`.
**Resolvido nesta sprint** com o trigger `orders_paid_award_points`
(migração `points_engine`): qualquer gateway que marque a encomenda como
`paid` credita pontos, uma única vez (índice único parcial em
`(reason, order_id)`).

### G2. Resgate de pontos não existe
Nenhum caminho gasta pontos: sem catálogo de vantagens, sem função de
desconto, sem integração no checkout. A copy "pontos redeemáveis por
descontos" é, hoje, marketing sem backend.

**Recomendação (próxima sprint):** catálogo "Vantagens" em tabela própria
(`rewards`: id, custo em pontos, tipo, valor) + resgate que emite um
`promotion_code` da Stripe ou um código de desconto Shopify, em vez de
descontos aplicados no checkout (que violariam a revalidação de preços
contra a Shopify em `checkout.functions.ts`). O ledger já suporta deltas
negativos com `reason='redemption'`.

### G3. Referrals dormentes
`award_referral_points()` é `service_role` e nunca é invocada. Os montantes
foram deixados deliberadamente por definir ("campaign-configured").
**Resolvido nesta sprint**: tabela `referral_campaign` (config de campanha
ativa com montantes) + o trigger de encomenda paga marca o referral como
`qualified` na primeira compra do convidado e invoca a função existente com
os montantes da campanha. Sem campanha ativa, nada é creditado (comportamento
seguro por omissão).

### G4. Sorteio nunca sorteia
`draw_weekly_raffle()` não tem `pg_cron` nem qualquer agendador — tem de ser
corrida à mão. **Resolvido nesta sprint**: extensão `pg_cron` + agendamento
semanal (domingo, 22:00 UTC). Nota: o regulamento do sorteio continua à
espera de validação legal (ver G8).

### G5. Sem painel de administração
Não existe rota `/admin` nem qualquer UI de gestão: leads B2B, waitlist,
encomendas, sorteios e ajustes manuais de pontos exigem acesso direto à base
de dados. Recomendação: página admin protegida por claim/role
(`profiles.role = 'admin'`), começando por: lista de `b2b_requests` com
estado de tratamento, encomendas pagas, e uma função `admin_adjust_points`
auditoria no ledger (`reason='admin_adjust'`).

### G6. Cast obsoleto em conta.tsx
A query de encomendas usava `.as never` com comentário "types não conhecem
a tabela" — mas `src/integrations/supabase/types.ts` já inclui `orders`.
Removido nesta sprint.

### G7. Credenciais Shopify no código
`checkout.functions.ts` tem domínio e storefront token hard-coded. Recomendação:
mover para env vars (`SHOPIFY_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN`) e rodar o
token, já que ficou em histórico git.

### G8. Pendências legais e de deploy
- Regulamento do sorteio pendente de validação por advogado (copy
  `points.pending`).
- `roadmap.md` nota que a migração de referrals precisa de ser aplicada no
  Supabase alvo — confirmar que as migrações `referrals` e `orders` estão
  aplicadas antes de aplicar `points_engine` (a migração de engine cria
  trigger sobre `orders`, pelo que depende de `orders` existir).

## 3. Decisões de design do motor (esta sprint)

- **Trigger, não webhook.** O crédito de pontos vive num trigger Postgres
  sobre `orders.status → 'paid'`, não no webhook Stripe. Assim, Stripe,
  IfThenPay e Coinbase (e qualquer correção manual do estado) credenciam
  pontos pelo mesmo caminho, e o webhook mantém-se minimalista.
- **Idempotência no ledger.** `points_ledger` ganha `order_id` nullable +
  índice único parcial em `(reason, order_id)` para `reason='purchase'` —
  reprocessar o mesmo pagamento não duplica pontos.
- **Só EUR e utilizador conhecido.** Encomendas sem `user_id` (guest) ou
  não-EUR não credenciam — a copy promete "compras elegíveis"; guest
  checkout sem pontos é uma regra simples de comunicar. Se o guest checkout
  se tornar importante, migrar para atribuição por email → `profiles`.
- **Campanha segura por omissão.** Sem linha ativa em `referral_campaign`,
  referrals qualificam mas não pagam nada — evita creditar montantes
  arbitrários.
