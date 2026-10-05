# REFINEMENT ROADMAP — página a página, card a card

Guia do refinamento contínuo do site REJENDARI. Cada página é uma sessão de
auditoria; cada card passa pelos **cinco checks** abaixo. Feito = checks
verificados com correções aplicadas (a correção liga sempre à evidência).

## Os cinco checks por card

1. **Copy ↔ imagem** — a imagem mostra exatamente o que o copy descreve. Um
   system/módulo com várias peças leva **montagem** (`SystemMontage`), nunca
   uma foto de produto que "represente" mais do que é.
2. **Honestidade elétrica/impacto** — nenhuma alegação 1000 V / VDE / IEC
   60900 / IMPACT READY sem `evidencePt` no catálogo que a suporte. Bits AZM:
   sempre com a limitação "máquinas até 7,2 V" quando aplicável.
3. **Japonês verificado** — cada caractere com tradução confirmada na tabela
   abaixo. Nada de leituras inventadas ou katakana de marca não confirmado.
4. **Estado e CTA corretos** — estado real (AVAILABLE/RESERVING/NEGOTIATING
   MOQ/LAB), CTA correspondente, honestidade de preço (target price nunca
   finge preço final).
5. **Mobile** — o card inteiro legível em 360 px; montagens mantêm etiquetas
   legíveis.

## Estado por página

| Página | Escopo | Estado |
|---|---|---|
| `/` | hero, simbologia (3 blocos + regras), featured drop, kits (5), ANEX (mosaico + 3 cards), escolas (8 tiles + 6 cards), fecho | ✅ auditoria desta passagem (JP, VDE, montagem no drop) |
| `/packs` | hero, featured drop, systems (4), módulos (6), lab (3), community (3 colunas), malas (6) + kits (2) + caixas (3), sets oficiais (14), smart packs, legendary, trades (7), B2B | 🔶 malas por profissão lançadas (com/sem máquinas via add-on, canalização, VDE-only); ⬜ conferir cada card contra fichas |
| `/auth` | entrada passwordless (Google + código email) | ✅ implementada; ⬜ confirmar template OTP no dashboard Supabase (`{{ .Token }}`) e SMTP próprio quando o volume crescer |
| `/systems/$id` | hero (montagem), módulos, transparência, perfect matches, best-component | ✅ montagem aplicada; ⬜ revisão copy das razões funcionais |
| `/shop` | grelha curada + grelha Shopify, filtros, badges | ⬜ verificar badges (1000 V/impacto) contra evidência, ficha a ficha |
| `/marcas` | 8 histórias de marca | ⬜ conferir claims de cada história com fonte oficial |
| `/anex` | editoriais ANEX | ⬜ |
| `/referencia/$id` | fichas (137+) | ⬜ sprint "fleet" anterior cobriu UI/UX; rever claims elétricos |
| `/b2b` | form, aside, prefills de kits/packs | ✅ aside corrigido (ids em vitrina); ⬜ copy dos prefills |
| `/pontos`, `/conta`, `/admin`, `/auth` | áreas de conta | ⬜ |
| `/product/$handle`, `/checkout`, `/legal` | Shopify + Stripe + legal | ⬜ copy de produto Shopify fora do nosso controlo — filtrar marcas feita |

## Regras duras (nunca quebrar)

- Montagem só com peças reais do system; slot tracejado para sourcing.
- IMPACT READY só quando documentado no `evidencePt`.
- 1000 V só em ferramenta completa certificada; bit isolado ≠ conjunto
  certificado ( AZM ≤ 7,2 V em máquinas).
- Target price nunca apresentado como preço final.
- Bits de impacto e torsão: S2 ou S5 (ou Cr-Mo-V equivalente) com **HRC equilibrado** —
  dureza com tenacidade. A escolha documenta a combinação de liga + tratamento térmico +
  método de corte; nunca só pelo HRC máximo.
- Dados de faturação (NIF, empresa, morada fiscal) vivem no payment provider (Stripe),
  não no nosso perfil. B2B é exceção por ser pedido de orçamento.
- Malas por profissão: cross bit utilization (cada bit serve 397, impacto e Zyklop) e
  contagem mínima; peças sem marca em vitrina (busca polos, fita isoladora, escadote,
  martelo) entram como EM SOURCING, nunca como referência falsa.
- Bits: só impacto e diamond-impact, em ~65 mm; o alcance vem das extensões
  (AEH-100/150, ALHP-100/300), não de comprimentos 85/110. Três cadeias separadas:
  NORMAL (Zyklop → 8784 → Rapidaptor → bits), IMPACTO (máquina → holder → bits) e
  VDE (ferramenta completa isolada → bits AZM; nunca acessórios normais no meio).
- Porta-bits VDE dedicado (ANEX/VESSEL): não existe no catálogo — pesquisa futura
  para um sistema VDE japonês modular.
- Contadores do site: só procura real de contas (likes/favoritos/reservas).
  Like e favorito exigem login; sem dados, o site mostra "sê o primeiro".
- Reservas capturam preço justo (€) e motivo: alimenta o admin (mín/média/máx por
  system) e a negociação com o fabricante.
