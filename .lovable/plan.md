# pro'tecnico — loja online de ferramenta profissional

Loja portuguesa de ferramenta profissional premium, com packs próprios por profissão e um programa de pontos com sorteios semanais. Trilingue (PT / EN / ES). Construída em modo fechado, pronta para abrir ao público quando os fornecedores e contratos estiverem fechados.

## Base de vendas: Shopify

Produtos físicos, stock, envios e pagamentos (incluindo MB WAY) ficam na Shopify. O site é a frente de loja: catálogo, packs, comparação, e checkout na Shopify.

Primeiro passo na execução: ativar a integração Shopify (loja nova de desenvolvimento, gratuita enquanto construímos). Sem isso não há catálogo real nem checkout.

## Páginas

- **Início** — posicionamento "Ferramenta profissional escolhida para o trabalho", heróis do catálogo, packs em destaque, raspadinha/pontos, marcas âncora.
- **Loja** — catálogo com filtros por marca, profissão, categoria e preço.
- **Produto** — fotos oficiais, especificações (EAN, SKU, drive, medida, VDE), garantia, packs onde o produto entra.
- **Packs / Setups** — AVAC, Eletricista, Manutenção, Solar, Canalização, cada um em Core / Compact / Pro.
- **Monta o teu kit** — o cliente escolhe ferramentas e vê o preço do conjunto com desconto.
- **Comparar** — comparação lado a lado de ferramentas equivalentes.
- **Pontos e sorteios semanais** — saldo de pontos, como ganhar, sorteio da semana, vencedores anteriores, regulamento.
- **B2B** — pedido de conta profissional e orçamentos por volume.
- **Conta** — registo, entrada, encomendas, pontos.
- **Marcas** — uma página por marca (Wera, Knipex, Bahco, Wiha, Stabila, FACOM, Beta, Klauke).
- **Legais** — termos, privacidade, devoluções, garantia/RMA, regulamento do sorteio.

## Pontos e sorteios — como fica (e a parte legal)

Modelo escolhido para ficar do lado seguro em Portugal: **programa de fidelização**, não jogo de sorte e azar.

- Pontos por compras, registo, avaliações e partilhas.
- Pontos trocáveis por descontos — valor sempre garantido, nunca depende da sorte.
- Sorteio semanal com **entrada gratuita alternativa** (basta ter conta e inscrever-se na semana), sem compra obrigatória e sem pagar para participar.
- Prémios anunciados, regulamento público, vencedor registado.
- A "raspadinha" é a animação de revelação do prémio já atribuído pelo sorteio, não um bilhete pago.

Recomendo validar o regulamento com um advogado antes de abrir ao público — promoções com prémios têm regras próprias em Portugal e eu não posso dar aconselhamento jurídico. Construo a mecânica já nesta forma segura.

## Marca e visual

Industrial moderno, independente dos fabricantes: fundo grafite, laranja-sinalização como cor de ação, tipografia condensada técnica para títulos. Nada de verde Wera nem vermelho Knipex como identidade. Tom direto e técnico, sem linguagem de bricolage.

Logótipo, wordmark e favicon pro'tecnico gerados como parte do trabalho.

## Idiomas

PT como idioma base, com EN e ES selecionáveis. Todos os textos do site passam por um ficheiro de traduções desde o início, para não haver retrabalho.

## Loja fechada até ao lançamento

Ecrã de acesso por palavra-passe à frente de todo o site, com uma página pública de "em breve" e recolha de emails. Desligável num só sítio no dia do lançamento.

## Detalhes técnicos

- Shopify Storefront como fonte de produtos, variantes, stock, preços e checkout; chamadas feitas no servidor.
- Packs como produtos Shopify próprios (bundles comerciais), ligados às suas peças para mostrar a composição e a poupança.
- Lovable Cloud para contas de cliente, saldo de pontos, inscrições e resultados dos sorteios, lista de espera e pedidos B2B — com regras de acesso por utilizador e sorteio decidido só no servidor.
- Traduções num dicionário PT/EN/ES com seletor persistente.
- Campos extra de catálogo (EAN, profissão, VDE, tarefas) via metafields/tags Shopify.
- Margens e landed cost ficam fora do site (folha de cálculo), não expostos na loja.

## Fora deste âmbito

Emails aos fornecedores, contratos, tabelas de negociação e cálculo de margens SKU a SKU são trabalho comercial fora do site. Posso, num passo seguinte, construir um painel interno privado com o Supplier Master, negociação, margens e checklist de pré-lançamento.

## Ordem de execução

1. Ativar Shopify (loja de desenvolvimento).
2. Marca: identidade, logótipo, sistema de cores e tipografia.
3. Estrutura do site, idiomas e ecrã de acesso fechado.
4. Catálogo, produto, filtros e carrinho/checkout.
5. Packs por profissão, monta o teu kit, comparar.
6. Contas, pontos e sorteios semanais com regulamento.
7. B2B, páginas legais e páginas de marca.
8. Testes de compra ponta a ponta e revisão em telemóvel.
