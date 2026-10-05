export type SmartPackPiece = {
  id: string;
  quantity: number;
  whyPt: string;
};

export type SmartPackTier = "Compact" | "Core" | "Pro";

export type SmartPack = {
  id: string;
  trade: string;
  jp: string;
  tier: SmartPackTier;
  title: string;
  dayPt: string;
  pieces: SmartPackPiece[];
  notIncludedPt: string[];
  limitationsPt: string;
};

/**
 * Packs editoriais REJENDARI: combinações de referências já curadas,
 * pensadas para o dia de trabalho. Não são conjuntos fechados à venda nem
 * SKUs de fabricante, o pedido passa pelo B2B com a composição preenchida.
 * Cada tier existe só quando a diferença funcional é real.
 */
export const SMART_PACKS: SmartPack[] = [
  // ── Manutenção ────────────────────────────────────────────────
  {
    id: "manutencao-compact",
    trade: "Manutenção",
    jp: "整備 · manutenção",
    tier: "Compact",
    title: "A mala leve que resolve o pequeno aperto",
    dayPt:
      "O dia começa com um painel para abrir, um parafuso PH2 teimoso e uma medição que tem de ficar certa à primeira. Nada de motores, aperto pequeno, corte limpo e medida confiável.",
    pieces: [
      {
        id: "anex-397-d",
        quantity: 1,
        whyPt: "Roquete de 72 dentes com bit incluído: o aperto pequeno com força de verdade.",
      },
      {
        id: "anex-art-14m-2-65",
        quantity: 1,
        whyPt:
          "Dez PH2 de reposição: o perfil que se gasta primeiro, em caixa e não em packs soltos.",
      },
      {
        id: "olfa-l5",
        quantity: 1,
        whyPt: "Cutter 18 mm para embalagens, proteções e acabamentos rápidos.",
      },
      {
        id: "tajima-l25-50e1-eur",
        quantity: 1,
        whyPt: "Fita Classe 1: a primeira medição do dia não se discute.",
      },
    ],
    notIncludedPt: ["Sockets e porcas grandes", "Alicates de grip", "Máquinas elétricas"],
    limitationsPt:
      "Pensado para aperto pequeno e medição; porca acima de 13 mm pede sockets, ver o nível Core.",
  },
  {
    id: "manutencao-core",
    trade: "Manutenção",
    jp: "整備 · manutenção",
    tier: "Core",
    title: "Sockets 3/8″ e grip num só estojo",
    dayPt:
      "Manutenção de equipamento com parafusos e porcas de verdade: sockets métricos, um alicate que agarra redondo sem escorregar e o roquete que já conhecias do Compact.",
    pieces: [
      {
        id: "anex-397-d",
        quantity: 1,
        whyPt: "O roquete de bits para os parafusos, mantém-se de nível a nível.",
      },
      {
        id: "wera-8100-sb-6",
        quantity: 1,
        whyPt:
          "Sistema 3/8″ Zyklop Speed de 29 peças: roquete 72 dentes, sockets 8-19 mm e extensões, dimensionados em conjunto.",
      },
      {
        id: "knipex-cobra-250",
        quantity: 1,
        whyPt: "Auto-bloqueante em tubo e porca: agarra redondo sem marcar e sem escorregar.",
      },
      { id: "olfa-l5", quantity: 1, whyPt: "O corte do dia a dia continua a fazer-se em 18 mm." },
      {
        id: "tajima-l25-50e1-eur",
        quantity: 1,
        whyPt: "Classe 1 para não acumular erro entre bancada e campo.",
      },
    ],
    notIncludedPt: ["Chaves combinadas", "Máquinas elétricas", "Binário calibrado"],
    limitationsPt:
      "Cobre sockets até 19 mm; aperto calibrado (ex.: terminais, cubos) exige chave dinamométrica própria.",
  },
  {
    id: "manutencao-pro",
    trade: "Manutenção",
    jp: "整備 · manutenção",
    tier: "Pro",
    title: "A oficina de mecânica numa mala",
    dayPt:
      "O dia em que a mala é a oficina: três acionamentos de sockets, chaves combinadas, impacto de 18 V para o parafuso que não sai e a Pliers Wrench para fittings que não podem ficar marcados.",
    pieces: [
      {
        id: "bahco-s138",
        quantity: 1,
        whyPt:
          "Sockets 1/4″-1/2″, chaves combinadas e bits num estojo: a base completa de mecânica geral.",
      },
      {
        id: "makita-dtd172z",
        quantity: 1,
        whyPt:
          "Impacto LXT 18 V de 180 N·m para o parafuso fundido ou oxidado, corpo sem baterias, a plataforma já existe.",
      },
      {
        id: "anex-abrs5-2065",
        quantity: 1,
        whyPt:
          "Bits Black Ryujin dimensionados para impacto: o consumível certo para a máquina certa.",
      },
      {
        id: "knipex-pliers-wrench-250",
        quantity: 1,
        whyPt:
          "Mordentes paralelos até 52 mm: agarra fittings cromados como uma chave fixa, sem marcar.",
      },
      {
        id: "vessel-2200-ph2-100",
        quantity: 1,
        whyPt: "Ball Ratchet PH2 de 36 dentes para o aperto fino onde a impacto não pode chegar.",
      },
      {
        id: "tajima-l25-50e1-eur",
        quantity: 1,
        whyPt: "Medir certo continua a ser o primeiro passo.",
      },
    ],
    notIncludedPt: [
      "Baterias e carregador da máquina",
      "Sockets de impacto 1/2″",
      "Chave dinamométrica",
    ],
    limitationsPt:
      "A DTD172Z é corpo simples (Z): requer bateria e carregador LXT 18 V já existentes ou pedidos à parte. Sockets do estojo não são de impacto.",
  },

  // ── Montagem / aparafusamento ─────────────────────────────────
  {
    id: "montagem-compact",
    trade: "Montagem & aparafusamento",
    jp: "組立 · montagem",
    tier: "Compact",
    title: "Montagem contínua a uma mão",
    dayPt:
      "Dia de montagem em série: perfis, painéis, PH2 e PH3 alternados. O que interessa é o vaivém, roquete curto, dois perfis na mesma haste e corte de abertura seguro.",
    pieces: [
      {
        id: "vessel-td24",
        quantity: 1,
        whyPt: "Mini roquete de 60 dentes, corpo curto: troca rápida e vaivém dentro de painéis.",
      },
      {
        id: "anex-arpm-2365",
        quantity: 1,
        whyPt: "+2 e +3 na mesma haste: metade das trocas quando a montagem alterna perfis.",
      },
      {
        id: "anex-aqh-s1",
        quantity: 1,
        whyPt: "Porta-bits no cinto com mosquetão: a ponta certa não se procura no fundo da caixa.",
      },
      {
        id: "olfa-sk-10",
        quantity: 1,
        whyPt:
          "Cutter auto-retrátil para desbloquear cargas: a lâmina recolhe sozinha, o ritmo não pára.",
      },
    ],
    notIncludedPt: ["Máquina de impacto", "Torque controlado", "Acesso offset"],
    limitationsPt:
      "Aperto manual dimensionado; montagem com impacto ou binário definido pede os níveis seguintes.",
  },
  {
    id: "montagem-core",
    trade: "Montagem & aparafusamento",
    jp: "組立 · montagem",
    tier: "Core",
    title: "Impacto 18 V com bits à altura",
    dayPt:
      "A montagem acelera: chapa e madeira pedem impacto de 18 V, os bits têm de aguentar o regime e o parafuso pequeno em altura deixa de cair.",
    pieces: [
      {
        id: "makita-dtd173z",
        quantity: 1,
        whyPt: "Impacto 18 V de 180 N·m com quatro níveis: força com dosagem, corpo sem baterias.",
      },
      {
        id: "anex-abrs5-2065",
        quantity: 1,
        whyPt: "Black Ryujin em Cr-Mo-V para 18 V/40 V: bits que não partem ao terceiro dia.",
      },
      {
        id: "anex-ryujin-artm5-01",
        quantity: 1,
        whyPt: "Três comprimentos de PH2: curto para rente, longo para fundo, tudo num jogo.",
      },
      {
        id: "anex-amb-635",
        quantity: 1,
        whyPt: "Anel neji-catch: o parafuso fica na ponta e a mão livre continua livre.",
      },
      {
        id: "vessel-2200-ph2-100",
        quantity: 1,
        whyPt:
          "O aperto final fino continua manual e a uma mão, com o Ball Grip a sentir o aperto.",
      },
    ],
    notIncludedPt: ["Bateria e carregador", "Adaptadores de acesso", "Binário definido"],
    limitationsPt:
      "A máquina exige plataforma LXT 18 V. Para aperto com valor de binário exigido (equipamento), ver Pro.",
  },
  {
    id: "montagem-pro",
    trade: "Montagem & aparafusamento",
    jp: "組立 · montagem",
    tier: "Pro",
    title: "Montagem completa: força, acesso e limite",
    dayPt:
      "Montagem profissional: impacto pesado, acesso além do obstáculo com o offset AOA-17, e o aperto calibrado onde o equipamento exige valor de binário definido.",
    pieces: [
      {
        id: "makita-dtd172z",
        quantity: 1,
        whyPt: "A impacto de 180 N·m de referência, corpo para quem já tem LXT.",
      },
      {
        id: "anex-ryujin-artm5-01",
        quantity: 1,
        whyPt: "PH2 em 65/85/110 mm: o mesmo perfil em qualquer profundidade.",
      },
      {
        id: "anex-aoa-17s1",
        quantity: 1,
        whyPt: "Offset AOA-17: aperta onde o corpo da máquina não cabe, mantendo o movimento.",
      },
      {
        id: "anex-ata-s1",
        quantity: 1,
        whyPt:
          "Set ATA com adaptadores M3-M6 e Quick Ball 72: binário definido com certificação do fabricante.",
      },
      {
        id: "anex-1902",
        quantity: 1,
        whyPt: "Impacto manual para soltar o parafuso que a máquina não convence.",
      },
      {
        id: "anex-aqh-s1",
        quantity: 1,
        whyPt: "O sistema de porta-bits no cinto acompanha o dia inteiro.",
      },
    ],
    notIncludedPt: ["Bateria e carregador LXT", "Brocas e perfuração", "Sockets"],
    limitationsPt:
      "Adaptadores ATA: máquinas até 7,2 V, nunca impacto (limite do fabricante). O conjunto ATA não certifica a máquina completa.",
  },

  // ── AVAC / instalação ─────────────────────────────────────────
  {
    id: "avac-compact",
    trade: "AVAC & instalação",
    jp: "設備 · AVAC",
    tier: "Compact",
    title: "Tubo, painel e medição no cinto",
    dayPt:
      "Dia de instalação leve: fixar suportes, aparelhar condutas, medir traçados. Um alicate que agarra tubo, um roquete fino para painel e a fita que decide o corte.",
    pieces: [
      {
        id: "knipex-cobra-250",
        quantity: 1,
        whyPt: "Agarra tubo e união sem escorregar: o alicate base de qualquer dia de instalação.",
      },
      {
        id: "anex-525",
        quantity: 1,
        whyPt: "Roquete de 52 dentes com cabeça de 20 mm: aperto rente a paredes e caixas.",
      },
      {
        id: "tajima-l25-50e1-eur",
        quantity: 1,
        whyPt: "Classe 1 com 2,4 m de saída: mede sozinha na horizontal.",
      },
      { id: "olfa-l5", quantity: 1, whyPt: "Isolamentos, proteções e aberturas fazem-se a 18 mm." },
    ],
    notIncludedPt: ["Chave ajustável", "Máquina de perfuração", "Torque"],
    limitationsPt:
      "Para porcas grandes e uniões apertadas a mão, ver Core, a ajustável muda o dia.",
  },
  {
    id: "avac-core",
    trade: "AVAC & instalação",
    jp: "設備 · AVAC",
    tier: "Core",
    title: "A ajustável do instalador e o acesso longo",
    dayPt:
      "O instalador que trabalha sozinho: ajustável com mandíbula para tubo, chave longa para alcançar através de condutas e raspador para o acabamento que o cliente vê.",
    pieces: [
      {
        id: "bahco-9031p",
        quantity: 1,
        whyPt: "Ajustável ERGO com mandíbula reversível: 218 mm que substituem a chave de tubo.",
      },
      {
        id: "bahco-9031p",
        quantity: 1,
        whyPt: "Ajustável ERGO para as porcas que o socket não agarra: aperto firme sem marcar.",
      },
      {
        id: "knipex-cobra-250",
        quantity: 1,
        whyPt: "O grip de tubo mantém-se, agora com a ajustável ao lado.",
      },
      {
        id: "olfa-scr-l",
        quantity: 1,
        whyPt: "Raspador inox 60 mm: cola, restos e autocolantes saem antes da entrega.",
      },
      {
        id: "anex-525",
        quantity: 1,
        whyPt: "O aperto rente a parede continua a fazer-se em 52 dentes.",
      },
    ],
    notIncludedPt: ["Perfuração", "Detectores/medição elétrica", "Máquinas"],
    limitationsPt: "Para fixações em betão ou chapa grossa, ver Pro, a perfuração pede máquina.",
  },
  {
    id: "avac-pro",
    trade: "AVAC & instalação",
    jp: "設備 · AVAC",
    tier: "Pro",
    title: "Instalação completa: perfurar, fixar, entregar",
    dayPt:
      "Do traçado à entrega: perfusão 18 V, fixação com impacto, grip que não danifica fittings e o prumo que garante que tudo fica a prumo antes de apertar a última braçadeira.",
    pieces: [
      {
        id: "makita-dhp489z",
        quantity: 1,
        whyPt:
          "Berbequim compacto com percussão 18 V: o furo certo na hora certa, corpo sem baterias.",
      },
      {
        id: "makita-dtd173z",
        quantity: 1,
        whyPt: "Impacto com quatro níveis para fixação dosada.",
      },
      {
        id: "anex-abrs5-2065",
        quantity: 1,
        whyPt: "Bits à altura do impacto: Black Ryujin para 18 V.",
      },
      {
        id: "knipex-pliers-wrench-250",
        quantity: 1,
        whyPt: "Fittings cromados e ligações finais: mordentes paralelos que não marcam.",
      },
      {
        id: "bahco-9031p",
        quantity: 1,
        whyPt: "A ajustável de tubo segue para as uniões maiores.",
      },
      {
        id: "tajima-pzb300",
        quantity: 1,
        whyPt: "Prumo auto-retrátil: alinhar deixa de precisar de segunda pessoa.",
      },
      { id: "tajima-l25-50e1-eur", quantity: 1, whyPt: "E a medida continua Classe 1." },
    ],
    notIncludedPt: [
      "Baterias, carregador e brocas",
      "Detector de tensão",
      "Bombas de vácuo/manómetros",
    ],
    limitationsPt:
      "Máquinas Z: requer LXT 18 V já existente. Trabalho elétrico no lado de tensão exige as ferramentas isoladas 1000 V próprias, ver o pack de assinatura elétrico.",
  },

  // ── Assinatura REJENDARI · o melhor com o melhor ──────────────
  {
    id: "assinatura-anex-core",
    trade: "Assinatura REJENDARI",
    jp: "択一 · assinatura",
    tier: "Core",
    title: "O ANEX de assinatura: 397 + Ryujin 5×PH2",
    dayPt:
      "O pack que resume porque somos ANEX-first: o Quick Ball 72 no movimento, o conjunto Ryujin de cinco bits PH2 em três comprimentos no contacto, o Diamante slim no aperto fino e os Quick Holders com o grip profundo da ANEX a segurar tudo no cinto.",
    pieces: [
      {
        id: "anex-397-d",
        quantity: 1,
        whyPt: "O roquete de 72 dentes com spinner: o movimento contínuo que define a casa.",
      },
      {
        id: "anex-ryujin-artm5-01",
        quantity: 1,
        whyPt:
          "Cinco bits PH2 em 65/85/110 mm em Cr-Mo-V made in Japan: o mesmo perfil a qualquer profundidade, para 18 V e 40 V.",
      },
      {
        id: "anex-adrs-2065",
        quantity: 1,
        whyPt: "Diamond Ryujin slim com zona torsional: o bit fino que aguenta o dia inteiro.",
      },
      {
        id: "anex-aqh-s1",
        quantity: 1,
        whyPt:
          "Três Quick Holders com mosquetão: a fixação de bits da ANEX é profunda e troca-se a uma mão, a exceção que preferimos.",
      },
    ],
    notIncludedPt: ["Máquinas elétricas", "Bits isolados 1000 V", "Adaptadores offset"],
    limitationsPt:
      "Bits Ryujin/ADRS não são isolados nem para impacto de 1/2″: aperto com roquete e impacto 1/4″ até 18 V/40 V conforme fabricante.",
  },
  {
    id: "assinatura-anex-pro",
    trade: "Assinatura REJENDARI",
    jp: "択一 · assinatura",
    tier: "Pro",
    title: "A ANEX completa: acesso, binário e vaivém",
    dayPt:
      "Quando a assinatura vira sistema: acrescenta-se o Gandora 431 com bits guardados no punho, o offset AOA-17 para apertar além do obstáculo e o set ATA de binário M3-M6 com certificação do fabricante.",
    pieces: [
      { id: "anex-397-d", quantity: 1, whyPt: "O coração do pack mantém-se: Quick Ball 72." },
      {
        id: "anex-ryujin-artm5-01",
        quantity: 1,
        whyPt: "E o jogo Ryujin 5×PH2 mantém-se, é o consumível que se usa.",
      },
      {
        id: "anex-431",
        quantity: 1,
        whyPt:
          "Gandora de 10 dentes com dois bits Neji-Pita no corpo: a chave que leva os bits dentro dela.",
      },
      {
        id: "anex-aoa-17s1",
        quantity: 1,
        whyPt: "Offset AOA-17: a máquina fica atrás do obstáculo e o aperto chega na mesma.",
      },
      {
        id: "anex-ata-s1",
        quantity: 1,
        whyPt:
          "Set ATA com adaptadores M3-M6 e Quick Ball 72: binário definido com precisão declarada ±10%.",
      },
      {
        id: "anex-aqh-s1",
        quantity: 1,
        whyPt: "Quick Holders no cinto: o grip profundo da ANEX como fixação preferida.",
      },
    ],
    notIncludedPt: ["Máquinas elétricas", "Sockets", "Ferramentas isoladas 1000 V"],
    limitationsPt:
      "Adaptadores ATA: apenas máquinas até 7,2 V, nunca impacto (limite do fabricante); o conjunto não certifica a máquina completa.",
  },
  {
    id: "assinatura-sistema-core",
    trade: "Assinatura REJENDARI",
    jp: "択一 · assinatura",
    tier: "Core",
    title: "Wera × ANEX: o sistema que interliga",
    dayPt:
      "O melhor alemão com o melhor japonês: a Zyklop Speed completa os sockets 3/8″, o 838 RA-R M dá o vaivém a uma mão com travão duplo Rapidaptor, a ANEX põe o bit certo na ponta, e o roquete VDE fecha o trabalho sob tensão pela via legal.",
    pieces: [
      {
        id: "wera-8100-sb-6",
        quantity: 1,
        whyPt:
          "Kit Zyklop Speed 3/8″ de 29 peças (art. 05004046001): catraca, sockets 8-19 mm e adaptador, o lado sockets do sistema.",
      },
      {
        id: "makita-dhr243z",
        quantity: 1,
        whyPt:
          "Rotativa SDS-Plus DHR243Z para furar e partir + o Zyklop para o aperto a socket: a oficina completa.",
      },
      {
        id: "anex-397-d",
        quantity: 1,
        whyPt: "O Quick Ball 72 japonês: outro vaivém, outra escola, mesma mala.",
      },
      {
        id: "anex-azm-2698",
        quantity: 1,
        whyPt: "Bit AZM 1000 V ensaiado a 10 kV: o bit isolado para o lado elétrico.",
      },
      {
        id: "vessel-960-ph2-100",
        quantity: 1,
        whyPt:
          "Roquete VDE 837 i RA (40 dentes) com lâminas 157 mm ensaiadas a 10 kV: trabalho sob tensão com ferramenta completa certificada, a via legal.",
      },
    ],
    notIncludedPt: ["Baterias e máquinas", "Sockets de impacto", "Chaves dinamométricas"],
    limitationsPt:
      "Bit AZM montado em porta-bits comum não é ferramenta certificada para trabalho sob tensão: para tensão usa-se o conjunto VDE completo. Sockets do kit não são de impacto.",
  },
  {
    id: "assinatura-eletrico-core",
    trade: "Assinatura REJENDARI",
    jp: "択一 · assinatura",
    tier: "Core",
    title: "A cadeia 1000 V inteira, pela regra",
    dayPt:
      "Do quadro ao borne: bit AZM 1000 V ensaiado a 10 kV, chave slim isolada ANEX, o roquete VDE certificado como ferramenta completa e o corte de alta alavanca VDE. Cada peça isolada é peça isolada, sem atalhos.",
    pieces: [
      {
        id: "vessel-960-ph2-100",
        quantity: 1,
        whyPt:
          "Roquete 837 i RA VDE com lâminas 157 mm: ensaio individual a 10.000 V (IEC 60900), o vaivém rápido com certificação de conjunto.",
      },
      {
        id: "anex-azm-2698",
        quantity: 1,
        whyPt: "Bit dupla ponta +2/−6 isolado 1000 V, ensaio dielétrico 10 kV, made in Japan.",
      },
      {
        id: "anex-7920",
        quantity: 1,
        whyPt: "Chave slim isolada +2×100: haste fina para bornes fundos no quadro.",
      },
      {
        id: "knipex-74-06-200",
        quantity: 1,
        whyPt:
          "Corte diagonal VDE de alta alavanca, arestas ~64 HRC: corta fio piano Ø2,5 mm isolado a sério.",
      },
    ],
    notIncludedPt: ["Detector de tensão", "Luvas isolantes", "Alicate universal VDE"],
    limitationsPt:
      "Base legal: a EN/IEC 60900 certifica a ferramenta completa tal como ensaiada e marcada, um bit totalmente isolado montado num porta-bits comum não constitui ferramenta certificada para trabalho sob tensão. Sob tensão usa-se o conjunto VDE; o bit AZM serve trabalho na vizinhança e em máquinas até 7,2 V conforme o fabricante.",
  },
];

export function smartPacksByTrade() {
  const trades: string[] = [];
  for (const pack of SMART_PACKS) if (!trades.includes(pack.trade)) trades.push(pack.trade);
  return trades.map((trade) => ({ trade, packs: SMART_PACKS.filter((p) => p.trade === trade) }));
}

export function smartPackById(id: string) {
  return SMART_PACKS.find((p) => p.id === id);
}
