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
          { refId: "anex-abrs5-2065" },
          { refId: "anex-adrs-2065" },
          { refId: "anex-abrs5-01" },
          { refId: "milwaukee-shockwave-ph2-50" },
        ],
        notePt:
          "Política da casa: só ponteiras de classe de impacto e só as linhas aprovadas — Black Ryujin (Cr-Mo-V), Diamond Ryujin (o aperto que escorrega) e a SHOCKWAVE Milwaukee (Wear Guard Tip). Ryujin standard não entra. A VESSEL não tem bits de impacto de máquina: a série C50/C51 é impacto manual a martelo, outro produto.",
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
          { refId: "wera-8000a-zyklop-14" },
          { refId: "anex-397-d" },
          { refId: "vessel-td6816mg" },
          { refId: "anex-525" },
          { refId: "klein-32305" },
          { refId: "bahco-808050p" },
        ],
        notePt:
          "Três escolas de vaivém: Zyklop 3/8″ e 1/4″ para sockets, os roquetes japoneses para bits, e os roquetes de fendas americano (Klein 15-em-1) e sueco (Bahco pistola) para a variedade de perfis.",
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
        options: [{ refId: "anex-525-9t" }, { refId: "vessel-tx11" }, { refId: "vessel-tdbs21" }],
        notePt:
          "O misto ANEX 525-9T (PH2 + Torx T8-T40 num pack) contra os dedicados VESSEL: o estojo Torx ordenado ou as ultra-curtas rente ao painel.",
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
        options: [
          { refId: "bahco-9031p" },
          { refId: "bahco-9033" },
          { refId: "fujiya-fls-32-bg" },
          { refId: "fujiya-fgl-38-bg" },
        ],
        notePt:
          "9031P até 39 mm (1¼″); 9033 extra-larga até 46 mm. A escola japonesa: a Kurokin Light Short de 139 mm para o bolso e a Gear 3-em-1 que substitui ajustável + roquete 17 mm + bocas fixas 10/13.",
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
      "Cada peça isolada é uma ferramenta completa certificada IEC 60900: o bit isolado AZM trava no porta-bits isolado — manual ou com roquete — em vez de chaves simples; o corte e o grip são sempre VDE. O comprimento isolado substitui a extensão — a extensão isolada 1000 V segue EM SOURCING.",
    formulaPartsPt: ["ponteira VDE", "porta-bits 1000 V", "corte VDE", "grip VDE"],
    slots: [
      {
        id: "ponteira",
        rolePt: "A ponteira isolada (1000 V)",
        jp: "先端",
        options: [
          { refId: "anex-azm-2698" },
          { refId: "anex-azm-1598" },
          { refId: "anex-azm-2100" },
          { refId: "anex-azm-2150" },
        ],
        notePt:
          "Bits isolados 1000 V, ensaio a 10 kV: o comprimento isolado (100 e 150 mm) substitui a extensão, porque extensão isolada não existe no catálogo (EM SOURCING).",
      },
      {
        id: "chave",
        rolePt: "O porta-bits isolado (manual ou roquete)",
        jp: "ホルダー",
        options: [
          { refId: "wera-837i-ra-vde" },
          { refId: "wera-817-vde" },
          { refId: "klein-32310ins" },
          { refId: "klein-32604ins" },
        ],
        notePt:
          "Sem chaves simples: sempre lógica porta-bits com bits isolados 6,35 mm — o roquete isolado Wera 837 i RA (IEC 60900), o manual 817 VDE, ou os auto-lock Klein com pontas isoladas de substituição (ASTM F1505). Chaves de lâmina fixa ficam na mala eletricidade VDE, fora deste builder.",
      },
      {
        id: "corte",
        rolePt: "O corte VDE",
        jp: "カット",
        options: [{ refId: "knipex-74-06-200" }, { refId: "knipex-13-96-200" }],
      },
      {
        id: "grip",
        rolePt: "O grip isolado",
        jp: "グリップ",
        options: [{ refId: "knipex-8726250-cobra-vde" }],
        notePt:
          "A Cobra certificada 1000 V (IEC 60900): o grip auto-bloqueante que pode tocar o quadro — 24 posições, porcas até 46 mm, tubos até Ø50 mm.",
      },
    ],
    pairsWithPt:
      "Com o desligamento confirmado, a mala de máquinas Makita entra pela mala eletricidade VDE.",
    limitationsPt:
      'Não há roquete VDE certificado no catálogo (EM SOURCING): por isso "sem roquete" é a opção honesta, e bits AZM em porta-bits comum não são ferramenta certificada sob tensão. Sockets isolados não existem na Milwaukee nem na Klein — o isolamento de sockets segue EM SOURCING. Kurokin não certifica VDE: a linha fica de fora deste pack. Tensão confirmada a zero antes de qualquer intervenção — o isolamento 1000 V não dispensa o procedimento.',
  },
];

export function modularPackById(id: string): ModularPack | undefined {
  return MODULAR_PACKS.find((pack) => pack.id === id);
}
