import type { SmartPackPiece, SmartPackTier } from "@/data/smart-packs";

/**
 * Os primeiros kits REJENDARI: composições de assinatura feitas só com
 * referências já curadas. Um "kit" domina uma família de ferramenta até ao
 * fim; uma "caixa" cobre o dia de um ofício. Não são SKUs fechados, o
 * pedido passa pelo B2B com a composição preenchida, como os packs.
 */
export type RejendariKitFormat = "kit" | "caixa" | "mala";

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
      "O dia de bits é o dia mais repetido do ofício: o PH2 entra e sai vinte vezes antes do almoço. Este kit reúne a resposta ANEX de ponta a ponta, bits feitos na mesma casa de Sanjō, do aço ao fio: a caixa Black Ryujin de dez PH2×65 cobre o perfil e a extensão de 150 mm cobre a profundidade; os Diamond aguentam o aperto longo sem escorregar; o Diamond slim reduz o atrito no aperto longo; e o sistema de cinto, Quick Holders e neji-catch, mantém a ponta certa na mão e o parafuso preso à ponta. Quando o corpo da máquina bloqueia o caminho, o offset AOA-17 aperta por ela.",
    pieces: [
      {
        id: "anex-aeh-150",
        quantity: 1,
        whyPt:
          "Extensão de 150 mm para 18 V/40 V: o alcance dos 110 mm sem levar bits que não se usam.",
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
      "Quem aperta parafusos com um roquete só acaba por forçar todos. Este kit junta as escolas que respeitamos: a japonesa do Quick Ball 72, setenta e dois dentes num arco curto, o vaivém contínuo que define a casa, e o roquete VESSEL de 72 dentes com dezasseis bits integrados que fecha a variedade de cabeças sem abrir caixa. O Compact 52 da ANEX entra onde nenhuma cabeça maior entra; o Offset 436 aperta o parafuso que está por baixo do perfil com a cabeça baixa; e o Gandora 431 fecha o dia: dez dentes, dois bits no corpo, a chave que se leva sem porta-bits.",
    pieces: [
      {
        id: "anex-397-d",
        quantity: 1,
        whyPt: "Quick Ball 72: 72 dentes e 25 N·m, o movimento contínuo que define a casa.",
      },
      {
        id: "vessel-td6816mg",
        quantity: 1,
        whyPt:
          "Roquete de 72 dentes com 16 bits integrados: o vaivém a uma mão dentro de painéis, sem caixa aberta.",
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
      {
        id: "vessel-230w",
        quantity: 1,
        whyPt: "Ball Grip tang-through: o parafuso clássico japonês com retenção na haste.",
      },
      {
        id: "vessel-tdbs23",
        quantity: 1,
        whyPt: "Dez bits ultra-curtos PH/SL/HEX: o aperto rente sem abrir a caixa de bits.",
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
      "O dia de AVAC alterna tubo, chapa e painel: o Cobra agarra a união redonda sem escorregar, a ajustável ERGO substitui a chave de tubo com a mandíbula reversível e os mordentes paralelos da Pliers Wrench apertam fittings cromados como uma chave fixa, sem marca. Para o aperto rente a parede, o Compact 52; para alcançar através de condutas, a extensão AEH-100. O prumo auto-retrátil alinha sozinho, a fita Classe 1 decide o corte e o raspador inox entrega o equipamento limpo.",
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
        id: "anex-aeh-100",
        quantity: 1,
        whyPt: "Acesso longo: 100 mm de extensão para alcançar através de painéis e condutas.",
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
      "Não inclui perfuração nem máquinas (ver o pack AVAC Pro). Trabalho elétrico no lado de tensão exige ferramentas isoladas certificadas, ver o pack VDE básico e a mala eletricidade VDE.",
  },
  {
    id: "kit-caixa-tecnico",
    format: "caixa",
    trade: "Manutenção & serviço",
    jp: "整備 · caixa técnico",
    tier: "Pro",
    title: "A caixa do serviço: sockets, perfis e grip sem virar oficina",
    conceptPt:
      "O conjunto 3/8″ da Wera como espinha, o roquete de 16 perfis da VESSEL para a variedade e o grip que segura o resto. Nada duplicado com a mala 397: nem Quick Ball, nem caixa de reposição de bits.",
    dayPt:
      "O técnico de serviço nunca sabe o que encontra à chegada: porca de 8 mm num lado, painel PH2 no outro, tubo no meio. A caixa organiza a resposta sem repetir a mala 397: o sistema Zyklop Speed 3/8″ cobre porcas de 8 a 19 mm com roquete de manga livre, sockets e extensões dimensionados em conjunto; o roquete VESSEL de 16 perfis resolve a variedade de cabeças sem abrir caixa à frente do cliente; os Quick Holders levam os bits do dia no cinto e trocam a uma mão; o Cobra segura o redondo. Corte e medida fecham o dia.",
    pieces: [
      {
        id: "wera-8100-sb-6",
        quantity: 1,
        whyPt:
          "Zyklop Speed 3/8″ de 29 peças: roquete 72 dentes com manga de rotação livre, sockets 8-19 mm e extensões num sistema.",
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
        id: "anex-aqh-s1",
        quantity: 1,
        whyPt:
          "Três Quick Holders com mosquetão: os bits do dia no cinto, troca a uma mão, sem abrir caixa.",
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
      "Sockets até 19 mm e aperto manual: sem impacto nem binário calibrado. Não substitui as caixas de ofício (AVAC), o pack VDE básico ou as malas de profissão quando o trabalho é especializado.",
  },
  // ── Malas de trabalho por profissão ──────────────────────────
  // Cross bit utilization: cada bit serve o 397, a impacto e a Zyklop via
  // redução 8784. Contagem mínima, zero duplicação entre malas.
  {
    id: "mala-397",
    format: "mala",
    trade: "Mala 397 · base",
    jp: "鞄 · mala 397",
    tier: "Pro",
    title: "A mala 397: lock, impacto e Zyklop num só movimento",
    conceptPt:
      "A mala base de toda a casa: o 397 com o lock SHOCKWAVE Milwaukee, o pack PH2×65 com reposição, a Zyklop 3/8 com redução para 1/4″ e o aperto de mão que falta ao dia de qualquer profissão.",
    dayPt:
      "A mala abre no punho do 397: o bit entra pelo lock Milwaukee SHOCKWAVE e fica travado. Quando o aperto cresce, a redução 8784 leva o mesmo bit à Zyklop 3/8″ e os sockets entram sem trocar de linguagem. O Cobra segura o redondo, a Pliers Wrench aperta sem marcar, o instalador 13-96 descarna e corta, a fita TAJIMA mede, o X-ato OLFA abre e o serrote Bahco corta calha e ferro. O nível Optima e a reposição de dez PH2 fecham o dia sem visitas à loja. Martelo, busca polos e fita isoladora entram por EM SOURCING assim que a marca estiver homologada.",
    pieces: [
      {
        id: "anex-397-d",
        quantity: 1,
        whyPt: "A base de tudo: 72 dentes, 25 N·m e o punho que define a casa.",
      },
      {
        id: "milwaukee-shockwave-lock-73",
        quantity: 1,
        whyPt:
          "O lock oficial da casa: SHOCKWAVE Impact Locking de 73 mm a travar o bit, 14,02 EUR com IVA em Portugal.",
      },
      {
        id: "anex-adrs-2065",
        quantity: 1,
        whyPt: "Diamond slim para inox, latão e plástico: retenção sem íman.",
      },
      {
        id: "anex-art-14m-2-65",
        quantity: 1,
        whyPt: "A caixa de reposição com dez PH2×65: o consumível que não pode faltar.",
      },
      {
        id: "anex-aeh-100",
        quantity: 1,
        whyPt: "Extensor de 100 mm especificado para impacto: o fundo do perfil deixa de limitar.",
      },
      {
        id: "wera-8100-sb-6",
        quantity: 1,
        whyPt: "Zyklop Speed 3/8″: sockets 8-19 mm e o volante que gira como berbequim.",
      },
      {
        id: "wera-8784-b1",
        quantity: 1,
        whyPt: "A redução 3/8″ → 1/4″: os bits do 397 passam a trabalhar na Zyklop.",
      },
      {
        id: "bahco-9031p",
        quantity: 1,
        whyPt:
          "Ajustável ERGO até 39 mm com mandíbula reversível: porcas até 1¼″ sem chave de tubo.",
      },
      {
        id: "knipex-cobra-250",
        quantity: 1,
        whyPt: "O grip médio: tubo e redondo auto-bloqueantes sem escorregar.",
      },
      {
        id: "knipex-pliers-wrench-250",
        quantity: 1,
        whyPt: "O grip forte: porcas até 52 mm apertadas como chave fixa, sem marca.",
      },
      {
        id: "knipex-13-96-200",
        quantity: 1,
        whyPt: "Instalador de seis funções: descarna, crimpa, corta cabo e aperta num só alicate.",
      },
      {
        id: "tajima-l25-50e1-eur",
        quantity: 1,
        whyPt: "Fita Classe 1 com saída de 2,4 m: a medida que não se discute.",
      },
      {
        id: "olfa-xh-1",
        quantity: 1,
        whyPt: "X-ato 25 mm extra robusto: embalagens, proteções e chapa fina.",
      },
      {
        id: "bahco-325-hacksaw",
        quantity: 1,
        whyPt: "Serrote de ferro 300 mm com lâmina Sandflex: calha, tubo e perfil saem limpos.",
      },
      {
        id: "tajima-optima-level",
        quantity: 1,
        whyPt: "Nível curto de alumínio com furos em V: alinhar sem desmontar o banco.",
      },
    ],
    notIncludedPt: [
      "Máquinas Makita (adiciona a mala de máquinas)",
      "Escadote baby light (fornecido à parte)",
      "Jogos VDE dedicados (ver a mala eletricidade VDE)",
    ],
    limitationsPt:
      "EM SOURCING: martelo, busca polos e fita isoladora entram assim que a marca estiver homologada. Aperto pesado acima de 25 N·m pede a mala de máquinas.",
  },
  {
    id: "mala-maquinas-makita",
    format: "mala",
    trade: "Máquinas Makita · add-on",
    jp: "電動 · mala de máquinas",
    tier: "Pro",
    title: "Fura e parte + berbequim + impacto: 2 baterias de 5,0 Ah e carregador",
    conceptPt:
      "O add-on que liga a qualquer mala por profissão: rotativa SDS de 24 mm para furar e partir, o conjunto LXT com berbequim percussão e impacto, e a energia para o dia inteiro.",
    dayPt:
      "Duas máquinas na mala e nenhuma na parede: a DHR243Z fura e parte betão até 24 mm e cinzela rasgos com o set SDS; o conjunto DLX2549TJ traz o berbequim de percussão DHP492 para bucha e a impacto DTD173 para o parafuso teimoso, com duas baterias BL1850B de 5,0 Ah e o carregador DC18RC a gerir a rotação de energia. As brocas multimaterial e o set de metal HSS cobrem madeira, ferro e alvenaria; as pontas Impact Gold ficam na impacto, os Ryujin ficam na mala 397.",
    pieces: [
      {
        id: "makita-dhr243z",
        quantity: 1,
        whyPt: "Fura e parte betão até 24 mm e cinzela: a média e leve que pediste para parede.",
      },
      {
        id: "makita-dlx2549tj",
        quantity: 1,
        whyPt:
          "Berbequim percussão DHP492 + impacto DTD173 com 2 baterias BL1850B de 5,0 Ah e carregador DC18RC.",
      },
      {
        id: "makita-b-64674",
        quantity: 1,
        whyPt: "Brocas e cinzéis SDS-Plus: o cinzel da lista vem aqui, com as brocas de betão.",
      },
      {
        id: "makita-d-30477",
        quantity: 1,
        whyPt: "Brocas multimaterial para madeira, metal e alvenaria num estojo.",
      },
      {
        id: "makita-d-78352",
        quantity: 1,
        whyPt: "Dezanove brocas de metal HSS-GS: o ferro da bancada e da chapa.",
      },
      {
        id: "makita-b-62000",
        quantity: 1,
        whyPt: "Pontas Impact Gold de torsão para ficarem na impacto; os Ryujin ficam na mala 397.",
      },
    ],
    notIncludedPt: [
      "Baterias extra acima das duas incluídas no conjunto DLX",
      "Escada e andaime (fora do catálogo)",
    ],
    limitationsPt:
      "A rotativa DHR243Z é corpo Z: as baterias e o carregador vêm no conjunto DLX2549TJ. Betão até 24 mm; para aberturas maiores, máquina dedicada.",
  },
  {
    id: "mala-avac",
    format: "mala",
    trade: "AVAC & frigorífico",
    jp: "空調 · mala avac",
    tier: "Pro",
    title: "Imperiais, porta-porcas e wobble: a mala do frigorífico e da bomba de calor",
    conceptPt:
      "Chaves imperiais com catraca, porta-porcas magnéticos e o wobble que trabalha em ângulo: a camada AVAC por cima da mala 397, com canalização incluída.",
    dayPt:
      "O frigorífico vive em polegadas e a bomba de calor em espaço apertado: o Joker Imperial aperta 3/8 a 3/4 com retorno de 30°, os porta-porcas magnéticos seguram a porca até à última volta e o wobble 3/8″ chega ao terminal inclinado. A ajustável extra-larga abre acima de 1″ nas uniões antigas, a Cobra segura o redondo e o prumo auto-retrátil alinha o suporte sozinho. O raspador entrega o equipamento limpo à entrega.",
    pieces: [
      {
        id: "wera-joker-8-imperial",
        quantity: 1,
        whyPt:
          "Imperiais 5/16″-3/4″ com catraca 80 dentes: 3/8, 1/2, 5/8 e 3/4 das porcas de abanico.",
      },
      {
        id: "porta-porcas-magneticos-1-4",
        quantity: 1,
        whyPt: "Porta-porcas 7-13 mm magnéticos: a porca fica na ponta em montagem suspensa.",
      },
      {
        id: "wera-8794-b",
        quantity: 1,
        whyPt: "Wobble 3/8″ para o parafuso que está sempre a 15° do acesso reto.",
      },
      {
        id: "bahco-9033",
        quantity: 1,
        whyPt: "Ajustável de abertura extra larga: uniões acima de 1″/40 mm resolvem-se aqui.",
      },
      {
        id: "bahco-9031p",
        quantity: 1,
        whyPt: "Ajustável média até 39 mm: as uniões de 1″ e 1¼″ do lado pequeno.",
      },
      {
        id: "knipex-cobra-250",
        quantity: 1,
        whyPt: "O tubo e o redondo agarram-se auto-bloqueantes, sem marcar a pintura.",
      },
      {
        id: "tajima-pzb300",
        quantity: 1,
        whyPt: "Prumo auto-retrátil: alinhar o suporte interior sem segunda pessoa.",
      },
      {
        id: "olfa-scr-l",
        quantity: 1,
        whyPt: "Raspador inox 60 mm: adesivos e restos saem antes da entrega.",
      },
    ],
    notIncludedPt: [
      "Máquinas Makita (adiciona a mala de máquinas)",
      "Bombas de vácuo, manómetros e azoto (fora do catálogo)",
    ],
    limitationsPt:
      "EM SOURCING: busca polos para o lado elétrico antes de abrir o circuito. Trabalho de chapa profundo pede os +100 mm da mala 397.",
  },
  {
    id: "mala-canalizacao",
    format: "mala",
    trade: "Canalização",
    jp: "配管 · mala canalização",
    tier: "Pro",
    title: "Aberturas grandes, grip forte e o resgate do parafuso morto",
    conceptPt:
      "A mala de canalização: chaves com abertura para uniões de 1″ e acima, o grip Knipex que segura redondo sem marcar e o resgate do parafuso morto, sem virar oficina. O duo básico do ofício vive no pack canalizador; esta mala acrescenta o resto.",
    dayPt:
      "A canalização resolve-se com abertura e grip: a ajustável extra-larga abre acima de 1″/40 mm nas uniões antigas, a Pliers Wrench aperta fittings cromados como chave fixa e a Cobra segura o tubo. Quando o parafuso da flange está morto, o Wanidora morde-o e solta-o. Fita, X-ato e raspador fecham o dia; o serrote de ferro corta tubo e calha rente à parede.",
    pieces: [
      {
        id: "bahco-9033",
        quantity: 1,
        whyPt: "Abertura extra larga até 46 mm: as uniões de 1″ e acima ficam cobertas.",
      },
      {
        id: "knipex-cobra-250",
        quantity: 1,
        whyPt: "Grip forte auto-bloqueante em tubo, porca e redondo.",
      },
      {
        id: "knipex-pliers-wrench-250",
        quantity: 1,
        whyPt: "Mordentes paralelos até 52 mm: fittings cromados apertados sem marca.",
      },
      {
        id: "anex-3980-2-100",
        quantity: 1,
        whyPt: "Wanidora: morder o parafuso de cabeça destruída na flange e soltá-lo.",
      },
      {
        id: "tajima-l25-50e1-eur",
        quantity: 1,
        whyPt: "Fita Classe 1: a medida antes do corte não se discute.",
      },
      {
        id: "bahco-325-hacksaw",
        quantity: 1,
        whyPt: "Serrote de ferro com montagem a 55°: cortar tubo e calha rente à parede.",
      },
      { id: "olfa-l5", quantity: 1, whyPt: "Corte de 18 mm para juntas, embalagens e proteções." },
    ],
    notIncludedPt: [
      "Máquinas Makita (adiciona a mala de máquinas)",
      "Máquina de soldar e pressómetros (fora do catálogo)",
    ],
    limitationsPt:
      "EM SOURCING: martelo e chaves de canalização compactas dedicadas (tipo SVR) em estudo com o fabricante. Aperto acima de 46 mm de abertura pede chave de tubos dedicada.",
  },
  {
    id: "mala-eletricidade-vde",
    format: "mala",
    trade: "Eletricidade · só VDE",
    jp: "電設 · mala VDE",
    tier: "Pro",
    title: "A cadeia 1000 V completa: só ferramenta certificada, sem atalhos",
    conceptPt:
      "Esta mala é só para VDE: cada peça isolada é ferramenta completa certificada IEC 60900. O que não é isolado não entra, porque bit isolado em porta-bits comum não é certificado.",
    dayPt:
      "Do quadro ao borne: o instalador de seis funções que descarna e crimpa, o corte de alta alavanca para fio piano, a MEGADORA isolada para o aperto direto e a slim isolada ANEX para o borne fundo. Os bits AZM cobrem a vizinhança de tensão em máquinas até 7,2 V, pela regra e não ao lado dela. Quando o desligamento está confirmado, as máquinas Makita juntam-se pela mala de máquinas.",
    pieces: [
      {
        id: "anex-azm-2100",
        quantity: 1,
        whyPt: "Bit isolado PH2×100, ensaio a 10 kV: o alcance VDE em comprimento isolado.",
      },
      {
        id: "anex-azm-2150",
        quantity: 1,
        whyPt:
          "E o PH2×150 para os disjuntores do fundo: comprimento isolado em vez de extensão normal.",
      },
      {
        id: "knipex-13-96-200",
        quantity: 1,
        whyPt: "Seis funções em 200 mm 1000 V: descarna, crimpa e corta cabo até Ø15 mm.",
      },
      {
        id: "knipex-74-06-200",
        quantity: 1,
        whyPt: "Corte de alta alavanca VDE: fio piano de 2,5 mm isolado a sério.",
      },
      {
        id: "vessel-960-ph2-100",
        quantity: 1,
        whyPt: "MEGADORA Insulated PH2: o aperto direto sob certificação, sem porta-bits.",
      },
      {
        id: "vessel-200-ph2-100",
        quantity: 1,
        whyPt:
          "Ball Grip isolada PH2 para o aperto em série: 1000 V com a ergonomia que a mão não cansa.",
      },
      {
        id: "anex-7920",
        quantity: 1,
        whyPt: "Chave slim isolada +2×100: bornes fundos no quadro cheio.",
      },
      {
        id: "anex-azm-2698",
        quantity: 1,
        whyPt: "Bit isolado +2/−6 1000 V: o consumível do lado elétrico em máquinas até 7,2 V.",
      },
      {
        id: "anex-azm-1598",
        quantity: 1,
        whyPt: "E o +1/−5 para o parafuso pequeno: mesmo isolamento, perfil menor.",
      },
    ],
    notIncludedPt: [
      "Máquinas Makita (adiciona a mala de máquinas quando o desligamento está confirmado)",
      "Multímetro, luvas e EPI isolante (fora do catálogo)",
    ],
    limitationsPt:
      "EM SOURCING: busca polos, fita isoladora e extensão de bits isolada 1000 V. Bits AZM montados em porta-bits comum não são ferramenta certificada: sob tensão, conjunto VDE completo.",
  },
  {
    id: "mala-manutencao",
    format: "mala",
    trade: "Manutenção geral",
    jp: "整備 · mala manutenção",
    tier: "Pro",
    title: "28 perfis, 16 bits e o resgate: cross-bit com contagem mínima",
    conceptPt:
      "A mala geral sem VDE: dois roquetes cobrem quarenta e quatro perfis diferentes, o impacto manual solta o travado e a extração recupera o danificado.",
    dayPt:
      "O técnico nunca sabe o que encontra: o MiniSta72 cobre vinte e oito perfis num estojo, o TD6816MG da VESSEL acrescenta dezesseis bits com roquete de 72 dentes e o Quick Ball trata do resto. Parafuso preso sai no impacto manual 3/8″; parafuso com offset por baixo do perfil sai no AOA-17 a 230 N·m; cabeça destruída cai ao Wanidora ou ao conjunto de extração ANH. O Cobra segura o que é redondo e fecha o dia sem abrir segunda caixa.",
    pieces: [
      {
        id: "anex-307-s1",
        quantity: 1,
        whyPt: "MiniSta72: vinte e oito perfis, holder magnético e sockets num estojo único.",
      },
      {
        id: "vessel-td6816mg",
        quantity: 1,
        whyPt: "Roquete de 72 dentes com 16 bits: a variedade de cabeças na mão, sem caixa aberta.",
      },
      {
        id: "anex-1902",
        quantity: 1,
        whyPt: "Impacto manual 3/8″: o parafuso preso solta-se a martelo, sem compressora.",
      },
      {
        id: "anex-aoa-17s1",
        quantity: 1,
        whyPt: "Offset com sockets H8-H21 a 230 N·m: aperta por baixo do perfil onde nada entra.",
      },
      {
        id: "anex-anh-s3",
        quantity: 1,
        whyPt:
          "Extração M2,5-M8 com peças de substituição: o parafuso danificado não termina o dia.",
      },
      {
        id: "knipex-cobra-250",
        quantity: 1,
        whyPt: "O grip de tudo o que é redondo, sem segunda caixa de alicates.",
      },
      {
        id: "anex-3980-2-100",
        quantity: 1,
        whyPt: "Wanidora para a cabeça que já não tem cruz: morde e roda.",
      },
      {
        id: "vessel-td24",
        quantity: 1,
        whyPt: "Mini roquete fino de 60 dentes: o vaivém rápido dentro de painéis.",
      },
    ],
    notIncludedPt: [
      "Máquinas Makita (adiciona a mala de máquinas)",
      "Binário calibrado e sockets grandes (ver a Zyklop da mala 397)",
    ],
    limitationsPt:
      "Mecânica geral até sockets de 19 mm: porcas grandes e binário controlado pedem o drive 3/8″ dedicado. Bits não isolados nem para impacto de 1/2″.",
  },
  // ── Packs de bits ordenados (dupla ponta preferida) ──────────
  {
    id: "pack-ph2-duplo",
    format: "kit",
    trade: "Bits & aparafusamento",
    jp: "二本立て · pack PH2 duplo",
    tier: "Pro",
    title: "Pack PH2 duplo ×65: dois perfis no mesmo bit",
    conceptPt:
      "PH2 com dupla função em cada bit: +2/+3 Ryujin, reversível PH2/fenda VESSEL e a caixa de dez para reposição. PH2+PH1 num só bit está em sourcing.",
    dayPt:
      "O dia de PH2 sem trocar de estojo: a caixa de dez PH2×65 repõe o consumível sozinho, o duplo +2/+3 Ryujin alterna perfis na mesma haste e a reversível PH2/fenda VESSEL cobre o parafuso misto. Dupla ponta preferida: menos trocas, menos bits na mala.",
    pieces: [
      {
        id: "anex-art-14m-2-65",
        quantity: 1,
        whyPt: "Dez PH2×65 Black Ryujin: a reposição do perfil que se gasta primeiro.",
      },
      {
        id: "anex-arpm-2365",
        quantity: 1,
        whyPt: "Bit duplo +2/+3 Ryujin: dois perfis na mesma haste, impacto 18 V/40 V.",
      },
      {
        id: "vessel-220w-62",
        quantity: 1,
        whyPt: "Reversível PH2/fenda VESSEL: o parafuso misto resolve-se sem mudar de bit.",
      },
      {
        id: "anex-adrs-2065",
        quantity: 1,
        whyPt: "Diamond Ryujin slim PH2×65 para o aperto que escorrega ao íman.",
      },
      {
        id: "anex-abrs5-2065",
        quantity: 1,
        whyPt: "Cinco Black Ryujin slim +2×65: a reposição do perfil slim.",
      },
      {
        id: "anex-ryujin-slim",
        quantity: 1,
        whyPt: "A dupla ponta slim entra no furo embutido onde o bit normal fica pelo caminho.",
      },
    ],
    notIncludedPt: [
      "PH1 impacto (em sourcing com a ANEX)",
      "PH2+PH1 num só bit (em negociação)",
      "Extensões (ver a mala 397)",
    ],
    limitationsPt:
      "Bits de impacto 18 V/40 V; PH1 dedicado ainda não existe na linha impact-ready da ANEX.",
  },
  {
    id: "pack-torx-ordenado",
    format: "kit",
    trade: "Bits & aparafusamento",
    jp: "トルクス · pack torx",
    tier: "Pro",
    title: "Pack Torx ordenado: T15, T20, T25 e T30 sempre na ordem",
    conceptPt:
      "A gama Torx do dia a dia ordenada num único estojo de baixo perfil: T15, T20, T25 e T30 convivem com a gama completa T8H-T40H.",
    dayPt:
      "O Torx não perdoa bit torto: o estojo VESSEL traz a gama T8H-T40H ordenada em baixo perfil, com roquete próprio para apertar sem abrir a caixa à frente do cliente. Os T15, T20, T25 e T30 ficam no sítio, sempre na mesma ordem.",
    pieces: [
      {
        id: "vessel-tx11",
        quantity: 1,
        whyPt: "Estojo de baixo perfil com a gama Torx de segurança T8H-T40H ordenada.",
      },
      {
        id: "vessel-td6808tx",
        quantity: 1,
        whyPt: "Roquete Torx TR de 72 dentes com os bits mais usados: aperto sem abrir o estojo.",
      },
      {
        id: "anex-art-14m-2-65",
        quantity: 1,
        whyPt: "A reposição PH2×65 que acompanha qualquer trabalho Torx na mesma máquina.",
      },
    ],
    notIncludedPt: [
      "Bits Torx de impacto dedicados (em sourcing)",
      "Torx tamper-proof para eletrónica (ver a mala de precisão)",
    ],
    limitationsPt:
      "O estojo TX-11 e o roquete TR são de aperto manual: para impacto, confirmar a classe do bit junto do fabricante.",
  },
  {
    id: "pack-fendas-duplo",
    format: "kit",
    trade: "Bits & aparafusamento",
    jp: "マイナス · pack fendas",
    tier: "Pro",
    title: "Pack fendas com dupla ponta: −6 ao lado do +2",
    conceptPt:
      "Fendas e PH2 na mesma haste: o bit isolado duplo +2/−6 e as ultra-curtas VESSEL cobrem o parafuso de fenda sem abrir a mala de chaves.",
    dayPt:
      "O parafuso de fenda ainda vive em torneiras, quadros antigos e eletrodomésticos: o bit duplo +2/−6 faz os dois lados na mesma haste, as ultra-curtas VESSEL chegam ao fundo e o reversível PH2/fenda fecha o trabalho.",
    pieces: [
      {
        id: "anex-azm-2698",
        quantity: 1,
        whyPt: "Bit duplo isolado +2/−6×98: os dois lados da fenda comum e do PH2 num bit só.",
      },
      {
        id: "vessel-tdbs21",
        quantity: 1,
        whyPt: "Cinco bits ultra-curtos PH/SL de 18 mm: fenda e cruz rente ao painel.",
      },
      {
        id: "vessel-220w-3",
        quantity: 1,
        whyPt: "Três bits combi 110 mm PH/SL/PZ para os parafusos longos do dia.",
      },
    ],
    notIncludedPt: [
      "Fendas de impacto dedicadas (em sourcing)",
      "Chaves de fenda com punho (ver os Ball Grip VESSEL)",
    ],
    limitationsPt:
      "O bit AZM é isolado 1000 V com máquinas até 7,2 V; as ultra-curtas não são classe de impacto.",
  },
  // ── Packs básicos por ofício: marcas diversas, contagem mínima ──
  // A regra da casa: uma ferramenta sistema chega onde era preciso uma chave
  // para cada caso — o roquete com porta-bits e sockets 1/4 alcança o canto
  // onde antes se punha uma chave de curto, e a chave de curto não existe
  // aqui. Para escolher bloco a bloco, ver os packs modulares.
  {
    id: "pack-vde-basico",
    format: "kit",
    trade: "Eletricidade · VDE",
    jp: "電設 · VDE básico",
    tier: "Core",
    title: "Pack VDE básico: a cadeia 1000 V de entrada",
    conceptPt:
      "Quatro peças isoladas de três escolas — ANEX, VESSEL e Knipex — para arrancar no quadro sem repetir a mala completa: chave slim, MEGADORA isolada, alicate instalador e o bit duplo pequeno.",
    dayPt:
      "O dia elétrico de entrada, tudo certificado IEC 60900: a slim isolada ANEX chega ao borne fundo, a MEGADORA VESSEL faz o aperto direto sob certificação, o instalador Knipex descarna e crimpa com a mesma marca de 1000 V, e o bit duplo AZM +1/−5 cobre o parafuso pequeno em máquinas até 7,2 V. Cada peça é ferramenta completa isolada: bit isolado em porta-bits comum não é certificado. Quando o volume de trabalho cresce, a mala eletricidade VDE acrescenta o 74-06, os AZM compridos e o Ball Grip de série.",
    pieces: [
      {
        id: "anex-7920",
        quantity: 1,
        whyPt: "Chave slim isolada +2×100: bornes fundos no quadro cheio.",
      },
      {
        id: "vessel-960-ph2-100",
        quantity: 1,
        whyPt: "MEGADORA Insulated PH2×100: aperto direto 1000 V, sem porta-bits.",
      },
      {
        id: "knipex-13-96-200",
        quantity: 1,
        whyPt:
          "Instalador de seis funções 1000 V: descarna, crimpa e corta cabo até Ø15 mm.",
      },
      {
        id: "anex-azm-1598",
        quantity: 1,
        whyPt: "Bit duplo isolado +1/−5: o parafuso pequeno do lado elétrico, ensaio a 10 kV.",
      },
    ],
    notIncludedPt: [
      "Corte de alta alavanca VDE e bits AZM compridos (ver a mala eletricidade VDE)",
      "Detector de tensão, luvas e EPI (fora do catálogo)",
      "Máquinas acima de 7,2 V com bits AZM",
    ],
    limitationsPt:
      "Bits AZM em porta-bits comum não são ferramenta certificada: sob tensão, cada peça isolada completa. Sem desligamento confirmado, nada se toca.",
  },
  {
    id: "pack-roquete-basico",
    format: "kit",
    trade: "Roquetes & aperto",
    jp: "ラチェット · roquete básico",
    tier: "Core",
    title: "Pack roquete básico: duas escolas, contagem mínima",
    conceptPt:
      "O par de entrada de duas escolas — ANEX e VESSEL: o roquete plano de baixo perfil com dez bits ordenados e o T-handle que aplica força firme onde o punho normal não chega. Sem repetir o que a mala 397 já traz.",
    dayPt:
      "O dia de aperto manual sem duplicar a mala 397: o roquete plano VESSEL traz dez bits PH, fenda e HEX ordenados com o perfil baixo que entra onde roquete nenhum entra; o T-handle 370 aplica mais binário no mesmo movimento e guarda os bits curtos no próprio corpo; as ultra-curtas de 18 mm fecham o aperto rente ao painel. Somos mais inteligentes que múltiplas ferramentas: um roquete com bits na mão substitui a gaveta de chaves de curto.",
    pieces: [
      {
        id: "vessel-td70",
        quantity: 1,
        whyPt:
          "Roquete plano de baixo perfil com 10 bits PH/SL/HEX ordenados: variedade e acesso num só.",
      },
      {
        id: "anex-370",
        quantity: 1,
        whyPt: "T-handle roquete: mais força no mesmo movimento, bits curtos guardados no corpo.",
      },
      {
        id: "vessel-tdbs21",
        quantity: 1,
        whyPt: "Cinco bits ultra-curtos PH/SL de 18 mm: o aperto rente ao painel.",
      },
    ],
    notIncludedPt: [
      "Quick Ball 72 e o sistema de lock (ver a mala 397)",
      "Sockets e binário calibrado (ver a Zyklop da mala 397)",
    ],
    limitationsPt:
      "Bits 6,35 mm de aperto manual, não classe de impacto. Para sockets e aperto pesado, ver a Zyklop 3/8″ da mala 397.",
  },
  {
    id: "pack-canalizador-basico",
    format: "kit",
    trade: "Canalização",
    jp: "配管 · pack canalizador",
    tier: "Core",
    title: "Pack canalizador básico: grip, ajustável, medida e entrega",
    conceptPt:
      "O quarteto de entrada do canalizador, de quatro marcas europeias: a Cobra KNIPEX para o redondo, a ajustável ERGO BAHCO para as porcas, a fita TAJIMA para medir antes do corte e o raspador OLFA para a entrega limpa.",
    dayPt:
      "O dia de canalização de entrada: a Cobra agarra o tubo e a porca redonda sem marcar, a ajustável ERGO fecha as porcas de 1″ e 1¼″ com mandíbula reversível, a fita Classe 1 decide o corte e o raspador inox entrega o equipamento sem adesivos. Quatro peças, quatro marcas, zero redundância: quando o dia pede uniões acima de 40 mm, o resgate do parafuso morto e o corte rente, a mala canalização acrescenta o resto.",
    pieces: [
      {
        id: "knipex-cobra-250",
        quantity: 1,
        whyPt: "Agarra tubo e porca redonda auto-bloqueante: dentes ~61 HRC sem escorregar.",
      },
      {
        id: "bahco-9031p",
        quantity: 1,
        whyPt: "Ajustável ERGO com mandíbula reversível até 39 mm: as porcas de 1″ e 1¼″ do dia.",
      },
      {
        id: "tajima-l25-50e1-eur",
        quantity: 1,
        whyPt: "Fita Classe 1 com saída de 2,4 m: a medida antes do corte não se discute.",
      },
      {
        id: "olfa-scr-l",
        quantity: 1,
        whyPt: "Raspador inox 60 mm: adesivos e restos saem antes da entrega.",
      },
    ],
    notIncludedPt: [
      "Ajustável extra-larga acima de 40 mm e Pliers Wrench (ver a mala canalização)",
      "Máquinas (adiciona a mala de máquinas Makita)",
    ],
    limitationsPt:
      "Abertura até 39 mm: para uniões acima disso, ver a ajustável extra-larga da mala canalização.",
  },
];

export function kitById(id: string) {
  return REJENDARI_KITS.find((kit) => kit.id === id);
}
