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
    title: "Monta o teu 397 Lock REJENDARI: é sempre 397, cada coisa no seu tópico",
    conceptPt:
      "O construtor do sistema 397 Lock: o porta-bits lock escolhe-se pequeno, médio ou grande — impacto, VDE, precision ou isolado — as ponteiras por categoria com o pack múltiplo e o pack PH2 em qualidade S ou S+, a extensão nos três níveis, o roquete de bits ou offset, e o adaptador que já vem com o kit Zyklop 3/8.",
    formulaPartsPt: ["porta-bits lock", "ponteiras", "extensão", "roquete", "adaptador"],
    slots: [
      {
        id: "lock",
        rolePt: "O porta-bits lock: pequeno · médio · grande",
        jp: "ロック",
        options: [
          { refId: "milwaukee-shockwave-lock-73" },
          { refId: "milwaukee-shockwave-lock-152" },
          { refId: "milwaukee-shockwave-lock-305" },
        ],
        notePt:
          "Categoria IMPACTO, um dos lock bits da marca disponível: pequeno 73 mm, médio 152 mm, grande 305 mm — o anel trava o bit em impacto. Nas outras categorias não há lock holder disponível: VDE/isolado e precision seguem EM SOURCING (no lado elétrico, o porta-bits isolado com roquete 837 i RA vive no builder VDE).",
      },
      {
        id: "ponteiras",
        rolePt: "As ponteiras: impacto, VDE ou isoladas · pack múltiplo ou PH2",
        jp: "先端",
        options: [
          { refId: "anex-525-28b" },
          { refId: "anex-abrs5-2065" },
          { refId: "anex-abrs5-01" },
          { refId: "anex-adrs-2065" },
          { refId: "milwaukee-shockwave-ph2-50" },
          { refId: "anex-azm-2698" },
        ],
        notePt:
          "Pack múltiplo: o 525-28B cobre PH, Torx, hex e soquetes num estojo. Pack PH2 qualidade S: Black Ryujin slim ×5 e o assorted 65/85/110; qualidade S+: Diamond Ryujin, o aperto que não escorrega. Impacto Milwaukee: SHOCKWAVE com Wear Guard Tip. VDE/isoladas: o AZM duplo +2/−6 isolado 1000 V — as restantes AZM vivem no builder VDE. Ryujin standard nunca entra.",
      },
      {
        id: "extensao",
        rolePt: "As extensões: conjuntos por marca — curta 100 · média 150 · longa 300",
        jp: "ヘッド",
        options: [
          { refId: "anex-alhp-100" },
          { refId: "anex-alhp-150" },
          { refId: "anex-alhp-300" },
          { refId: "vessel-exh-100" },
          { refId: "vessel-exh-150" },
          { refId: "vessel-dxh-350" },
          { refId: "klein-32791" },
          { refId: "klein-31088" },
          { refId: "klein-31089" },
        ],
        notePt:
          "Categoria IMPACTO, três conjuntos completos: ANEX ALHP heavy-duty (100/150/300, uma só linha), VESSEL Slim Long compatível 40 V (EXH 100/150, DXH 350 no nível grande) e Klein Dual-Lock (4″/6″/12″ com retenção nas duas pontas). Milwaukee não faz extensão não-locking — a extensão deles é a própria linha lock 73/152/305, no slot de cima. Categoria VDE/isolado: não existe em nenhuma marca (EM SOURCING) — no lado elétrico, o isolamento é o comprimento do próprio bit AZM.",
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
        options: [
          { refId: "wera-8784-b1" },
          { refId: "wera-8784-a1" },
          { refId: "milwaukee-shockwave-adaptor-set-3pc" },
        ],
        notePt:
          "Para um lado: a redução 3/8″→1/4″ (8784 B1) já vem no nosso kit Zyklop 3/8 — avulsa só fora da mala; o 8784 A1 faz o mesmo no quadrado 1/4″. Para o outro: o set SHOCKWAVE é a fêmea porta-soquete em impacto — o hex 1/4″ do 397 ou do lock vira quadrado 1/4″, 3/8″ ou 1/2″ (até 226 N·m, íman). O mesmo bit trabalha no lock, na Zyklop e nos sockets: adaptar e estender, nunca segunda chave. Nota verificada: Wera não faz hex→quadrado; ANEX e VESSEL não têm adaptador direto.",
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
        options: [
          { refId: "knipex-8726250-cobra-vde" },
          { refId: "knipex-8606250-pliers-wrench-vde" },
        ],
        notePt:
          "O conjunto Knipex VDE completo: a Cobra isolada (IEC 60900) para o redondo e o Pliers Wrench isolado para apertar fittings cromados como chave fixa — com o corte VDE do slot acima, o quarteto certificado fecha.",
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
