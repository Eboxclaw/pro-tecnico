/**
 * Modular Packs, a evolução dos kits fixos: o cliente compõe o pack slot a
 * slot a partir do catálogo curado (CURATED_TOOL_REFERENCES), escolhendo a
 * marca que prefere em cada função — e marca "já tenho" onde já está coberto.
 *
 * Não há preços nestes dados: a fórmula aparece no UI como soma das partes
 * com "preço = ?", avaliada no momento. Regra editorial: cada slot é uma
 * função ("o lock", "o alcance", "as ponteiras"), nunca uma peça fixa. Todas
 * as options apontam para referências reais do catálogo, validadas por
 * tests/modular-packs.test.mjs. Quando uma peça ainda não existe no catálogo,
 * diz-se EM SOURCING no texto — nunca se inventa referência, SKU ou preço.
 */

export type ModularSlotOption = {
  /** id em CURATED_TOOL_REFERENCES, validado por tests/modular-packs.test.mjs */
  refId: string;
};

export type ModularSlot = {
  id: string;
  /** A função do slot na fórmula: "O lock", "O alcance", "As ponteiras"… */
  rolePt: string;
  /** Etiqueta japonesa curta do slot, ex.: "ロック" */
  jp: string;
  options: ModularSlotOption[];
  /** Nota honesta do slot: o que distingue as opções, o que falta. */
  notePt?: string;
};

export type ModularPack = {
  id: string;
  trade: string;
  jp: string;
  title: string;
  /** 1-2 frases: por que o pack é modular em vez de fechado. */
  conceptPt: string;
  /** Ex.: ["lock","extensão","ponteiras"] — o UI junta com + e "= ?". */
  formulaPartsPt: string[];
  slots: ModularSlot[];
  /** Com o que combina / o que dispensa. */
  pairsWithPt?: string;
  limitationsPt: string;
};

