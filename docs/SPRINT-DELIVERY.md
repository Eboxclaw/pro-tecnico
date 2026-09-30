# REJENDARI — entregas por sprint

Base: main 441bfd3. Autor: ebox <eitherbox@proton.me>.
Sequência obrigatória: PR → checks → merge → publicação → verificação pública.
Não começar o sprint seguinte sem concluir o anterior.

## Sprint 1 — ANEX
- Homepage pública verificada a 30 setembro 2026: carrega, três capítulos presentes.
- Cinco soluções em HTML na abertura /anex; cena Three.js decorativa e progressiva.
- Seis capítulos com narrativa, mantendo parâmetro family, fontes e limites.
- Cinco acessórios existentes com ligações às fichas.
- Fontes consultadas: https://www.anextool.co.jp/item/aqh-s1/,
  https://www.anextool.co.jp/item/abh-10/,
  https://www.anextool.co.jp/item/aeh-100/,
  https://www.anextool.co.jp/item/amb-635/,
  https://www.anextool.co.jp/item/abs-2065/.
- Local: build e tipos passam; testes editoriais e pesquisa passam.
- Browser: desktop e largura real 375px, cinco links presentes, sem overflow,
  sem erros de consola no percurso observado.
- Reduced motion e WebGL indisponível: fallback e guardas revistos no código;
  emulação dessas condições em browser ainda não realizada.
- PR #21 integrada (8c34e84); /anex público verificado com cinco soluções e acessórios.
- Pausa manual validada no browser: canvas removido, conteúdo preservado.

## Próximas entregas
2. Pesquisa estruturada, aliases, VDE separado de 1000 V.
3. Cabeçalho, toque, tipografia, filtros e rails mobile.
4. Inventário editorial e revisão em lotes por marca.
5. Packs de manutenção, montagem e AVAC.
6. Hierarquia ANEX / Japão / Wera e revisão transversal.

## Sprint 2 — pesquisa
- Interpretação por tokens completos, termos residuais e precedência do URL.
- Desativação literal persistida no URL até mudar a consulta.
- Shopify exige tags estruturadas focus:<id>, task:<id>, certification:vde;
  não se infere certificação de texto comercial. Produtos sem atributos ficam excluídos.
- VDE editorial limitado às referências Knipex 74 06 200 e 13 96 200,
  documentadas nas fichas oficiais:
  https://www.knipex.com/sites/default/files/Product%20data%20sheet%20EN%2074%2006%20200.pdf
  https://www.knipex.com/sites/default/files/Product%20data%20sheet%20EN%2013%2096%20200.pdf
- VESSEL descreve ensaios exigidos para VDE; não incluído automaticamente no filtro de certificação.
- Contagens dos chips referem-se a referências editoriais, com marca, tarefa e termos residuais.
- Preço/categoria continuam identificados como filtros apenas dos produtos publicados.