- Entrar por email: SMTP incluído do Supabase tem limite de 2-4 emails/hora —
  para produção ligar SMTP próprio (Resend, 100/dia grátis) e garantir o
  template OTP com {{ .Token }}.
- Milwaukee é o holder oficial de impacto (SHOCKWAVE Locking 73/152/305);
  Wera fica reduzido à família Zyklop 3/8″ (8100, 8784, 8794).
- Vitrina de 11 marcas: ANEX, VESSEL, FUJIYA (linha Kurokin, prioridade alta),
  OLFA, TAJIMA, MAKITA, MILWAUKEE, KLEIN (Journeyman/Kurve), KNIPEX, BAHCO e
  WERA só com produtos Zyklop 3/8″ (sem página de marca).
- Paleta oficial: preto obsidiana #1b1917 + pérola #eee8dc + dourado kitsuruki
  (#d4a53f/#a87c1f, dourado suave #e3c27c). Fim do laranja/terracota e do íris.
- Pesquisa futura: porta-bits e roquetes VDE da ANEX/VESSEL para um sistema
  VDE japonês modular; Ryobi RID18X como opção futura de máquinas.
- Packs de bits ordenados por perfil (PH2 duplo, Torx T15-T30, fendas duplo)
  com dupla ponta preferida; PH1 impacto e PH2+PH1 num só bit em sourcing.
- Ryobi (RID18X 300 N·m) registado como opção futura de máquinas: exige
  promover a marca a vitrina.
- Sons de página (faaah em 404/erros/esgotado) desligados por decisão — o
  código fica em sounds.ts para voltar quando quiseres. Só fica o loop
  ambiente com a pill de pause/play e mute.
- Investigação de bundles combinados de outras lojas (conjuntos fechados de marca única
  tipo DLX/Wera-Knipex): as malas REJENDARI ganham por cross-brand + cross-bit.
- Sons de oficina: Web Audio sintetizado (bonk de abertura, catraca no like, ting no
  favorito, thock na reserva, faahaha em erros/esgotado), volume baixo, toggle no rodapé.

## Caracteres japoneses — tabela verificada

| JP | Leitura | Significado | Onde |
|---|---|---|---|
| 選定工具 | せんていこうぐ | seleção de ferramentas | logo, hero |
| 選 | せん | escolher ( kanji do splash) | splash, pipeline |
| せん | — | leitura de 選 | splash |
| 選り抜きの道具を、より賢く。 | えりぬきのどうぐを、よりかしこく。 | ferramentas escolhidas a dedo, com mais inteligência | hero, splash |
| 探す / 選ぶ / 組む / 仕事 | さがす / えらぶ / くむ / しごと | descobrir / escolher / combinar / trabalho | pipeline |
| 原点 | げんてん | a origem, ponto de partida | secção ANEX |
| 基準 | きじゅん | critério, norma | landing simbologia |
| 注目のドロップ | ちゅうもくのドロップ | drop em destaque | featured drop |
| 需要 | じゅよう | procura | community demand |
| 一番人気 / 急成長 / もうすぐ | いちばんにんき / きゅうせいちょう / もうすぐ | mais desejado / crescimento rápido / quase | colunas community |
| 実験室 | じっけんしつ | laboratório | lab |
| 職人キット | しょくにんキット | kits de ofício | packs |
| 組 / 箱 | くみ / はこ | kit / caixa | kits |
| 予約 | よやく | reserva | dialog, /conta |
| お気に入り | おきにいり | favoritos | /conta |
| 完璧な組み合わせ | かんぺきなくみあわせ | combinação perfeita | perfect matches |
| 透明性 | とうめいせい | transparência | bloco fabricante |
| 構成 | こうせい | composição | módulos do system |
| 仕入れ | しいれ | procurement | /admin |
| 紹介 / 会員 / 確認 / ポイント | しょうかい / かいいん / かくにん / ポイント | convite / membro / confirmação / pontos | auth, conta |
| 伝説の組み合わせ | でんせつのくみあわせ | combinações lendárias | legendary |
| 一貫生産 | いっかんせいさん | produção integrada (numa casa só) | ANEX |
| 絶縁 / 衝撃 / 捻り / トルク / 電子 / 電動 | ぜつえん / しょうげき / ひねり / トルク / でんし / でんどう | isolamento / impacto / torsion / torque / eletrónica / elétrico | regimes |
| 空調・精密・ドライブ・ロックシステム | くうちょう / せいみつ / ドライブ / ロック | AVAC / precisão / drive / lock | systems |
| トルクス完全版 / ヘキサ完全版 | トルクスかんぜんばん / ヘキサかんぜんばん | Torx / Hex edição completa | módulos |
| 石膏ボード | せっこうボード | placa de gesso (pladur) | drywall |
| ポケット | — | bolso ( katakana) | Pocket Mechanic |
| 設備 / 整備 / 組立 / 電設 | せつび / せいび / くみたて / でんせつ | instalação / manutenção / montagem / instalação elétrica | trades |
| 龍靭 | りゅうじん | Ryujin ( linha ANEX) | bits |

Corrigido nesta passagem: ~~SENNARI~~ → せん · ~~アネックス~~ → 原点 ·
~~携帯~~ → ポケット.
