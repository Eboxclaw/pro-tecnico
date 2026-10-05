import { referenceById, type CuratedToolReference } from "@/data/curated-tool-references";

/**
 * Curated Tool Systems, o produto REJENDARI.
 *
 * O catálogo de systems vive em código (transparente, versionado e auditável);
 * a procura real (likes, favoritos, reservas) vive no Supabase
 * (ver supabase/migrations …_rejendari_systems_demand.sql) e soma-se aos
 * Os contadores do site mostram apenas procura real (likes, favoritos e
 * reservas de utilizadores autenticados). Sem números inflados: se ainda não
 * há procura, o site diz "sê o primeiro".
 *
 * Regra editorial: uma peça só entra se resolve um problema adicional
 * ("Que problema adicional esta peça resolve?"). Todas as peças apontam para
 * referências reais do catálogo, nada de compatibilidade inventada.
 */

export type SystemStatus = "available" | "reserving" | "negotiating" | "lab" | "sold_through";

/** Rótulos de estado visíveis (EN como marca, PT no copy de suporte). */
export const SYSTEM_STATUS_LABEL: Record<SystemStatus, string> = {
  available: "IN STOCK",
  reserving: "RESERVING",
  negotiating: "NEGOTIATING MOQ",
  lab: "LAB",
  sold_through: "SOLD THROUGH",
};

export type ModuleRole =
  "MANUAL" | "LOCK" | "IMPACT" | "REACH" | "FASTENERS" | "DRIVE" | "CONTROL" | "REPAIR";

export type SystemPiece = {
  /** id em CURATED_TOOL_REFERENCES, validado por tests/systems.test.mjs */
  refId: string;
  qty?: number;
  whyPt: string;
};

export type SystemModule = {
  role: ModuleRole;
  title: string;
  pieces: SystemPiece[];
  /** Componentes ainda em sourcing, nunca inventar referência. */
  pendingPt?: string[];
  /** Selo IMPACT READY: só quando tecnicamente documentado. */
  impactReady?: boolean;
};

export type PerfectMatch = {
  targetId: string;
  reasonPt: string;
};

export type RejendariSystem = {
  id: string;
  kind: "system" | "module";
  featured?: boolean;
  name: string;
  jp: string;
  taglinePt: string;
  status: SystemStatus;
  /** Preço-alvo durante a negociação, nunca um preço final disfarçado. */
  targetPriceEur?: { min: number; max: number };
  targetMoq?: number;
  /** 2-3 capacidades principais para o card (nada de parede de texto). */
  capabilitiesPt: string[];
  /** Referência usada como visual do card (product-plate). */
  imageRefId?: string;
  /** Componente âncora para o bloco de transparência. */
  leadRefId?: string;
  modules: SystemModule[];
  perfectMatches?: PerfectMatch[];
};

export const RESERVE_PROFESSIONS = [
  "AVAC",
  "Eletricidade",
  "Canalização",
  "Mecânica",
  "Solar",
  "Eletrónica",
  "Automóvel",
  "Carpintaria",
  "DIY / Outro",
] as const;

export type ReserveProfession = (typeof RESERVE_PROFESSIONS)[number];

