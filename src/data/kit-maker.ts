/**
 * Kit Maker — o wizard guiado da casa. Uma sequência de 9 cartões pensados:
 * o utilizador dá o nome, escolhe (ou declara "já tenho" / "não preciso")
 * e o kit constrói-se por sinergias, não por objectos individuais.
 *
 * Conceito: light weight, high reach · low effort, high outcome.
 * Sem preços: a fórmula termina em "?" e o pedido segue para o B2B.
 *
 * Anatomia de um passo:
 *  - `branches` — variantes multi-escolha (ex.: impacto vs precisão; os ramos
 *    do Básico: ratchet, clássica, VDE e porta-bits). Escolhe-se o ramo primeiro.
 *  - `groups` — sub-tabs temáticas para cartões SEM ramos de variante (ex.: os
 *    roquetes por família, as chaves de porca por gama). A ordem dos grupos é
 *    editorial: no caso dos roquetes é a ordem de batalha da casa — o offset
 *    ANEX primeiro, o Wera Zyklop como personagem principal, depois os
 *    pass-through Klein e Bahco, e a fechar bits e cabeças especiais.
 *  - `refIds` — opções directas, sem ramos nem grupos.
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
  /** Sub-tabs temáticas (ex.: roquetes por família) — renderizam-se como abas quando existem. */
  groups?: Array<{ id: string; labelPt: string; refIds: string[] }>;
  /** Opções directas (sem ramos). */
  refIds?: string[];
};

export const KIT_MAKER_STEPS: KitMakerStep[] = [
  {
    id: "basico",
    topicPt: "Básico · o vaivém",
    jp: "基本",
    questionPt: "Como começa o teu dia — e com que aço?",
    notePt:
      "A primeira ferramenta que entra na mão define o kit inteiro: roquete na palma, madeira clássica, isolamento certificado ou porta-bits. Escolhe o teu gesto — ou declara que já tens.",
    branches: [
      {
        id: "ratchet",
        labelPt: "Screwdriver ratchet",
        refIds: ["klein-32305", "vessel-td70", "anex-525", "anex-307-d", "anex-370"],
      },
      {
        id: "classica",
        labelPt: "Chave de fenda clássica",
        refIds: ["anex-7000-2-100", "anex-170-2-100", "fujiya-524k-bg"],
      },
      {
        id: "vde",
        labelPt: "Screwdriver VDE",
        refIds: ["anex-7900-2-100", "anex-7920", "vessel-960-ph2-100", "klein-32310ins"],
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
    questionPt: "O vaivém por ordem de batalha.",
    notePt:
      "A ordem não é decoração: é a sequência com que a casa arma um kit. Primeiro o offset nosso, depois o Zyklop no palco principal, os pass-through Klein e Bahco a seguir, e os bits e cabeças especiais a fechar a coluna.",
    groups: [
      {
        id: "offset",
        labelPt: "1.º O nosso offset",
        refIds: ["anex-aoa-17s1", "anex-436"],
      },
      {
        id: "zyklop",
        labelPt: "2.º Wera Zyklop · o personagem principal",
        refIds: ["wera-8100-sb-6"],
      },
      {
        id: "klein-passthrough",
        labelPt: "3.º Klein pass-through",
        refIds: ["klein-65408adp", "klein-65301adp", "klein-65431lp"],
      },
      {
        id: "bahco-passthrough",
        labelPt: "4.º Bahco pass-through",
        refIds: ["bahco-808050p"],
      },
      {
        id: "bits-especiais",
        labelPt: "5.º Bits e cabeças especiais",
        refIds: ["anex-397-d", "anex-525", "anex-307-d", "anex-aqh-s1"],
      },
    ],
  },
  {
    id: "chaves",
    topicPt: "Chaves de porca",
    jp: "レンチ",
    questionPt: "Chaves de porca: a gama Kurokin inteira ou a ERGO sueca?",
    notePt:
      "Kurokin é a linha negra da Fujiya em aço forjado — do Short Monkey de bolso à Quick Monkey de gatilho e à PipeREN 2-em-1. A ERGO entra quando quem manda é o aperto sueco.",
    groups: [
      {
        id: "kurokin",
        labelPt: "Kurokin · a gama",
        refIds: [
          "fujiya-fls-32-bg",
          "fujiya-fta-32-bg",
          "fujiya-fla-43-bg",
          "fujiya-fts-28-bg",
          "fujiya-fgp-32-bg",
          "fujiya-flt-34-bg",
          "fujiya-fgl-38-bg",
          "fujiya-flp-38-bg",
        ],
      },
      {
        id: "bahco-ergo",
        labelPt: "BAHCO ERGO",
        refIds: ["bahco-9031p", "bahco-9033"],
      },
    ],
  },
  {
    id: "canalizacao",
    topicPt: "Canalização",
    jp: "配管",
    questionPt: "Grip e abertura: o que o dia de tubo te pede?",
    notePt:
      "A PipeREN da Fujiya pertence aqui: chave de porca e de tubos no mesmo corpo Kurokin. A Cobra e a Pliers Wrench fazem o resto sem morder o cromo.",
    refIds: ["knipex-cobra-250", "knipex-pliers-wrench-250", "anex-3980-2-100", "fujiya-flp-38-bg"],
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
