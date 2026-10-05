import type { SmartPackPiece, SmartPackTier } from "@/data/smart-packs";

/**
 * Os primeiros kits REJENDARI: composições de assinatura feitas só com
 * referências já curadas. Um "kit" domina uma família de ferramenta até ao
 * fim; uma "caixa" cobre o dia de um ofício. Não são SKUs fechados, o
 * pedido passa pelo B2B com a composição preenchida, como os packs.
 */
export type RejendariKitFormat = "kit" | "caixa";

export type RejendariKit = {
  id: string;
  format: RejendariKitFormat;
  trade: string;
  jp: string;
  tier: SmartPackTier;
  title: string;
  conceptPt: string;
  dayPt: string;
  pieces: SmartPackPiece[];
  notIncludedPt: string[];
  limitationsPt: string;
};

export const REJENDARI_KITS: RejendariKit[] = [
  {
    id: "kit-bits-pro",
    format: "kit",
    trade: "Bits & aparafusamento",
    jp: "先端 · bits",
    tier: "Pro",
    title: "O sistema de bits completo: perfil, impacto e acesso",
    conceptPt:
      "Um sistema, uma escola: o mesmo perfil PH2 em três comprimentos, consumíveis à altura do impacto e o offset que aperta onde a máquina não cabe.",
    dayPt:
      "O dia de bits é o dia mais repetido do ofício: o PH2 entra e sai vinte vezes antes do almoço. Este kit reúne a resposta ANEX de ponta a ponta, bits feitos na mesma casa de Sanjō, do aço ao fio: o conjunto Ryujin de cinco PH2 em 65, 85 e 110 mm cobre qualquer profundidade; os Black Ryujin +2 aguentam o regime da impacto 18 V; o Diamond slim reduz o atrito no aperto longo; e o sistema de cinto, Quick Holders e neji-catch, mantém a ponta certa na mão e o parafuso preso à ponta. Quando o corpo da máquina bloqueia o caminho, o offset AOA-17 aperta por ela.",
    pieces: [
      {
        id: "anex-ryujin-artm5-01",
        quantity: 1,
        whyPt:
          "Cinco PH2 em 65/85/110 mm, Cr-Mo-V made in Japan: o mesmo perfil a qualquer profundidade, para 18 V e 40 V.",
      },
      {
        id: "anex-abrs5-2065",
        quantity: 1,
        whyPt:
          "Black Ryujin +2×65 em cinco peças: o consumível dimensionado para impacto que se gasta primeiro.",
      },
      {
        id: "anex-art-14m-2-65",
        quantity: 1,
        whyPt:
          "A caixa de reposição: dez +2×65 com íman para o dia em que o bit trava e o trabalho não pode parar.",
      },
      {
        id: "anex-adrs-2065",
        quantity: 1,
        whyPt:
          "Diamond Ryujin slim PH2×65: revestimento diamantado para o aperto longo sem escorregar.",
      },
      {
        id: "anex-aqh-s1",
        quantity: 1,
        whyPt:
          "Três Quick Holders com mosquetão: a fixação profunda da ANEX no cinto, troca a uma mão.",
      },
      {
        id: "anex-amb-635",
        quantity: 1,
        whyPt: "Neji-catch: o parafuso fica preso à ponta a ~500 g, a mão livre continua livre.",
      },
      {
        id: "anex-aoa-17s1",
        quantity: 1,
        whyPt:
          "Offset de 17 mm com sockets H8-H21: aperta a 230 N·m onde o corpo da máquina não cabe.",
      },
    ],
    notIncludedPt: ["Máquinas elétricas", "Bits isolados 1000 V", "Sockets 3/8″ e 1/2″"],
    limitationsPt:
      "Bits não isolados 1000 V nem para impacto de 1/2″. O offset AOA-17 é aperto manual; a binário declarado é do sistema, não da máquina. Adaptadores ATA são artigo próprio, fora deste kit.",
  },
  {
    id: "kit-roquetes-pro",
    format: "kit",
    trade: "Roquetes & aperto",
    jp: "ラチェット · roquetes",
    tier: "Pro",
    title: "Seis roquetes, seis classes de acesso",
    conceptPt:
      "O vaivém é a ferramenta mais usada do dia, aqui está um para cada classe: swing completo, acesso curto, acesso longo, cabeça de 20 mm, cabeça baixa para por baixo de superfícies e a chave que leva os bits dentro dela.",
    dayPt:
      "Quem aperta parafusos com um roquete só acaba por forçar todos. Este kit junta as duas escolas que respeitamos: a japonesa do Quick Ball 72, setenta e dois dentes num arco curto, o vaivém contínuo que define a casa, e a alemã da Wera 838 RA-R, curta e longa, com o Rapidaptor que troca bit a uma mão e trava em duplo. O Compact 52 da ANEX entra onde nenhuma cabeça maior entra; o Offset 436 aperta o parafuso que está por baixo do perfil com a cabeça baixa; e o Gandora 431 fecha o dia: dez dentes, dois bits no corpo, a chave que se leva sem porta-bits.",
    pieces: [
      {
        id: "anex-397-d",
        quantity: 1,
        whyPt: "Quick Ball 72: 72 dentes e 25 N·m, o movimento contínuo que define a casa.",
      },
      {
        id: "wera-838-ra-r-m",
        quantity: 1,
        whyPt:
          "838 RA-R M (123,5 mm): Rapidaptor com duplo travamento, o vaivém a uma mão dentro de painéis.",
      },
      {
        id: "wera-838-ra-r-l",
        quantity: 1,
        whyPt:
          "838 RA-R L (140 mm): a versão longa alcança através de painéis sem tirar a mão do aperto.",
      },
      {
        id: "anex-525",
        quantity: 1,
        whyPt: "Compact Bit Ratchet 52: cabeça de 20 mm para o aperto rente a paredes e caixas.",
      },
      {
        id: "anex-436",
        quantity: 1,
        whyPt:
          "Offset de cabeça baixa (21 mm, 16 dentes): o aperto por baixo de superfícies onde nenhum roquete reto entra.",
      },
      {
        id: "anex-431",
        quantity: 1,
        whyPt:
          "Gandora Neji-Pita: dois bits guardados no corpo, a chave de bolso que não precisa de porta-bits.",
      },
    ],
    notIncludedPt: ["Sockets", "Bits em quantidade", "Binário calibrado"],
    limitationsPt:
      "Roquetes de bits 6,35 mm não substituem binário calibrado nem impacto. O Gandora é manutenção leve (10 dentes) e o Offset é aperto manual: para aperto pesado, Quick Ball ou um sistema 3/8″.",
  },
  {
    id: "kit-caixa-avac",
    format: "caixa",
    trade: "AVAC & instalação",
    jp: "設備 · caixa AVAC",
    tier: "Pro",
    title: "A caixa do instalador: tubo, painel e entrega",
    conceptPt:
      "Grip que agarra tubo sem marcar, ajustável com mandíbula reversível, roquete fino para painel e o acabamento que o cliente vê, num sítio só.",
    dayPt:
      "O dia de AVAC alterna tubo, chapa e painel: o Cobra agarra a união redonda sem escorregar, a ajustável ERGO substitui a chave de tubo com a mandíbula reversível e os mordentes paralelos da Pliers Wrench apertam fittings cromados como uma chave fixa, sem marca. Para o aperto rente a parede, o Compact 52; para alcançar através de condutas, a 838 RA-R longa. O prumo auto-retrátil alinha sozinho, a fita Classe 1 decide o corte e o raspador inox entrega o equipamento limpo.",
    pieces: [
      {
        id: "knipex-cobra-250",
        quantity: 1,
        whyPt: "Agarra tubo e união sem escorregar: dentes ~61 HRC, auto-bloqueante.",
      },
      {
        id: "bahco-9031p",
        quantity: 1,
        whyPt:
          "Ajustável ERGO 218 mm com mandíbula reversível: até 39 mm que substituem a chave de tubo.",
      },
      {
        id: "knipex-pliers-wrench-250",
        quantity: 1,
        whyPt:
          "Mordentes paralelos até 52 mm: aperta fittings cromados como chave fixa, sem marcar.",
      },
      {
        id: "anex-525",
        quantity: 1,
        whyPt: "Cabeça de 20 mm e 52 dentes: o aperto rente a paredes e caixas.",
      },
      {
        id: "wera-838-ra-r-l",
        quantity: 1,
        whyPt: "Acesso longo: alcança através de painéis e condutas com Rapidaptor a uma mão.",
      },
      {
        id: "olfa-scr-l",
        quantity: 1,
        whyPt: "Raspador inox 60 mm: cola, restos e autocolantes saem antes da entrega.",
      },
      {
        id: "tajima-pzb300",
        quantity: 1,
        whyPt: "Prumo auto-retrátil Plumb-Rite: alinhar deixa de precisar de segunda pessoa.",
      },
      {
        id: "tajima-l25-50e1-eur",
        quantity: 1,
        whyPt: "Fita Classe 1 com 2,4 m de saída: a medida que não se discute.",
      },
      { id: "olfa-l5", quantity: 1, whyPt: "Isolamentos, proteções e aberturas fazem-se a 18 mm." },
    ],
    notIncludedPt: ["Máquinas de perfuração", "Detector de tensão", "Manómetros e bomba de vácuo"],
    limitationsPt:
      "Não inclui perfuração nem máquinas (ver o pack AVAC Pro). Trabalho elétrico no lado de tensão exige ferramentas isoladas certificadas, ver a Caixa Eletricista.",
  },
  {
    id: "kit-caixa-eletricista",
    format: "caixa",
    trade: "Eletricidade",
    jp: "電設 · caixa eletricista",
    tier: "Pro",
    title: "A cadeia 1000 V inteira, certificada peça a peça",
    conceptPt:
      "Cada peça isolada é uma ferramenta completa certificada IEC 60900, ensaiada a 10 kV e marcada. Sem atalhos: bit isolado em porta-bits comum não é ferramenta certificada.",
    dayPt:
      "Do quadro ao borne, a regra é uma só: sob tensão, só ferramenta completa certificada. O roquete porta-lâminas VDE da Wera traz dezassete lâminas de 157 mm ensaiadas individualmente; o alicate de instalação de seis funções descarna, crimpa e corta cabo até 50 mm² com a mesma certificação; o corte de alta alavanca VDE parte fio piano de 2,5 mm. No aperto fino, a slim isolada ANEX chega a bornes fundos; os bits AZM 1000 V servem a vizinhança de tensão e máquinas até 7,2 V, pela regra, não ao lado dela.",
    pieces: [
      {
        id: "wera-kompakt-vde-17-ra-1",
        quantity: 1,
        whyPt:
          "Roquete 837 i RA com 17 lâminas VDE de 157 mm, ensaio individual a 10.000 V: o vaivém certificado.",
      },
      {
        id: "knipex-13-96-200",
        quantity: 1,
        whyPt:
          "Seis funções em 200 mm: descarna 0,75-2,5 mm², crimpa e corta cabo Cu até Ø15 mm, 1000 V.",
      },
      {
        id: "knipex-74-06-200",
        quantity: 1,
        whyPt: "Corte de alta alavanca VDE, arestas ~64 HRC: fio piano Ø2,5 mm isolado a sério.",
      },
      {
        id: "anex-7920",
        quantity: 1,
        whyPt: "Chave slim isolada +2×100: haste fina para bornes fundos no quadro.",
      },
      {
        id: "anex-azm-2698",
        quantity: 1,
        whyPt:
          "Bit dupla ponta +2/−6 isolado 1000 V, ensaio dielétrico 10 kV: o consumível do lado elétrico.",
      },
      {
        id: "anex-azm-1598",
        quantity: 1,
        whyPt: "E o +1/−5 para o parafuso pequeno: mesmo isolamento, perfil menor.",
      },
      {
        id: "vessel-960-ph2-100",
        quantity: 1,
        whyPt:
          "MEGADORA Insulated PH2×100: chave completa 1000 V para o aperto direto sob certificação.",
      },
    ],
    notIncludedPt: ["Detector de tensão", "Luvas e EPI isolante", "Multímetro"],
    limitationsPt:
      "Bits AZM montados em porta-bits comum não constituem ferramenta certificada para trabalho sob tensão: para tensão, conjunto VDE completo. O trabalho sem tensão confirmada continua a ser a primeira regra.",
  },
  {
    id: "kit-caixa-tecnico",
    format: "caixa",
    trade: "Manutenção & serviço",
    jp: "整備 · caixa técnico",
    tier: "Pro",
    title: "A caixa do serviço: sockets, bits e grip sem virar oficina",
    conceptPt:
      "O conjunto 3/8″ da Wera como espinha, o Quick Ball para os bits, o roquete de 16 perfis da VESSEL para a variedade e o grip que segura o resto. Nada duplicado.",
    dayPt:
      "O técnico de serviço nunca sabe o que encontra à chegada: porca de 8 mm num lado, painel PH2 no outro, tubo no meio. A caixa organiza a resposta: o sistema Zyklop Speed 3/8″ cobre porcas de 8 a 19 mm com roquete de manga livre, sockets, extensões e adaptador dimensionados em conjunto; o Quick Ball 72 trata dos bits sem trocar de ferramenta; o roquete VESSEL de 16 perfis resolve a variedade de cabeças sem abrir caixa à frente do cliente; o Cobra segura o redondo. A caixa de dez PH2 repõe o consumível sozinho, e corte e medida fecham o dia.",
    pieces: [
      {
        id: "wera-8100-sb-6",
        quantity: 1,
        whyPt:
          "Zyklop Speed 3/8″ de 29 peças: roquete 72 dentes com manga de rotação livre, sockets 8-19 mm e extensões num sistema.",
      },
      {
        id: "anex-397-d",
        quantity: 1,
        whyPt: "Quick Ball 72 para o lado dos bits: 72 dentes, 25 N·m.",
      },
      {
        id: "vessel-td6816mg",
        quantity: 1,
        whyPt:
          "Roquete VESSEL de 72 dentes com 16 bits: a variedade de perfis na mão, sem caixa aberta.",
      },
      {
        id: "knipex-cobra-250",
        quantity: 1,
        whyPt: "O grip de tubo e porca redonda que todo o técnico precisa uma vez por dia.",
      },
      {
        id: "anex-art-14m-2-65",
        quantity: 1,
        whyPt: "Dez PH2 +2×65 em caixa: o consumível que se repõe sozinho.",
      },
      { id: "olfa-l5", quantity: 1, whyPt: "Corte 18 mm para embalagens e proteções." },
      {
        id: "tajima-l25-50e1-eur",
        quantity: 1,
        whyPt: "Fita Classe 1: a primeira medição do dia não se discute.",
      },
    ],
    notIncludedPt: ["Máquinas elétricas", "Ferramentas isoladas 1000 V", "Binário calibrado"],
    limitationsPt:
      "Sockets até 19 mm e aperto manual: sem impacto nem binário calibrado. Não substitui as caixas de ofício (AVAC, eletricista) quando o trabalho é especializado.",
  },
];

export function kitById(id: string) {
  return REJENDARI_KITS.find((kit) => kit.id === id);
}