export const REJENDARI_SYSTEMS: RejendariSystem[] = [
  {
    id: "397-lock-system",
    kind: "system",
    featured: true,
    name: "397 LOCK SYSTEM",
    jp: "ロックシステム",
    taglinePt:
      "ANEX 397 + pack de 5 bits PH2 (65/85/110 mm) + Diamond Ryujin + o bit-lock que dá o nome + extensor de impacto. O primeiro drop REJENDARI: reservas abertas, €0 para reservar.",
    status: "reserving",
    targetPriceEur: { min: 89, max: 99 },
    targetMoq: 100,
    capabilitiesPt: ["72T · 25 N·m", "PH2 65-110 mm · 5 bits", "Locked by Rapidaptor"],
    imageRefId: "anex-397-d",
    leadRefId: "anex-397-d",
    modules: [
      {
        role: "MANUAL",
        title: "ANEX 397",
        pieces: [
          {
            refId: "anex-397-d",
            whyPt:
              "A base do sistema: 72 dentes, avanço com os dedos e aperto final até 25 N·m sem mudar de ferramenta.",
          },
        ],
      },
      {
        role: "LOCK",
        title: "Bit-lock · Rapidaptor",
        pieces: [
          {
            refId: "wera-889-4-1-k",
            whyPt:
              "É o lock que dá o nome ao system: o Rapidaptor 889/4/1 K trava o bit ao 397 por pressão, com manga de rotação livre, punho, lock, bits e extensor passam a trabalhar como uma só peça, com troca a uma mão. Para impacto contínuo, a variante certificada da Wera está em avaliação.",
          },
        ],
      },

      {
        role: "IMPACT",
        title: "Bits PH2 · 65 mm",
        impactReady: true,
        pieces: [
          {
            refId: "anex-art-14m-2-65",
            whyPt:
              "A reposição de dez PH2×65: um comprimento chega para o dia; o alcance vem das extensões, não de mais bits.",
          },
          {
            refId: "anex-adrs-2065",
            whyPt:
              "Diamond Ryujin slim PH2×65: partículas de diamante retêm o parafuso sem íman, inox, latão, alumínio e plástico, com zona torsional para impacto.",
          },
          {
            refId: "anex-adsk-2065",
            whyPt:
              "Diamond Saikou PH2×65: a haste escalonada de 3,8 mm chega ao ponto de aperto estreito onde o bit cilíndrico não passa.",
          },
        ],
        pendingPt: [
          "PH1, perfil prioritário em negociação com a ANEX. Entra no drop assim que a referência impact-ready for confirmada; não inventamos compatibilidade.",
        ],
      },
      {
        role: "REACH",
        title: "Extensões",
        impactReady: true,
        pieces: [
          {
            refId: "anex-aeh-100",
            whyPt:
              "Extensor de bits de 100 mm especificado para 18 V/40 V: o impacto chega ao fundo do perfil sem mudar de máquina.",
          },
          {
            refId: "anex-alhp-100",
            whyPt:
              "O heavy-duty que aceita bits, socket bits e serras de coroa, com veio substituível: impacto 40 V/18 V sem poupar o material.",
          },
        ],
      },
    ],
    perfectMatches: [
      {
        targetId: "ph-work-pack",
        reasonPt: "A reposição PH2 Black para o trabalho que não exige diamante.",
      },
      { targetId: "torx-complete", reasonPt: "Completar os perfis Torx com um módulo dedicado." },
      { targetId: "drive-system", reasonPt: "Subir para sockets 3/8″ quando o trabalho cresce." },
    ],
  },
  {
    id: "397-system",
    kind: "system",
    name: "REJENDARI 397 SYSTEM",
    jp: "397システム",
    taglinePt:
      "O sistema completo à volta do ANEX 397: manual, impacto, perfis e alcance, cada módulo adicionado porque desbloqueia trabalho novo.",
    status: "reserving",
    targetPriceEur: { min: 119, max: 149 },
    targetMoq: 100,
    capabilitiesPt: ["ANEX 397 · 72T", "Bits impacto Ryujin", "Torx + Hex + Reach"],
    imageRefId: "anex-397-d",
    leadRefId: "anex-397-d",
    modules: [
      {
        role: "MANUAL",
        title: "ANEX 397",
        pieces: [
          {
            refId: "anex-397-d",
            whyPt:
              "O pequeno aperto: precisão, mobilidade e bits 1/4″ como linguagem comum do sistema.",
          },
        ],
      },
      {
        role: "IMPACT",
        title: "PH system",
        impactReady: true,
        pieces: [
          {
            refId: "anex-art-14m-2-65",
            whyPt:
              "PH2×65 em caixa de dez: um comprimento chega, o alcance vem da extensão 100 mm.",
          },
          {
            refId: "anex-arpm-2365",
            whyPt: "Bit duplo +2/+3: metade das trocas na bancada.",
          },
        ],
      },
      {
        role: "FASTENERS",
        title: "Torx + Hex",
        pieces: [
          {
            refId: "vessel-tx11",
            whyPt: "A gama Torx T8H-T40H reunida num único estojo de baixo perfil.",
          },
          {
            refId: "vessel-tdbs22",
            whyPt: "Hex H2.5-H6 em bits ultra-curtos de 18 mm: allen sem espalhar chaves.",
          },
        ],
      },
      {
        role: "REACH",
        title: "Reach",
        impactReady: true,
        pieces: [
          {
            refId: "anex-aeh-100",
            whyPt: "+100 mm de alcance para o fundo de perfis e cantos, sem mudar de máquina.",
          },
        ],
      },
      {
        role: "LOCK",
        title: "Mechanical bit-lock",
        pieces: [],
        pendingPt: ["Holder mecânico em sourcing, o mesmo componente do 397 LOCK SYSTEM."],
      },
    ],
    perfectMatches: [
      { targetId: "ph-work-pack", reasonPt: "A reposição PH2 que mantém o sistema a trabalhar." },
      { targetId: "hex-complete", reasonPt: "Fechar a gama hex até H8 e além." },
      {
        targetId: "drive-system",
        reasonPt: "O nível seguinte: sockets 3/8″ com a Wera Zyklop Speed.",
      },
      {
        targetId: "drywall-module",
        reasonPt: "Especializar o sistema em gesso cartonado com catch & stop.",
      },
    ],
  },
  {
    id: "drive-system",
    kind: "system",
    name: "DRIVE SYSTEM 3/8″",
    jp: "ドライブシステム",
    taglinePt:
      "Construído à volta da Wera Zyklop Speed 3/8″: sockets métricos, extensões e a ponte para o universo de bits 1/4″.",
    status: "negotiating",
    targetPriceEur: { min: 159, max: 189 },
    targetMoq: 60,
    capabilitiesPt: ["Zyklop Speed · 72T", "Sockets 8-19 mm", "Ponte 3/8″ → 1/4″"],
    imageRefId: "wera-8100-sb-6",
    leadRefId: "wera-8100-sb-6",
    modules: [
      {
        role: "DRIVE",
        title: "Wera Zyklop Speed 3/8″",
        pieces: [
          {
            refId: "wera-8100-sb-6",
            whyPt:
              "A catraca de 72 dentes com manga de rotação livre: o volante gira como um berbequim manual.",
          },
        ],
      },
      {
        role: "DRIVE",
        title: "Ponte para bits 1/4″",
        pieces: [
          {
            refId: "wera-8784-b1",
            whyPt:
              "Adaptador 3/8″ → hex 1/4″: os bits do sistema 397 passam a trabalhar na Zyklop.",
          },
          {
            refId: "anex-asad-3e",
            whyPt: "No sentido inverso: sockets 3/8″ acionados pela máquina de bits 1/4″.",
          },
        ],
      },
      {
        role: "REACH",
        title: "Reach",
        pieces: [
          {
            refId: "wera-8794-b",
            whyPt: "Extensão wobble de 76 mm para fixações em ângulo.",
          },
        ],
      },
    ],
    perfectMatches: [
      {
        targetId: "397-system",
        reasonPt:
          "A camada de precisão que o drive não substitui, sobe de sistema sem recomprar bits.",
      },
      { targetId: "ph-work-pack", reasonPt: "Os mesmos bits servem a ponte 3/8″ → 1/4″." },
      {
        targetId: "hvac-system",
        reasonPt: "Porta-porcas e wobble completam o trabalho de chapa e conduta.",
      },
    ],
  },
  {
    id: "hvac-system",
    kind: "system",
    name: "HVAC SYSTEM",
    jp: "空調システム",
    taglinePt:
      "Em estudo: porta-porcas magnéticos, extensões wobble e PH2 de impacto para condutas, chapa e equipamento de climatização.",
    status: "lab",
    capabilitiesPt: ["Porta-porcas 7-13 mm", "Wobble 3/8″", "PH2 impacto"],
    imageRefId: "porta-porcas-magneticos-1-4",
    leadRefId: "porta-porcas-magneticos-1-4",
    modules: [
      {
        role: "FASTENERS",
        title: "Porta-porcas 7-13 mm",
        pieces: [
          {
            refId: "porta-porcas-magneticos-1-4",
            whyPt:
              "A porca fica na ponta em montagem suspensa: sem peças perdidas dentro do troço.",
          },
        ],
      },
      {
        role: "REACH",
        title: "Reach",
        pieces: [
          {
            refId: "wera-8794-b",
            whyPt: "Wobble 3/8″ para o parafuso que está sempre a 15° do acesso reto.",
          },
        ],
      },
      {
        role: "IMPACT",
        title: "PH2 impacto",
        impactReady: true,
        pieces: [
          {
            refId: "anex-art-14m-2-65",
            whyPt:
              "Chapa e suportes comem PH2×65: a caixa de dez cobre o perfil pela linha Ryujin.",
          },
        ],
      },
    ],
    perfectMatches: [
      { targetId: "drive-system", reasonPt: "O drive 3/8″ é a base natural deste system." },
      { targetId: "reach-module", reasonPt: "Condutas fundas pedem os +100 mm." },
    ],
  },
  {
    id: "precision-system",
    kind: "system",
    name: "PRECISION SYSTEM",
    jp: "精密システム",
    taglinePt:
      "Em estudo: acesso difícil, extração de precisão e hex ultra-curto para bancada, eletrónica e equipamento compacto.",
    status: "lab",
    capabilitiesPt: ["Acesso difícil", "Extração M1-M2,6", "Hex H2.5-H6"],
    imageRefId: "anex-6102-t",
    leadRefId: "anex-6102-t",
    modules: [
      {
        role: "MANUAL",
        title: "Acesso difícil",
        pieces: [
          {
            refId: "anex-6102-t",
            whyPt: "Três offset finas para o parafuso que um punho normal não alcança.",
          },
        ],
      },
      {
        role: "FASTENERS",
        title: "Hex curto",
        pieces: [
          {
            refId: "vessel-tdbs22",
            whyPt: "H2.5-H6 em 18 mm: allen dentro de cavidades.",
          },
        ],
      },
      {
        role: "REPAIR",
        title: "Extração de precisão",
        pieces: [
          {
            refId: "anex-3610-n",
            whyPt: "Recuperar parafusos +0 danificados de M1 a M2,6 na bancada.",
          },
        ],
      },
    ],
    perfectMatches: [
      { targetId: "hex-complete", reasonPt: "A gama hex completa entra aqui por direito." },
      { targetId: "diamond-upgrade", reasonPt: "Retenção em inox, latão e plástico sem íman." },
    ],
  },
  {
    id: "ph-work-pack",
    kind: "module",
    name: "PH WORK PACK",
    jp: "PHワーク",
    taglinePt:
      "PH2 Black Ryujin como consumível: a caixa de 10 para reposição, os três comprimentos e o slim para acesso estreito.",
    status: "reserving",
    targetPriceEur: { min: 29, max: 39 },
    targetMoq: 150,
    capabilitiesPt: ["PH2 · 65 mm", "Impact Cr-Mo-V", "Reposição ×10"],
    imageRefId: "anex-art-14m-2-65",
    leadRefId: "anex-art-14m-2-65",
    modules: [
      {
        role: "IMPACT",
        title: "PH2 · só impacto",
        impactReady: true,
        pieces: [
          {
            refId: "anex-art-14m-2-65",
            whyPt: "A caixa de 10 é a unidade de reposição de quem aperta PH2 o dia todo.",
          },
          {
            refId: "anex-ryujin-slim",
            whyPt: "A dupla ponta slim entra no furo embutido onde o bit normal fica pelo caminho.",
          },
          {
            refId: "anex-arpm-2365",
            whyPt: "+2/+3 no mesmo bit para bancada e montagem.",
          },
        ],
        pendingPt: [
          "PH1 de impacto, perfil prioritário em negociação com a ANEX. Entra no pack assim que a referência impact-ready for confirmada.",
          "Alcance: extensões AEH de 100/150 mm à parte, em vez de bits de 85/110 mm.",
        ],
      },
    ],
    perfectMatches: [
      { targetId: "397-lock-system", reasonPt: "O drop que dá punho e lock a estes bits." },
      { targetId: "drive-system", reasonPt: "A ponte 3/8″ → 1/4″ aproveita os mesmos bits." },
      {
        targetId: "diamond-upgrade",
        reasonPt: "O upgrade natural quando o aperto passa para inox e plástico.",
      },
    ],
  },
  {
    id: "torx-complete",
    kind: "module",
    name: "TORX COMPLETE",
    jp: "トルクス完全版",
    taglinePt: "A gama Torx como um módulo único, não como T20 avulsos espalhados pela mala.",
    status: "negotiating",
    targetPriceEur: { min: 25, max: 35 },
    targetMoq: 80,
    capabilitiesPt: ["T8H-T40H", "Módulo único", "Low-profile"],
    imageRefId: "vessel-tx11",
    leadRefId: "vessel-tx11",
    modules: [
      {
        role: "FASTENERS",
        title: "Torx T8H-T40H",
        pieces: [
          {
            refId: "vessel-tx11",
            whyPt:
              "Cobre a gama Torx de segurança num único estojo de baixo perfil, a versão atual do módulo.",
          },
        ],
        pendingPt: [
          "A montar com referências de impacto assim que o fabricante confirmar a gama T10-T40 em bits de 25 mm. Sem compatibilidade inventada: o selo IMPACT READY só entra quando estiver documentado.",
        ],
      },
    ],
    perfectMatches: [
      { targetId: "397-system", reasonPt: "Fechar os perfis do sistema 397." },
      { targetId: "precision-system", reasonPt: "Equipamento e quadros vivem de Torx." },
    ],
  },
  {
    id: "hex-complete",
    kind: "module",
    name: "HEX COMPLETE",
    jp: "ヘキサ完全版",
    taglinePt: "Allen como sistema: do H2.5 ao H8 sem espalhar chaves avulsas pela caixa.",
    status: "negotiating",
    targetPriceEur: { min: 19, max: 29 },
    targetMoq: 80,
    capabilitiesPt: ["H2.5-H8", "Bits ultra-curtos", "Offset manual"],
    imageRefId: "vessel-tdbs22",
    leadRefId: "vessel-tdbs22",
    modules: [
      {
        role: "FASTENERS",
        title: "Hex H2.5-H8",
        pieces: [
          {
            refId: "vessel-tdbs22",
            whyPt: "Cinco hex ultra-curtos de 18 mm para máquina: a base do módulo.",
          },
          {
            refId: "anex-6103-f",
            whyPt: "As offset H2.5-H5 resolvem o allen fundo que nenhum bit alcança.",
          },
        ],
        pendingPt: ["H10 e versão impact-ready da gama completa, em validação com fabricantes."],
      },
    ],
    perfectMatches: [
      { targetId: "precision-system", reasonPt: "A bancada é o habitat natural deste módulo." },
      { targetId: "397-system", reasonPt: "Mais um perfil fechado dentro da linguagem 1/4″." },
    ],
  },
  {
    id: "lock-module",
    kind: "module",
    name: "LOCK MODULE",
    jp: "ロックモジュール",
    taglinePt:
      "Holder mecânico com trava de bit: o bit fica preso ao punho, sem botões nem folgas.",
    status: "negotiating",
    targetPriceEur: { min: 15, max: 25 },
    targetMoq: 100,
    capabilitiesPt: ["Trava mecânica", "Bits 1/4″", "Compatível 397"],
    imageRefId: "anex-397-h",
    leadRefId: "anex-397-h",
    modules: [
      {
        role: "LOCK",
        title: "Bit-lock · Rapidaptor",
        pieces: [
          {
            refId: "wera-889-4-1-k",
            whyPt:
              "Rapidaptor 889/4/1 K, a geração atual: bit engata por pressão, manga roda livre, troca a uma mão, o bit-lock que funciona com o punho 397.",
          },
        ],
        pendingPt: [
          "Para impacto contínuo, a variante Rapidaptor certificada para impacto está em avaliação com a Wera. O selo IMPACT READY só entra quando estiver documentado.",
        ],
      },
    ],
    perfectMatches: [
      { targetId: "397-lock-system", reasonPt: "É literalmente o módulo LOCK do drop." },
      { targetId: "ph-work-pack", reasonPt: "Bit travado ao punho é bit que não se perde." },
    ],
  },
  {
    id: "reach-module",
    kind: "module",
    name: "REACH MODULE",
    jp: "リーチモジュール",
    taglinePt:
      "+100 mm de alcance e retenção magnética: chegar ao fundo do perfil sem mudar de máquina.",
    status: "reserving",
    targetPriceEur: { min: 19, max: 29 },
    targetMoq: 120,
    capabilitiesPt: ["+100 mm", "Impact ready", "Neji-catch"],
    imageRefId: "anex-aeh-100",
    leadRefId: "anex-aeh-100",
    modules: [
      {
        role: "REACH",
        title: "Extensão + retenção",
        impactReady: true,
        pieces: [
          {
            refId: "anex-aeh-100",
            whyPt:
              "A extensão de 100 mm especificada para 18 V/40 V: o acesso deixa de limitar a máquina.",
          },
          {
            refId: "anex-amb-635",
            whyPt: "O anel de neodímio segura o parafuso na ponta em trabalho em altura.",
          },
        ],
      },
    ],
    perfectMatches: [
      { targetId: "397-lock-system", reasonPt: "O reach que o drop não inclui." },
      { targetId: "hvac-system", reasonPt: "Condutas fundas pedem exatamente isto." },
    ],
  },
  {
    id: "drywall-module",
    kind: "module",
    name: "DRYWALL MODULE",
    jp: "石膏ボード",
    taglinePt: "PH2 + catch & stop: parafuso travado a ~0,5 mm da placa, placa rasgada zero.",
    status: "reserving",
    targetPriceEur: { min: 17, max: 24 },
    targetMoq: 100,
    capabilitiesPt: ["Stop ~0,5 mm", "PH2 ×65", "Pladur"],
    imageRefId: "anex-abs-2065",
    leadRefId: "anex-abs-2065",
    modules: [
      {
        role: "CONTROL",
        title: "Profundidade controlada",
        impactReady: true,
        pieces: [
          {
            refId: "anex-abs-2065",
            whyPt:
              "O anel trava o parafuso a meio milímetro da superfície e segura-o até ao aperto.",
          },
          {
            refId: "anex-art-14m-2-65",
            whyPt: "A reposição PH2×65 que o pladur consome em série.",
          },
        ],
      },
    ],
    perfectMatches: [
      { targetId: "ph-work-pack", reasonPt: "O consumível do módulo é o próprio pack PH2." },
      {
        targetId: "397-lock-system",
        reasonPt: "Punho 397 + catch & stop é a bancada de pladur completa.",
      },
    ],
  },
  {
    id: "diamond-upgrade",
    kind: "module",
    name: "DIAMOND UPGRADE",
    jp: "ダイヤモンド",
    taglinePt:
      "Em estudo: o caminho Black → Diamond para quem aperta em inox, latão, alumínio e plástico.",
    status: "lab",
    capabilitiesPt: ["Diamond Ryujin", "Sem íman", "Anti cam-out"],
    imageRefId: "anex-adrs-2065",
    leadRefId: "anex-adrs-2065",
    modules: [
      {
        role: "IMPACT",
        title: "Diamond PH2",
        impactReady: true,
        pieces: [
          {
            refId: "anex-adrs-2065",
            whyPt: "Partículas de diamante retêm o parafuso que não adere a íman.",
          },
          {
            refId: "anex-adsk-2065",
            whyPt: "A haste escalonada de 3,8 mm entra onde o bit cilíndrico não passa.",
          },
        ],
      },
    ],
    perfectMatches: [
      { targetId: "ph-work-pack", reasonPt: "O upgrade Black → Diamond do mesmo perfil." },
      {
        targetId: "precision-system",
        reasonPt: "Retenção sem íman para materiais não magnéticos.",
      },
    ],
  },
];

