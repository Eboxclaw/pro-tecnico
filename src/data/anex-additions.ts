import type { CuratedToolReference } from "./curated-tool-references";

/** Checked against ANEX 2026 and the manufacturer product pages on 2026-09-29. */
export const ANEX_ADDITIONS: CuratedToolReference[] = [
  {
    id: "anex-aoa-19",
    brand: "ANEX",
    brandSlug: "ANEX",
    model: "AOA-19",
    officialCode: "AOA-19",
    namePt: "Adaptador offset de 19 mm",
    japanese: "オフセットアダプター",
    task: "fastening",
    categoryPt: "Acesso difícil · adaptadores",
    badge: "Acesso difícil",
    notePt:
      "Transmite a rotação até ao parafuso quando o corpo da máquina não cabe na zona de trabalho. Saída de 19 mm para montagem e instalação.",
    storyPt:
      "O espaço disponível passa a orientar a escolha: este adaptador desloca o ponto de aperto, mantendo a máquina afastada do obstáculo.",
    specPt: "H19 · máximo 180 N·m · entrada hex. 6,35 mm / H19",
    evidencePt:
      "O fabricante indica compatibilidade com máquinas de 18 V e 40 V. Os sockets específicos AOA-19, vendidos separadamente, permitem trabalhar de H10 a H24.",
    limitationsPt:
      "Respeitar o limite de 180 N·m. Os sockets AOA-19 são acessórios separados; não assumir compatibilidade com a série AOA-17.",
    manufacturedIn: "Japão",
    catalogViewerPage: 40,
    referenceUrl: "https://www.anextool.co.jp/item/aoa-19/",
    imageUrl: "https://www.anextool.co.jp/wp-content/uploads/AOA-19_2-768x768.jpg",
    imageAlt: "Adaptador offset ANEX AOA-19 de 19 mm",
    imageSourceLabel: "Imagem do fabricante ANEX",
    compareGroup: "offset-adapter",
  },
  {
    id: "anex-ata-m4",
    brand: "ANEX",
    brandSlug: "ANEX",
    model: "ATA-M4",
    officialCode: "ATA-M4",
    namePt: "Adaptador de binário fixo de 1,4 N·m",
    japanese: "トルクアダプター",
    task: "precision",
    categoryPt: "Aperto controlado · adaptadores",
    badge: "Binário definido",
    notePt:
      "Um limite de aperto definido para trabalho repetitivo. A ANEX recomenda este valor para parafusos M4 em quadros de distribuição.",
    storyPt:
      "Escolhe pelo binário exigido pelo equipamento. O diâmetro M4, por si só, não determina o aperto correto para todas as aplicações.",
    specPt: "1,4 N·m ±10% · 75 mm · hex. 6,35 mm",
    evidencePt:
      "Utilização manual ou com aparafusadora: a ANEX recomenda até 7,2 V e até 250 rpm. Certificado de calibração disponível mediante pedido ao fornecedor, com custo adicional.",
    limitationsPt:
      "Não utilizar com aparafusadora de impacto. Confirmar o binário prescrito pelo fabricante do equipamento; este acessório não é apresentado como ferramenta isolada.",
    catalogViewerPage: 26,
    referenceUrl: "https://www.anextool.co.jp/item/ata-m4/",
    imageUrl: "https://www.anextool.co.jp/wp-content/uploads/ATA-M4_2.jpg",
    imageAlt: "Adaptador ANEX ATA-M4 de 1,4 N·m",
    imageSourceLabel: "Imagem do fabricante ANEX",
    compareGroup: "torque-adapter",
  },
  {
    id: "anex-anh-s3",
    brand: "ANEX",
    brandSlug: "ANEX",
    model: "ANH-S3",
    officialCode: "ANH-S3",
    namePt: "Conjunto de extração de parafusos danificados",
    japanese: "なめたネジはずしビット",
    task: "fastening",
    categoryPt: "Extração · manutenção",
    badge: "Recuperar o trabalho",
    notePt:
      "Três extratores para parafusos de M2,5 a M8 com a cruz danificada. O conjunto inclui peças de substituição e óleo de corte para inox.",
    storyPt:
      "Uma cabeça danificada não precisa de terminar o trabalho. A série ANH combina perfuração e extração, com elementos de desgaste substituíveis.",
    specPt: "M2,5–M8 · 3 bits de 65 mm · hex. 6,35 mm",
    kitContents: [
      "Bits para M2,5–3, M3,5–5 e M6–8",
      "Óleo de corte para inox",
      "Brocas de substituição de 1,5 / 2 / 3 mm",
      "Elementos de extração de substituição n.º 1 e n.º 2",
      "Chaves, parafuso de fixação e estojo",
    ],
    evidencePt:
      "A ANEX identifica fabrico no Japão e peças substituíveis. Requer uma máquina compatível, fornecida separadamente, e utilização segundo as instruções do fabricante.",
    limitationsPt:
      "Não indicado para parafusos tratados termicamente com dureza HRC40 ou superior, incluindo os tipos excluídos pelo fabricante. Verificar o material e a medida antes da extração.",
    manufacturedIn: "Japão",
    catalogViewerPage: 48,
    referenceUrl: "https://www.anextool.co.jp/item/anh-s3/",
    imageUrl: "https://www.anextool.co.jp/wp-content/uploads/ANH-S3_1.jpg",
    imageAlt: "Conjunto ANEX ANH-S3 com três extratores e acessórios",
    imageSourceLabel: "Imagem do fabricante ANEX",
    compareGroup: "screw-extraction",
  },
  {
    id: "anex-3610-n",
    brand: "ANEX",
    brandSlug: "ANEX",
    model: "3610-N",
    officialCode: "3610-N",
    namePt: "Extrator manual de parafusos de precisão",
    japanese: "なめた精密ネジはずし",
    task: "precision",
    categoryPt: "Extração · precisão",
    badge: "Precisão manual",
    notePt:
      "Para pequenos parafusos de cruz +0 danificados, de M1 a M2,6, em óculos, relógios e equipamentos. Inclui punho de precisão e bit extrator.",
    storyPt:
      "Na bancada, a solução também pode ser pequena: lâmina substituível, punho manual e uma aplicação bem definida.",
    specPt: "+0 · M1–M2,6 · haste hex. 6,35 mm",
    kitContents: ["Bit extrator de parafusos de precisão", "Punho manual de precisão"],
    evidencePt:
      "A ANEX indica fabrico no Japão e lâmina HSS substituível. O modelo AK-23N-0 é o bit de substituição; AK-23N-EX é a lâmina de substituição.",
    limitationsPt:
      "Uso exclusivamente manual, com punho. Não utilizar em parafusos tratados termicamente nem ligar o bit a uma máquina.",
    manufacturedIn: "Japão",
    catalogViewerPage: 44,
    referenceUrl: "https://www.anextool.co.jp/item/3610-n/",
    imageUrl: "https://www.anextool.co.jp/wp-content/uploads/3610-N_2-768x768.jpg",
    imageAlt: "Extrator de precisão ANEX 3610-N com punho e bit",
    imageSourceLabel: "Imagem do fabricante ANEX",
    compareGroup: "screw-extraction",
  },
];
