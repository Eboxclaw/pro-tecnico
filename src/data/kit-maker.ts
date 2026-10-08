/**
 * Kit Maker — o wizard guiado da casa. Uma sequência de 11 cartões que cobre
 * o catálogo inteiro: o utilizador dá o nome, escolhe (ou declara "já tenho"
 * / "não preciso") e o kit constrói-se por sinergias, não por objectos.
 *
 * Conceito: light weight, high reach · low effort, high outcome.
 * Sem preços: a fórmula termina em "?" e o pedido segue para o B2B.
 *
 * Anatomia de um passo:
 *  - `branches` — variantes multi-escolha (ex.: impacto vs precisão; ratchet
 *    vs VDE vs porta-bits). Escolhe-se o ramo primeiro.
 *  - `groups` — sub-tabs temáticas por marca/família (ex.: os roquetes na
 *    ordem de batalha da casa — offset ANEX, Wera Zyklop como personagem
 *    principal, Klein pass-through, Bahco pass-through, bits e cabeças
 *    especiais; os soquetes por marca; a gama Kurokin inteira nas chaves).
 *  - `refIds` — opções directas, sem ramos nem grupos.
 *
 * Política da casa refletida aqui: sem chaves de fenda normais (exceção: a
 * Wanidora); bits apenas Black Ryujin e Diamond Ryujin; VDE não precisa de
 * impacto mas exige bom aço e certificação.
 */

export type KitMakerBranch = {
  id: string;
  labelPt: string;
  /** refIds desta variante — os cards mostram-se com base na escolha. */
  refIds: string[];
};

export type KitMakerGroup = {
  id: string;
  labelPt: string;
  refIds: string[];
};

export type KitMakerStep = {
  id: string;
  topicPt: string;
  jp: string;
  questionPt: string;
  notePt?: string;
  /** Variantes multi-escolha — escolhe-se o ramo primeiro. */
  branches?: KitMakerBranch[];
  /** Sub-tabs temáticas por marca/família. */
  groups?: KitMakerGroup[];
  /** Opções directas (sem ramos nem grupos). */
  refIds?: string[];
};