export function systemById(id: string): RejendariSystem | undefined {
  return REJENDARI_SYSTEMS.find((system) => system.id === id);
}

export function featuredSystem(): RejendariSystem | undefined {
  return REJENDARI_SYSTEMS.find((system) => system.featured);
}

export function systemsOfKind(kind: RejendariSystem["kind"]): RejendariSystem[] {
  return REJENDARI_SYSTEMS.filter((system) => system.kind === kind);
}

export function labSystems(): RejendariSystem[] {
  return REJENDARI_SYSTEMS.filter((system) => system.status === "lab");
}

/** Reservável = existe procura a validar. Lab e vendido não aceitam reserva. */
export function isReservable(system: RejendariSystem): boolean {
  return system.status === "reserving" || system.status === "negotiating";
}

export function targetPriceLabel(system: RejendariSystem): string | null {
  if (!system.targetPriceEur) return null;
  return `€${system.targetPriceEur.min}-${system.targetPriceEur.max}`;
}

/** Estatística de drop: estado confirmado quando as unidades reais atingem o MOQ. */
export function dropUnlocked(system: RejendariSystem, realUnits = 0): boolean {
  if (!system.targetMoq) return false;
  return realUnits >= system.targetMoq;
}

export type CommunityDemand = {
  mostWanted: RejendariSystem[];
  fastestGrowing: RejendariSystem[];
  almostUnlocked: RejendariSystem[];
};

