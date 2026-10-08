/**
 * Kit Maker — o wizard guiado da casa. Uma sequência de cartões pensados:
 * o utilizador dá o nome, escolhe (ou declara "já tenho" / "não preciso")
 * e o kit constrói-se por sinergias, não por objectos individuais.
 *
 * Conceito: light weight, high reach · low effort, high outcome.
 * Sem preços: a fórmula termina em "?" e o pedido segue para o B2B.
 */

export type KitMakerBranch = {
  id: string;
  labelPt: string;
  /** refIds desta variante — os cards mostram-se com base na escolha. */
  refIds: string[];
};

export type KitMakerStep = {
  id: string;
  topicPt: string;
  jp: string;
  questionPt: string;
  notePt?: string;
  /** Variantes multi-escolha (ex.: impacto vs precisão) — escolhe-se primeiro o ramo. */
  branches?: KitMakerBranch[];
  /** Opções directas (sem ramos). */
  refIds?: string[];
};

export const KIT_MAKER_STEPS: KitMakerStep[] = [
  {
    id: "basico",
    topicPt: "Básico · o vaivém",
    jp: "基本",
    questionPt: "Como começa o teu dia: screwdriver ratchet ou porta-bits?",
    notePt: "A base de tudo: o que fica na mão. Escolhe os teus gestos — ou declara que já tens.",
    branches: [
      {
        id: "ratchet",
        labelPt: "Screwdriver ratchet",
        refIds: ["klein-32305", "vessel-td70", "anex-525", "anex-370"],
      },
      {
        id: "holdbit",
        labelPt: "Hold bit (porta-bits)",
        refIds: ["milwaukee-shockwave-lock-73", "anex-aqh-s1", "wera-817-vde"],
      },
    ],
  },
  {
    id: "extensoes",
    topicPt: "Extensões",
    jp: "ヘッド",
    questionPt: "Alcance para impacto ou para precisão?",
    notePt: "Light weight, high reach: o alcance vem da extensão, nunca do bit comprido.",
    branches: [
      {
        id: "impacto",
        labelPt: "Impacto",
        refIds: ["anex-alhp-100", "anex-alhp-150", "anex-alhp-300"],
      },
      {
        id: "precisao",
        labelPt: "Precisão / eco",
        refIds: ["anex-aeh-100", "anex-aeh-200", "anex-aeh-300"],
      },
    ],
  },
  {
    id: "bits",
    topicPt: "Bits",
    jp: "先端",
    questionPt: "Bits de impacto ou de precisão? (podes levar os dois)",
    notePt:
      "Política da casa: Ryujin Black e Diamond apenas — impacto dimensionado ou diamante para o que escorrega.",
    branches: [
      {
        id: "impacto",
        labelPt: "Impacto",
        refIds: [
          "anex-abrs-14m-2-65",
          "anex-abrs5-2065",
          "anex-abrd5-2082",
          "milwaukee-shockwave-ph2-50",
        ],
      },
      {
        id: "precisao",
        labelPt: "Precisão",
        refIds: ["anex-adrs-2065", "anex-adrs-2085", "anex-adrs-1065"],
      },
    ],
  },
  {
    id: "roquetes",
    topicPt: "Roquetes e dinamos",
    jp: "ラチェット",
    questionPt: "Que vaivém te define? (roquetes, T-handle e offsets)",
    refIds: ["anex-397-d", "anex-525", "anex-370", "anex-436", "anex-aoa-17s1"],
  },
  {
    id: "canalizacao",
    topicPt: "Canalização",
    jp: "配管",
    questionPt: "Grip e abertura: o que o dia de tubo te pede?",
    refIds: ["knipex-cobra-250", "bahco-9031p", "knipex-pliers-wrench-250", "anex-3980-2-100"],
  },
  {
    id: "eletricidade",
    topicPt: "Eletricidade · VDE",
    jp: "絶縁",
    questionPt: "A cadeia 1000 V: porta-bits isolado, ponteiras, corte e tubo.",
    notePt:
      "VDE não precisa de impacto — mas exige bom aço e aperto certificado. EN IEC 60900 basta para 1000 V; ASTM F1505 é o equivalente aceite.",
    refIds: [
      "klein-32310ins",
      "wera-837i-ra-vde",
      "anex-azm-2698",
      "knipex-13-96-200",
      "knipex-74-06-200",
      "knipex-9804-t-socket-vde",
    ],
  },
  {
    id: "corte",
    topicPt: "Corte e precisão",
    jp: "切り · 測る",
    questionPt: "Fitas, X-atos e o prumo: a medida que não se discute.",
    refIds: ["tajima-l25-50e1-eur", "olfa-xh-1", "olfa-l5", "tajima-pzb300"],
  },
  {
    id: "maquinas",
    topicPt: "Máquinas 18 V",
    jp: "電動",
    questionPt: "Impacto, furadeira, retificadora: o motor do sistema.",
    notePt:
      "Plataforma LXT Makita em corpo Z (baterias à parte pelo conjunto DLX). Ryobi e retificadora dedicada: EM SOURCING.",
    refIds: [
      "makita-dtd172z",
      "makita-dtd173z",
      "makita-dhp489z",
      "makita-dhr243z",
      "makita-dlx2549tj",
    ],
  },
];

export function kitMakerStepById(id: string): KitMakerStep | undefined {
  return KIT_MAKER_STEPS.find((step) => step.id === id);
}