export const MODULAR_PACKS: ModularPack[] = [
  {
    id: "mod-impacto",
    trade: "Impacto & aparafusamento",
    jp: "モジュラー · impacto modular",
    title: "O pack modular de impacto: lock, alcance e ponteiras à carta",
    conceptPt:
      "Em vez do conjunto fechado de chaves repetidas em vários tamanhos, três blocos: o lock Milwaukee em 73, 152 ou 305 mm, a extensão que dá o alcance e o jogo de ponteiras misto ou dedicado — cada bloco escolhido à sua marca, sem pagar por peça que já tem.",
    formulaPartsPt: ["lock", "extensão", "ponteiras"],
    slots: [
      {
        id: "lock",
        rolePt: "O lock oficial",
        jp: "ロック",
        options: [
          { refId: "milwaukee-shockwave-lock-73" },
          { refId: "milwaukee-shockwave-lock-152" },
          { refId: "milwaukee-shockwave-lock-305" },
        ],
        notePt:
          "O anel de retenção segura a ponteira em impacto: 73 mm para o dia a dia, 152 e 305 mm para fundo de perfil e cantos profundos.",
      },
      {
        id: "extensao",
        rolePt: "O alcance",
        jp: "ヘッド",
        options: [
          { refId: "anex-alhp-100" },
          { refId: "anex-aeh-100" },
          { refId: "anex-aeh-150" },
          { refId: "anex-alhp-300" },
        ],
      },
      {
        id: "ponteiras",
        rolePt: "As ponteiras (misto ou dedicado)",
        jp: "先端",
        options: [
          { refId: "anex-art-14m-2-65" },
          { refId: "anex-abrs5-2065" },
          { refId: "anex-adrs-2065" },
          { refId: "anex-arpm-2365" },
          { refId: "milwaukee-shockwave-ph2-50" },
        ],
        notePt:
          "Só ponteiras de classe de impacto, seja de que marca for: a escola ANEX (Black Ryujin 65 mm, Diamond, duplos) contra a Milwaukee (SHOCKWAVE 50 mm com Wear Guard Tip). A VESSEL não tem linha de bits de impacto de máquina no catálogo — a série C50/C51 é impacto manual a martelo, outro produto.",
      },
    ],
    pairsWithPt:
      "Acrescenta a mala de máquinas Makita e dispensa extensões de impacto dedicadas: os bits são add-on, não repetição.",
    limitationsPt:
      "Os bits de 6,35 mm não são isolados 1000 V nem servem para aperto com binário controlado — para isso existe chave dinamométrica. E o lock resolve a retenção da ponteira em impacto, não é chave de impacto 1/2″: percussão de cruceta é máquina dedicada.",
  },
  {
    id: "mod-roquete",
    trade: "Roquetes & aperto",
    jp: "ラチェット · roquete modular",
    title: "O roquete à medida com conversor 3/8″ ↔ 1/4″",
    conceptPt:
      "A chave escolhe-se à marca: Zyklop para sockets, Quick Ball para bits, TD6816MG para levar 16 perfis no punho, 525 para trabalhar rente a paredes e caixas. O conversor 3/8″→1/4″ faz os bits do 397 trabalharem no sistema Wera — um roquete substitui a gaveta de chaves de curto.",
    formulaPartsPt: ["chave", "conversor", "ponteiras"],
    slots: [
      {
        id: "chave",
        rolePt: "A chave do vaivém",
        jp: "キー",
        options: [
          { refId: "wera-8100-sb-6" },
          { refId: "anex-397-d" },
          { refId: "vessel-td6816mg" },
          { refId: "anex-525" },
        ],
      },
      {
        id: "conversor",
        rolePt: "O conversor",
        jp: "変換",
        options: [{ refId: "wera-8784-b1" }],
        notePt:
          "O inverso 1/4→3/8 segue em sourcing com a Wera; por agora o conversor leva os bits ao sistema 3/8″.",
      },
      {
        id: "ponteiras",
        rolePt: "As ponteiras",
        jp: "先端",
        options: [
          { refId: "anex-art-14m-2-65" },
          { refId: "vessel-tx11" },
          { refId: "vessel-tdbs21" },
        ],
      },
    ],
    pairsWithPt:
      "Com o pack modular de impacto forma o sistema completo: roquete, conversor, lock, extensão e ponteiras.",
    limitationsPt:
      "Aperto manual apenas: nenhum destes roquetes dá binário calibrado nem aguenta percussão — para impacto existe o pack modular de impacto.",
  },
  {
    id: "mod-canalizacao",
    trade: "Canalização",
    jp: "配管 · canalização modular",
    title: "O duo de canalização: uma BAHCO, uma Cobra KNIPEX",
    conceptPt:
      "O mínimo honesto do ofício: uma ajustável BAHCO escolhida pela abertura do dia e um grip KNIPEX que agarra o redondo sem o marcar. Duas peças, duas marcas europeias, zero redundância.",
    formulaPartsPt: ["ajustável", "grip"],
    slots: [
      {
        id: "ajustavel",
        rolePt: "A ajustável",
        jp: "レンチ",
        options: [{ refId: "bahco-9031p" }, { refId: "bahco-9033" }],
        notePt:
          "9031P até 39 mm (1¼″); 9033 extra-larga até 46 mm para uniões antigas acima de 1″.",
      },
      {
        id: "grip",
        rolePt: "O grip",
        jp: "グリップ",
        options: [{ refId: "knipex-cobra-250" }, { refId: "knipex-pliers-wrench-250" }],
        notePt:
          "Cobra para tubo e redondo; Pliers Wrench para fittings cromados apertados como chave fixa.",
      },
    ],
    pairsWithPt:
      "Acrescenta o Wanidora e o serrote pela mala canalização quando há parafuso morto ou corte rente.",
    limitationsPt:
      "A abertura para em 46 mm: acima disso é chave de tubos dedicada (EM SOURCING). Nem a ajustável nem o grip substituem o alicate de tubos em curvas apertadas.",
  },
  {
    id: "mod-vde",
    trade: "Eletricidade · VDE",
    jp: "絶縁 · VDE modular",
    title: "O VDE à medida: ponteiras e chaves 1000 V, com ou sem roquete",
    conceptPt:
      "Cada peça isolada é uma ferramenta completa certificada IEC 60900: escolhe-se a ponteira AZM pelo perfil e pelo comprimento isolado, a chave completa pelo aperto e o alicate de corte sempre VDE. O comprimento isolado substitui a extensão — a extensão isolada 1000 V segue em sourcing.",
    formulaPartsPt: ["ponteira VDE", "chave VDE", "corte VDE"],
    slots: [
      {
        id: "ponteira",
        rolePt: "A ponteira isolada",
        jp: "先端",
        options: [
          { refId: "anex-azm-2698" },
          { refId: "anex-azm-1598" },
          { refId: "anex-azm-2100" },
          { refId: "anex-azm-2150" },
        ],
      },
      {
        id: "chave",
        rolePt: "A chave completa 1000 V",
        jp: "キー",
        options: [
          { refId: "vessel-960-ph2-100" },
          { refId: "vessel-200-ph2-100" },
          { refId: "anex-7920" },
        ],
      },
      {
        id: "corte",
        rolePt: "O corte VDE",
        jp: "カット",
        options: [{ refId: "knipex-74-06-200" }, { refId: "knipex-13-96-200" }],
      },
    ],
    pairsWithPt:
      "Com o desligamento confirmado, a mala de máquinas Makita entra pela mala eletricidade VDE.",
    limitationsPt:
      'Não há roquete VDE certificado no catálogo (EM SOURCING): por isso "sem roquete" é a opção honesta, e bits AZM em porta-bits comum não são ferramenta certificada sob tensão. Tensão confirmada a zero antes de qualquer intervenção — o isolamento 1000 V não dispensa o procedimento.',
  },
];

export function modularPackById(id: string): ModularPack | undefined {
  return MODULAR_PACKS.find((pack) => pack.id === id);
}