/** Procura da comunidade: dados 100% reais. Sem dados reais, as listas vêm vazias
 * e a UI mostra o estado "sê o primeiro" — nunca números inflados. */
export function communityDemand(
  realUnitsBySystem: Record<string, number> = {},
  realLikesBySystem: Record<string, number> = {},
  limit = 3,
): CommunityDemand {
  const reservable = REJENDARI_SYSTEMS.filter(isReservable);
  const unitsOf = (system: RejendariSystem) => realUnitsBySystem[system.id] ?? 0;
  const likesOf = (system: RejendariSystem) => realLikesBySystem[system.id] ?? 0;

  const withDemand = reservable.filter((system) => unitsOf(system) > 0 || likesOf(system) > 0);

  const mostWanted = [...withDemand].sort((a, b) => unitsOf(b) - unitsOf(a)).slice(0, limit);

  const fastestGrowing = [...withDemand].sort((a, b) => likesOf(b) - likesOf(a)).slice(0, limit);

  const almostUnlocked = reservable
    .filter(
      (system) => system.targetMoq && unitsOf(system) > 0 && unitsOf(system) < system.targetMoq,
    )
    .sort((a, b) => {
      const ra = unitsOf(a) / (a.targetMoq ?? 1);
      const rb = unitsOf(b) / (b.targetMoq ?? 1);
      return rb - ra;
    })
    .slice(0, limit);

  return { mostWanted, fastestGrowing, almostUnlocked };
}

/** Referências únicas usadas por um system (para imagens e auditoria). */
export function systemRefIds(system: RejendariSystem): string[] {
  const ids = new Set<string>();
  for (const module of system.modules) {
    for (const piece of module.pieces) ids.add(piece.refId);
  }
  if (system.imageRefId) ids.add(system.imageRefId);
  if (system.leadRefId) ids.add(system.leadRefId);
  return [...ids];
}

export type ResolvedSystemPiece = SystemPiece & { reference: CuratedToolReference };

/** Resolve as peças de um módulo contra o catálogo; peças desconhecidas são ignoradas. */
export function resolveSystemPieces(
  system: RejendariSystem,
): Map<ModuleRole, ResolvedSystemPiece[]> {
  const resolved = new Map<ModuleRole, ResolvedSystemPiece[]>();
  for (const module of system.modules) {
    const pieces: ResolvedSystemPiece[] = [];
    for (const piece of module.pieces) {
      const reference = referenceById(piece.refId);
      if (reference) pieces.push({ ...piece, reference });
    }
    resolved.set(module.role, pieces);
  }
  return resolved;
}
