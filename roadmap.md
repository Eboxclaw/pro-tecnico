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
