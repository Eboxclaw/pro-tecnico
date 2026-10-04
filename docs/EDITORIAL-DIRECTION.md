# REJENDARI — direção editorial e preenchimento

## Inspiração visual (29 setembro 2026)

Referência analisada no browser: https://www.t-kaneko.co.jp/en/.
A adaptação usa fotografia ampla, espaço em branco, alternância entre grafite e papel,
texto curto e uma hierarquia tipográfica mais calma. Nenhum logótipo, vídeo, fotografia,
certificação ou texto institucional da Kaneko foi copiado.

A abertura utiliza uma fotografia oficial de aplicação da Makita DTD173:
https://www.makita.co.nz/products/model/DTD173Z
Imagem: https://images.makita.co.nz/_productshots/actionshot/D/DT/DTD173_3_act-M.jpg
A imagem é externa, com prioridade de carregamento alta e sem envio de referrer.
O movimento de entrada respeita prefers-reduced-motion. Os direitos de uso comercial
continuam a depender de autorização do fornecedor; uma fonte oficial não é uma licença.

## Conteúdo completado nesta revisão

- 16 referências do catálogo original receberam imagens de fabricante/canal regional.
- Corrigido o URL 404 da ANEX 1902-BA2.
- Adicionadas sete referências Makita LXT: DHP492Z, DTD173Z, DGD800Z,
  DGA519Z, DLX2549TJ, DLX2431TJ e DLX3221TJ.
- Os três conjuntos têm composição explícita na ficha e aparecem em Kits.
- Fonte portuguesa do DLX2549TJ: https://www.makita.pt/product/dlx2549tj.html.
- DLX2431TJ e DLX3221TJ seguem o catálogo Makita Eslováquia, identificado em cada ficha;
  o fornecimento e a versão regional para Portugal não foram confirmados.
- Imagens de família/modelo ilustrativo têm legenda (Ko-ken 3441MZ, LOBSTER UM24XG/UM36XG,
  Makita DTD172RTJ). Nenhuma referência editorial ganhou preço ou stock inventado.
- Imagens em marcas, kits, autenticação e cartões usam fallback para falha de rede.
- Pedidos de disponibilidade transportam a referência para o formulário B2B.
- Galeria Shopify permite escolher fotografias; falha de rede tem ação de repetição.
- Conta e campanhas distinguem falha de carregamento de ausência de dados.
- Informação legal é preparatória, com dados comerciais pendentes explicitamente identificados.

## Limites

Durante a revisão apareceram alterações adicionais de outro trabalho no checkout:
expansão para Wera, Knipex, Wiha, Bahco, novas categorias e Legendary Combos.
Foram preservadas. Não constituem catálogo técnico validado por esta revisão;
muitas dessas referências ainda não têm fotografia ou fonte de produto específica.
Não confundir a auditoria inicial de 84 imagens com a expansão posterior de catálogo.

A ambiguidade da palavra “torna” aguarda esclarecimento do utilizador. Foram incluídas
aparafusadora de impacto, retificadora reta, rebarbadora e berbequim; não foi inferido um torno.
Não foram submetidos formulários, criadas contas, feitas compras ou alterados dados de produção.

## Padrão de imagem — o prato único (sprint 10, 4 outubro 2026)

Regra: existe um só prato de imagem, `--plate` (#eee8dc), e duas montagens.

- **Fundo claro → `.product-plate`**: fundo do token + textura de pontos + `mix-blend-mode:
  multiply` na imagem. O fundo branco das fotos de catálogo derrete no papel — nunca um
  retângulo branco colado ao creme. Aplicado em: ProductCard, SmartProductVisual,
  thumbs de kits/packs/carrinho, Legendary Combos, Smart Kit, Bit Rail, comparações,
  grelha de curadoria, tiles do Edit e sets oficiais.
- **Fundo escuro → `.photo-print`**: a foto monta como cópia em papel fotográfico
  (#faf8f3, border hairline, sombra, hover com leve rotação). Nunca uma foto solta sobre
  banda escura. Aplicado em: hero WeraFeature e lead do RejendariEdit.
- **Contact shadow**: `.product-ground` desenha a elipse de aterragem sob o produto nos
  pratos onde a imagem flutua (comparações, Smart Kit). Não usar `drop-shadow` em fotos
  JPEG de fundo branco — com multiply a sombra vira retângulo sujo; a elipse é
  independente do alfa.
- **Sem fotografia** → `ProductMonogram` (monograma da marca em cqi, escala com o prato).
  **Fotografia que falha** → estado com ImageOff sobre o prato. São estados distintos.
- Todos os hex antigos (`#eee9de`, `#ece9e2`, `#e8e1d4`, `#f5f4ee`, `#eee8dd`) foram
  absorvidos pelo token; não criar novos tons de prato.

Auditoria HTTP das 135 URLs (outubro 2026): 0 falhas, 0 imagens abaixo de 450 px;
~85% com 832 px ou mais. Seis imagens ficam no limite e precisam de re-source manual
(o padrão de URL não oferece originais maiores): 4× Knipex (480×480, CDN só serve
`square_md`; knipex.com bloqueia scraping), Fujiya 770-200 (490×435, master pequeno),
Ko-ken 3725Z (500×281, master pequeno). Substituir quando houver acesso a catálogo
de alta resolução ou fotografia própria.

## Validação local

- TypeScript e build de produção concluídos com sucesso em 29 setembro.
- Os três testes existentes de pesquisa passaram.
- Inspeção em browser de oito rotas (catálogo, marcas, kits, B2B, autenticação, pontos,
  informação legal e ficha Makita DLX2549TJ), sem overflow horizontal a 1280 px.
- Percurso ficha → pedido B2B confirmado com referência preenchida. Não houve submissão.
- Imagem inicial carregada e screenshot guardada. Animação tem regra de redução de movimento.
- Auditoria HTTP inicial: 81 imagens válidas, duas respostas octet-stream a confirmar
  visualmente e um 404 Ko-ken 3285ZA. Este último foi substituído pelo URL atual da
  coleção oficial e novamente confirmado como HTTP 200 image/jpeg.
- O ajuste de viewport do browser não alterou a largura real: validação móvel pendente.
- Checkout, sessões de dois utilizadores, webhooks e staging não foram validados nesta revisão.
