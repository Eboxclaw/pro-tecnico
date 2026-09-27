# Roadmap — Rejendarī

## Done
- Shopify dev store ligada; base de dados (perfis, pontos, sorteios, B2B, waitlist) com RLS
- Design system grafite + laranja; logo gerado (renomear para Rejendarī)
- shopify.ts, cartStore.ts, useCartSync.ts
- i18n PT/EN/ES (src/lib/i18n.ts), site-config (gate SITE_OPEN), gate, header, footer, cart drawer, product card
- Home page (/) com herói, packs, pontos, marcas

## In progress
- [ ] Rebranding Rejendarī com foco principal em ferramenta japonesa; VESSEL e ANEX como marcas âncora
- [ ] Remover referências visíveis restantes a pro'tecnico (as chaves locais antigas mantêm-se para preservar sessões e carrinhos)
- [x] Routes: /shop, /product/$handle, /packs, /pontos, /b2b, /marcas, /legal, /auth, /conta (_authenticated)
- [x] __root.tsx: head metadata Rejendarī, fonts Archivo/IBM Plex, favicon.png, Toaster, SiteLayout

## Blocked / waiting
- [ ] Produtos: loja Shopify tem 0 produtos — obter lista real VESSEL/ANEX (nome, preço, variantes, stock e imagens autorizadas)
- [ ] "Monta o teu kit" e "Comparar" — páginas seguintes após catálogo existir
- [ ] Regulamento do sorteio validado por advogado antes da abertura
- [ ] Claim da loja Shopify (utilizador escolheu adiar; pode dizer "Claim Store")
- [ ] Testes ponta a ponta de compra + revisão mobile


## 2026-09-27 — Legendary redesign PR
- [x] Full REJENDARI visual system refresh: typography, industrial/editorial grid, premium image treatment and motion.
- [x] Japanese brand architecture expanded beyond ANEX/VESSEL: Ko-ken, OLFA, LOBSTER/LOBTEX, Makita, ENGINEER, Fujiya, Tsunoda, TONE, KTC, Tajima and Silky.
- [x] Shopping architecture reorganised around real tasks: precision/electronics, fastening, sockets, grip/wrenches, cutting, HVAC/installation and 18V+ power tools.
- [x] Raw WebGL2 LegendaryProductStage with intersection-based lazy start, reduced-motion support and static fallback. Shopify tags `legendary`, `flagship` or `icon` activate it on PDPs.
- [x] Hand-made SVG tool/category icon system.
- [x] Points + referrals wired end-to-end: pre-auth referral capture, Supabase attribution, account referral link/stats and service-role reward function writing to the existing points ledger.
- [x] Referral reward values intentionally remain campaign-configured rather than hard-coded.
- [ ] Load real supplier-approved Shopify products/images and tag flagship products.
- [ ] Apply the referral migration in the target Supabase environment during deploy.
- [ ] Final device QA after a preview deployment is available.
