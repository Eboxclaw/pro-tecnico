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
    trade: "Monta o teu · 397 Lock",
    jp: "組む · 397 lock",
    title: "Monta o teu 397 Lock REJENDARI: lock, ponteiras, extensão, roquete e adaptador",
    conceptPt:
      "O construtor do sistema 397 Lock: o porta-bits de preferência LOCK (SHOCKWAVE 73/152/305), ponteiras só Black e Diamond Ryujin ou SHOCKWAVE, extensões por marca nos três níveis (curta 100, média 150, longa 300), o roquete de bits ou offset à escolha, e os adaptadores inteligentes 3/8↔1/4 que fazem tudo trabalhar com tudo.",
    formulaPartsPt: ["porta-bits lock", "ponteiras", "extensão", "roquete", "adaptador"],
    slots: [
      {
        id: "lock",
        rolePt: "O porta-bits (de preferência lock)",
        jp: "ロック",
        options: [
          { refId: "milwaukee-shockwave-lock-73" },
          { refId: "milwaukee-shockwave-lock-152" },
          { refId: "milwaukee-shockwave-lock-305" },
        ],
        notePt:
          "Porta-bits com anel de retenção LOCK — o bit trava e não cai: 73 mm para o dia a dia, 152 e 305 mm para fundo de perfil e cantos profundos. Não há porta-bits lock equivalente em ANEX ou VESSEL (EM SOURCING): os SHOCKWAVE são a categoria.",
      },
      {
        id: "ponteiras",
        rolePt: "As ponteiras (impacto primeiro)",
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
      {
        id: "extensao",
        rolePt: "As extensões: curta 100 · média 150 · longa 300",
        jp: "ヘッド",
        options: [
          { refId: "anex-alhp-100" },
          { refId: "anex-aeh-150" },
          { refId: "anex-alhp-300" },
        ],
        notePt:
          "Extensões por marca e categoria, nos mesmos três níveis dos locks: impacto hoje pela linha ANEX (ALHP heavy-duty 100 e 300, AEH média 150). Categoria VDE isolado não existe em nenhuma marca (EM SOURCING) — no lado elétrico, o isolamento é o comprimento do próprio bit AZM. Outras marcas de extensão de impacto: EM SOURCING até homologação.",
      },
      {
        id: "roquete",
        rolePt: "O roquete (de bits ou offset)",
        jp: "ラチェット",
        options: [
          { refId: "anex-397-d" },
          { refId: "anex-525" },
          { refId: "klein-32305" },
          { refId: "bahco-808050p" },
          { refId: "anex-436" },
          { refId: "anex-aoa-17s1" },
        ],
        notePt:
          "Roquete de bits: o Quick Ball 72 é o movimento da casa, o Compact 52 entra rente a paredes, o Klein 15-em-1 e o Bahco pistola cobrem a variedade americana e sueca. Roquete offset: o 436 de cabeça baixa aperta por baixo de superfícies e o AOA-17 com sockets H8-H21 chega aos 230 N·m onde a máquina não cabe.",
      },
      {
        id: "adaptador",
        rolePt: "Os adaptadores inteligentes",
        jp: "変換",
        options: [{ refId: "wera-8784-b1" }],
        notePt:
          "A redução 3/8″→1/4″ leva os bits do 397 ao sistema de sockets — o mesmo bit trabalha no lock e na Zyklop. O inverso 1/4→3/8 e a fêmea porta-soquete (quadrado para porta-bits) seguem EM SOURCING: só entram com ref oficial homologada.",
      },
    ],
    pairsWithPt:
      "Acrescenta a mala de máquinas Makita e dispensa extensões de impacto dedicadas: os bits são add-on, não repetição. Os perfis manuais (Torx, hex, fenda) ficam cobertos pelo kit misto ANEX 525.",
    limitationsPt:
      "Os bits de 6,35 mm não são isolados 1000 V nem servem para aperto com binário controlado — para isso existe o builder VDE e a chave dinamométrica. O lock resolve a retenção da ponteira em impacto, não é chave de impacto 1/2″: percussão de cruceta é máquina dedicada.",
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