export const KIT_MAKER_STEPS: KitMakerStep[] = [
  {
    id: "basico",
    topicPt: "Básico · o vaivém",
    jp: "基本",
    questionPt: "Como começa o teu dia — screwdriver ratchet, VDE ou porta-bits?",
    notePt:
      "A primeira ferramenta que entra na mão define o kit inteiro. Sem chaves normais no catálogo — a exceção é a Wanidora, no passo de canalização.",
    branches: [
      {
        id: "ratchet",
        labelPt: "Screwdriver ratchet",
        refIds: [
          "klein-32305",
          "vessel-td70",
          "anex-525",
          "anex-307-d",
          "anex-370",
          "anex-431",
          "vessel-td24",
          "vessel-230w",
          "vessel-270bw",
          "vessel-td6808tx",
        ],
      },
      {
        id: "vde",
        labelPt: "Screwdriver VDE",
        refIds: [
          "anex-7900-2-100",
          "anex-7920",
          "vessel-960-ph2-100",
          "vessel-200-ph2-100",
          "klein-32310ins",
          "klein-32604ins",
        ],
      },
      {
        id: "holdbit",
        labelPt: "Hold bit (porta-bits)",
        refIds: [
          "milwaukee-shockwave-lock-73",
          "milwaukee-shockwave-lock-152",
          "anex-aqh-s1",
          "wera-817-vde",
          "anex-amb-635",
        ],
      },
    ],
  },
  {
    id: "extensoes",
    topicPt: "Extensões",
    jp: "ヘッド",
    questionPt: "Alcance para impacto ou para precisão?",
    notePt: "Light weight, high reach: o alcance vem da extensão, nunca do bit comprido.",
    groups: [
      {
        id: "aeh",
        labelPt: "ANEX AEH · eco",
        refIds: ["anex-aeh-100", "anex-aeh-150", "anex-aeh-200", "anex-aeh-300"],
      },
      {
        id: "alhp",
        labelPt: "ANEX ALHP · impacto",
        refIds: ["anex-alhp-100", "anex-alhp-150", "anex-alhp-300"],
      },
      {
        id: "vessel",
        labelPt: "VESSEL slim 40 V",
        refIds: ["vessel-exh-100", "vessel-exh-150", "vessel-dxh-350", "vessel-ibhbm-150"],
      },
      {
        id: "klein",
        labelPt: "Klein Dual-Lock",
        refIds: ["klein-32791", "klein-31088", "klein-31089"],
      },
    ],
  },
  {
    id: "bits",
    topicPt: "Bits",
    jp: "先端",
    questionPt: "Misto, impacto ou precisão? (multi-escolha — leva o que o dia pede)",
    notePt:
      "Política da casa: Ryujin Black e Diamond apenas — impacto dimensionado ou diamante para o que escorrega. O misto 525 da ANEX cobre PH, Torx, hex e soquetes num estojo só.",
    groups: [
      {
        id: "misto",
        labelPt: "Misto ANEX 525",
        refIds: ["anex-525-28b", "anex-525-9t", "anex-525-10b", "anex-acmh9-e"],
      },
      {
        id: "black",
        labelPt: "Impacto · Black Ryujin",
        refIds: [
          "anex-abr-14m-2-65",
          "anex-abrs-14m-2-65",
          "anex-abrs5-2065",
          "anex-abrd5-2082",
          "anex-abrs5-01",
        ],
      },
      {
        id: "diamond",
        labelPt: "Precisão · Diamond",
        refIds: ["anex-adr-2065", "anex-adrs-2065", "anex-adrs-2085", "anex-adrs-1065"],
      },
      {
        id: "milwaukee",
        labelPt: "Impacto Milwaukee",
        refIds: ["milwaukee-shockwave-ph2-50"],
      },
      {
        id: "especiais",
        labelPt: "Cabeças especiais",
        refIds: ["anex-abs-2065", "anex-anh-s3", "anex-3610-n", "anex-ars-2065"],
      },
    ],
  },
  {
    id: "roquetes",
    topicPt: "Roquetes e dinamos",
    jp: "ラチェット",
    questionPt: "O vaivém por ordem de batalha.",
    notePt:
      "A ordem é editorial e é séria: primeiro o nosso offset, depois o personagem principal, os pass-through e a fechar os de bits e cabeças especiais.",
    groups: [
      {
        id: "offset",
        labelPt: "1.º O nosso offset",
        refIds: ["anex-aoa-17s1", "anex-aoa-19s3", "anex-aoa-30s1", "anex-436"],
      },
      {
        id: "zyklop",
        labelPt: "2.º Wera Zyklop · o personagem principal",
        refIds: ["wera-8100-sb-6", "wera-8794-b"],
      },
      {
        id: "kleinpt",
        labelPt: "3.º Klein pass-through",
        refIds: ["klein-65408adp", "klein-65301adp", "klein-65431lp"],
      },
      {
        id: "bahcopt",
        labelPt: "4.º Bahco pass-through",
        refIds: ["bahco-808050p"],
      },
      {
        id: "bits",
        labelPt: "5.º Bits e cabeças especiais",
        refIds: [
          "anex-397-d",
          "anex-525",
          "anex-307-d",
          "anex-307-s1",
          "anex-aqh-s1",
          "vessel-td6816mg",
          "vessel-mr36",
          "vessel-900rt-7p",
          "vessel-td2100",
          "vessel-td80",
        ],
      },
    ],
  },
  {
    id: "chaves",
    topicPt: "Chaves",
    jp: "レンチ",
    questionPt: "Chaves de porca: a gama Kurokin inteira ou a ERGO sueca?",
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
        id: "bahco",
        labelPt: "BAHCO ERGO",
        refIds: ["bahco-9031p", "bahco-9033"],
      },
      {
        id: "combinadas",
        labelPt: "Combinadas",
        refIds: ["wera-joker-8-imperial"],
      },
    ],
  },
  {
    id: "soquetes",
    topicPt: "Soquetes",
    jp: "ソケット",
    questionPt: "3/8 primeiro, adaptadores depois — a melhor linha de cada marca.",
    groups: [
      {
        id: "klein",
        labelPt: "Klein 3/8″",
        refIds: ["klein-33809m", "klein-65148hd", "klein-65109impctm"],
      },
      {
        id: "wera",
        labelPt: "Wera Impaktor",
        refIds: ["wera-impaktor-deep-set"],
      },
      {
        id: "milwaukee",
        labelPt: "Milwaukee SHOCKWAVE",
        refIds: ["milwaukee-shockwave-38-packout"],
      },
      {
        id: "vessel",
        labelPt: "VESSEL GO-TAN hex 40 V",
        refIds: ["vessel-mta2010ps"],
      },
      {
        id: "anex",
        labelPt: "ANEX offset",
        refIds: ["anex-aoa-19s3", "anex-aoa-30s1"],
      },
      {
        id: "bahco12",
        labelPt: "Bahco 1/2″",
        refIds: ["bahco-ds14"],
      },
      {
        id: "knect",
        labelPt: "KNECT pass-through",
        refIds: [
          "klein-65400knect",
          "klein-65302knect",
          "klein-65408adp",
          "klein-65301adp",
          "klein-65431lp",
        ],
      },
      {
        id: "flip",
        labelPt: "Flip métrico",
        refIds: ["klein-65619", "klein-65626"],
      },
      {
        id: "universal",
        labelPt: "Universal BAHCO",
        refIds: ["bahco-s530t"],
      },
      {
        id: "adapters",
        labelPt: "Adaptadores",
        refIds: [
          "wera-8784-b1",
          "wera-8784-a1",
          "milwaukee-shockwave-adaptor-set-3pc",
          "klein-65kadpm",
        ],
      },
    ],
  },
  {
    id: "canalizacao",
    topicPt: "Canalização",
    jp: "配管",
    questionPt: "Grip, abertura e o corte rente: o dia de tubo.",
    refIds: [
      "knipex-cobra-250",
      "knipex-pliers-wrench-250",
      "anex-3980-2-100",
      "fujiya-flp-38-bg",
      "bahco-325-hacksaw",
    ],
  },
  {
    id: "eletricidade",
    topicPt: "Eletricidade · VDE",
    jp: "絶縁",
    questionPt: "A cadeia 1000 V: ponteiras, corte e chave de tubo isolada.",
    notePt:
      "VDE não precisa de impacto — mas exige bom aço e aperto certificado. EN IEC 60900 basta para 1000 V; ASTM F1505 é o equivalente aceite.",
    refIds: [
      "klein-32310ins",
      "wera-837i-ra-vde",
      "anex-azm-2698",
      "anex-azm-2100",
      "anex-azm-2150",
      "knipex-13-96-200",
      "knipex-74-06-200",
      "knipex-9804-t-socket-vde",
    ],
  },
  {
    id: "corte",
    topicPt: "Corte e alicates",
    jp: "切り",
    questionPt: "Fitas, X-atos, alicates Kurokin e o corte americano.",
    groups: [
      {
        id: "tajima",
        labelPt: "TAJIMA · medida",
        refIds: ["tajima-l25-50e1-eur", "tajima-pzb300", "tajima-cr604s", "tajima-dc660w-eur"],
      },
      {
        id: "olfa",
        labelPt: "OLFA · corte",
        refIds: ["olfa-xh-1", "olfa-l5", "olfa-sk-10"],
      },
      {
        id: "kurokin",
        labelPt: "Kurokin · corte e descarna",
        refIds: ["fujiya-760n-200bg", "fujiya-pp717a-220bg"],
      },
      {
        id: "klein",
        labelPt: "Klein · corte americano",
        refIds: ["klein-j213-9ne", "klein-11055"],
      },
    ],
  },
  {
    id: "precisao",
    topicPt: "Precisão e binário",
    jp: "精密",
    questionPt: "Bancada, eletrónica e binário controlado.",
    refIds: [
      "vessel-9836",
      "vessel-2200-ph2-100",
      "anex-6102-t",
      "anex-6103-f",
      "anex-ata-s1",
      "anex-ata-m4",
      "anex-asad-3e",
      "anex-ak20ad-635",
    ],
  },
  {
    id: "maquinas",
    topicPt: "Máquinas 18 V",
    jp: "電動",
    questionPt: "Impacto, furadeira, retificadora: o motor do sistema.",
    notePt:
      "Plataforma LXT Makita em corpo Z (baterias à parte pelo conjunto DLX). Ryobi e retificadora dedicada: EM SOURCING.",
    groups: [
      {
        id: "corpos",
        labelPt: "Corpos LXT",
        refIds: [
          "makita-dtd172z",
          "makita-dtd173z",
          "makita-dhp489z",
          "makita-dhp492z",
          "makita-dhr243z",
          "makita-dga519z",
          "makita-dgd800z",
        ],
      },
      {
        id: "conjuntos",
        labelPt: "Conjuntos c/ energia",
        refIds: ["makita-dlx2549tj", "makita-dlx2431tj", "makita-dlx3221tj", "makita-dtd172rtj"],
      },
      {
        id: "acessorios",
        labelPt: "Acessórios de máquina",
        refIds: [
          "makita-b-62000",
          "makita-b-64674",
          "makita-d-30477",
          "makita-d-78352",
          "makita-d-73483",
          "makita-bl1850b",
          "makita-dc18rc",
        ],
      },
    ],
  },
];

export function kitMakerStepById(id: string): KitMakerStep | undefined {
  return KIT_MAKER_STEPS.find((step) => step.id === id);
}
