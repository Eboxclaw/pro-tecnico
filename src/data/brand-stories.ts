import { SHOWCASED_BRANDS, type ShowcasedBrand } from "@/data/curated-tool-references";

export type BrandStory = {
  slug: string;
  name: string;
  jp: string;
  specialty: string;
  headline: string;
  story: string;
  whyPt: string;
  sourceUrl?: string;
  sourceLabel?: string;
};

const ALL_BRAND_STORIES: BrandStory[] = [
  {
    slug: "ANEX",
    name: "ANEX",
    jp: "締結工具",
    specialty: "Acesso difícil · bits · precisão · eletricidade",
    headline: "Quando o parafuso está no sítio errado, a ferramenta tem de pensar diferente.",
    story:
      "Na seleção REJENDARI, a ANEX representa sistemas compactos: Quick Ball 72, MiniSta72, torque adapters M3-M6, conversões 3/8″↔1/4″, bits slim, bits isolados 1000 V e ferramentas offset para trabalhar onde um punho normal já não entra.",
    whyPt:
      "É uma preferência editorial da REJENDARI pela forma como resolve limitações de espaço e de aperto. Esta seleção é independente; não existe parceria ou representação oficial da ANEX.",
    sourceUrl: "https://my.ebook5.net/anextool_catalog/k9dGJL/",
    sourceLabel: "ANEX · catálogo do fabricante 2026",
  },
  {
    slug: "MAKITA",
    name: "MAKITA",
    jp: "電動工具",
    specialty: "Máquinas profissionais · plataforma LXT 18 V",
    headline: "Uma plataforma que só faz sentido se as máquinas escolhidas fizerem sentido cá.",
    story:
      "A Makita entra na REJENDARI pela plataforma profissional 18 V e não por volume de catálogo. Damos prioridade a referências que estejam documentadas para Portugal e que encaixem em trabalho real de instalação, manutenção e obra.",
    whyPt:
      "No arranque, a prioridade é LXT 18 V. Evitamos dispersar stock por plataformas pequenas quando o profissional português procura sobretudo compatibilidade, autonomia e continuidade de bateria.",
    sourceUrl: "https://www.makita.pt/",
    sourceLabel: "Makita Portugal",
  },
  {
    slug: "VESSEL",
    name: "VESSEL",
    jp: "ドライバー",
    specialty: "Ball Grip · chaves · mini roquetes · precisão",
    headline: "O punho Ball Grip tornou-se uma linguagem própria de aparafusamento.",
    story:
      "A VESSEL junta Ball Grip manual e elétrica, punhos intercambiáveis, ratchet screwdrivers 72 dentes, kits low-profile, bits ultra-curtos, precisão e isolamento VDE. A força da marca está em poder construir um sistema de aperto inteiro sem sair da mesma linguagem de produto.",
    whyPt:
      "É uma das marcas mais completas para construir uma seleção de aparafusamento diferente do catálogo europeu habitual.",
    sourceUrl: "https://www.vessel.co.jp/english/product/screwdriver-search",
    sourceLabel: "VESSEL · screwdrivers",
  },
  {
    slug: "OLFA",
    name: "OLFA",
    jp: "カッター",
    specialty: "Cutters · lâminas · scrapers",
    headline: "A lâmina segmentada começou em Osaka e acabou por se tornar um padrão mundial.",
    story:
      "Yoshio Okada inventou o primeiro cutter de lâmina segmentada em 1956. A OLFA desenvolveu depois uma família enorme de cutters, scrapers e ferramentas de corte com uma filosofia muito consistente: controlo, segurança e lâmina certa para o material.",
    whyPt:
      "Para REJENDARI, OLFA é corte profissional sem precisar de inventar moda: 18 mm, 25 mm, utilitários e scrapers com funções claras.",
    sourceUrl: "https://www.olfa.co.jp/en/birth_of_olfa_cutter.html",
    sourceLabel: "OLFA · história oficial",
  },
  {
    slug: "TAJIMA",
    name: "TAJIMA",
    jp: "測定・切削",
    specialty: "Medição · marcação · corte · obra",
    headline: "Ferramenta de obra japonesa, escolhida em variantes que façam sentido na Europa.",
    story:
      "A TAJIMA é forte em medição, marcação e corte. Na REJENDARI damos prioridade a referências europeias com especificações claras e adequadas ao trabalho profissional em Portugal.",
    whyPt:
      "Na seleção atual destacamos o Driver Cutter DC660 europeu de 25 mm: uma referência de obra direta, fácil de comparar e sem ambiguidades de escala ou unidade.",
    sourceUrl: "https://tajima.ch/",
    sourceLabel: "TAJIMA Europe",
  },
  {
    slug: "KO-KEN",
    name: "KO-KEN",
    jp: "ソケット",
    specialty: "Sockets · roquetes · acessórios drive",
    headline: "Uma marca construída à volta de sockets, não uma marca que também vende sockets.",
    story:
      "A Ko-ken foi fundada em 1946 e desenvolveu a sua identidade como especialista em socket wrenches. A Z-Series leva essa experiência para ferramentas mais compactas, com menor folga e roquetes de movimento leve.",
    whyPt:
      "É o tipo de especialização que procuramos: menos catálogo genérico, mais profundidade onde realmente interessa.",
    sourceUrl: "https://www.koken-tool.co.jp/en/info.html",
    sourceLabel: "Ko-ken · história oficial",
  },
  {
    slug: "FUJIYA",
    name: "FUJIYA",
    jp: "プライヤー",
    specialty: "Alicates · corte · eletricidade",
    headline: "Mais de um século a tratar alicates como produto principal.",
    story:
      "A Fujiya nasceu em 1923 e continua a construir a marca em torno de alicates e nippers. A própria empresa resume a filosofia com a ideia de nunca comprometer a qualidade dos alicates.",
    whyPt:
      "É uma alternativa japonesa séria para eletricidade, corte e grip, especialmente onde queremos mostrar ferramentas que não sejam apenas bits e roquetes.",
    sourceUrl: "https://www.fujiya-kk.com/en/company/",
    sourceLabel: "Fujiya · empresa",
  },
  {
    slug: "TSUNODA",
    name: "TSUNODA / King TTC",
    jp: "燕三条の作業工具",
    specialty: "Alicates · slip joint · water pump · corte",
    headline: "Grip e articulação também merecem engenharia própria.",
    story:
      "A TSUNODA amplia a REJENDARI para alicates slip-joint, water-pump e ferramentas de corte. A seleção privilegia modelos métricos com capacidades e articulações claramente documentadas, incluindo soluções com mordentes em resina para superfícies delicadas.",
    whyPt:
      "É uma marca importante para AVAC, canalização, elétrica e manutenção porque traz variedade real de alicates em vez de tratarmos todo o grip como uma única ferramenta.",
    sourceUrl: "https://tsunoda-japan.com/EN/pliers.html",
    sourceLabel: "TSUNODA · catálogo oficial",
  },
  {
    slug: "TOP",
    name: "TOP KOGYO",
    jp: "トップ工業",
    specialty: "Chaves ajustáveis · roquetes · AVAC · manutenção",
    headline: "Uma das escolas japonesas mais interessantes para chaves ajustáveis.",
    story:
      "TOP KOGYO tem uma gama extensa de chaves ajustáveis e ferramentas de manutenção. Na REJENDARI começamos pela Hyper Monkey ZERO porque ataca diretamente a folga do mordente e oferece variantes de 25 a 43 mm de abertura.",
    whyPt:
      "HM-32 e HM-38 dão-nos duas chaves inglesas japonesas sérias para comparar com LOBTEX: uma mais compacta para manutenção geral e outra com capacidade mais próxima de AVAC e canalização.",
    sourceUrl: "https://www.toptools.co.jp/tools/wrenches-0001_4/",
    sourceLabel: "TOP KOGYO · referência oficial",
  },
  {
    slug: "ENGINEER",
    name: "ENGINEER",
    jp: "精密工具",
    specialty: "Extração · precisão · problem solvers",
    headline: "Ferramentas que existem porque um problema específico precisava de uma resposta.",
    story:
      "ENGINEER entra na seleção sobretudo pela família Neji-Saurus e por ferramentas de precisão. O foco não é ter mais um alicate, mas resolver parafusos danificados, eletrónica e manutenção delicada.",
    whyPt:
      "É exatamente o género de produto que dá personalidade à REJENDARI: pouco genérico, fácil de explicar e útil quando é preciso.",
  },
  {
    slug: "HOZAN",
    name: "HOZAN",
    jp: "精密工具",
    specialty: "Eletrónica · stripping · ESD · precisão",
    headline: "A bancada técnica também merece ferramenta profissional.",
    story:
      "HOZAN amplia a loja para eletrónica, cablagem e precisão. A seleção foca ferramentas de preparação, stripping, crimpagem e trabalho ESD onde a ergonomia e a repetibilidade importam.",
    whyPt:
      "Ajuda a REJENDARI a servir técnicos de eletrónica, manutenção de equipamentos e montagem, não apenas obra e mecânica.",
    sourceUrl: "https://www.hozan.co.jp/E/",
    sourceLabel: "HOZAN",
  },
  {
    slug: "LOBSTER",
    name: "LOBSTER / LOBTEX",
    jp: "作業工具",
    specialty: "Chaves · rebitagem · grip · manutenção",
    headline: "A ferramenta manual japonesa também vive de grip, ajuste e manutenção.",
    story:
      "LOBSTER / LOBTEX entra para cobrir chaves ajustáveis, rebitagem e manutenção. A família UM-XG vai de 150 a 300 mm e combina X-DRIVE com o mecanismo G-LESS para reduzir folga e melhorar o contacto no parafuso ou porca.",
    whyPt:
      "É importante para equilibrar a loja: não queremos uma seleção japonesa feita só de aparafusamento e corte.",
    sourceUrl: "https://www.lobtex.co.jp/",
    sourceLabel: "LOBTEX",
  },
  {
    slug: "NEPROS",
    name: "NEPROS",
    jp: "ネプロス",
    specialty: "Roquetes premium · sockets · mecânica",
    headline: "A linha premium da KTC transforma mecânica em engenharia de detalhe.",
    story:
      "Nepros nasceu dentro da KTC com a ideia de combinar durabilidade, utilização e acabamento. O NBR390A resume a abordagem: 90 dentes, arco de 4°, cabeça mais compacta e equilíbrio revisto.",
    whyPt:
      "Na REJENDARI, Nepros faz sentido como contraponto premium à Ko-ken Z-Series: duas escolas japonesas fortes para quem trabalha diariamente com sockets e roquetes.",
    sourceUrl: "https://ktc.jp/nepros/nbr390a/",
    sourceLabel: "KTC / Nepros · referência oficial",
  },
  {
    slug: "TONE",
    name: "TONE",
    jp: "整備工具",
    specialty: "Sockets · torque · mecânica",
    headline: "Mecânica japonesa com drive conhecido e sockets métricos.",
    story:
      "TONE traz conjuntos de manutenção automóvel e industrial com drives como 3/8″, mas sockets em medidas métricas. É exatamente o equilíbrio que procuramos para Portugal: interface técnica reconhecida, medidas úteis localmente.",
    whyPt:
      "Permite construir kits de mecânica e manutenção sem obrigar o cliente a escolher entre uma linguagem de drive familiar e sockets que não usa.",
    sourceUrl: "https://www.tonetool.co.jp/",
    sourceLabel: "TONE",
  },
  {
    slug: "WERA",
    name: "WERA",
    jp: "トルション",
    specialty: "Bits · torsion · VDE 1000 V · roquetes",
    headline: "Cada bit tem um regime de trabalho, a Wera foi a primeira a tratar isso a sério.",
    story:
      "A Wera construiu a sua reputação em aparafusamento: BiTorsion para montagem geral e repetitiva, Impaktor para impacto forte, TORX HF e Hex-Plus para retenção e geometria, Zyklop e 838 RA-R para roquetes de utilização rápida, e o sistema Kraftform Kompakt VDE com ensaio individual a 10.000 V. Em Wuppertal, a alemanha do aparafusamento.",
    whyPt:
      "É a coluna dorsal do nosso regime de aparafusamento europeu: o melhor bit para cada regime de trabalho, não todos os bits de todas as marcas.",
    sourceUrl: "https://www.wera.de/de/",
    sourceLabel: "Wera · site oficial",
  },
  {
    slug: "KNIPEX",
    name: "KNIPEX",
    jp: "プライヤー",
    specialty: "Alicates · grip · corte · VDE",
    headline: "Um século e meio de Wuppertal dedicado a uma só categoria: alicates.",
    story:
      "A Knipex faz alicates desde 1882 e é hoje a referência mundial da categoria. Na REJENDARI entram pela Cobra auto-bloqueante (~61 HRC nos dentes), pela Pliers Wrench de mordentes paralelos até 52 mm, pelo TwinGrip para parafusos destruídos e pelas versões VDE com arestas a ~64 HRC que cortam fio piano.",
    whyPt:
      "Agarrar e cortar é metade do trabalho de instalação, queremos a melhor escola alemã dessa metade, a par da japonesa.",
    sourceUrl: "https://www.knipex.com/",
    sourceLabel: "Knipex · site oficial",
  },
  {
    slug: "WIHA",
    name: "WIHA",
    jp: "絶縁工具",
    specialty: "VDE 1000 V · slimBits · torque · ESD",
    headline: "O sistema isolado de 6 mm que não é um bit 1/4″, e é melhor assim.",
    story:
      "A Wiha, de Schonach na Floresta Negra, é a casa do sistema elétrico slim: o cabo modular slimVario, as lâminas slimBits de 6 mm ensaiadas individualmente segundo IEC 60900, o TorqueVario-S electric e o speedE!, o primeiro aparafusador assistido com punho isolado. Para a bancada, PicoFinish, pinças ESD e precisão.",
    whyPt:
      "Permite-nos vender duas famílias claramente diferentes, o sistema standard 1/4″ e o sistema isolado 1000 V, e explicar ao cliente exatamente porquê.",
    sourceUrl: "https://www.wiha.com/",
    sourceLabel: "Wiha · site oficial",
  },
  {
    slug: "BAHCO",
    name: "BAHCO",
    jp: "調整工具",
    specialty: "Ajustáveis · AVAC · VDE · aço de liga",
    headline: "A escola sueca da chave ajustável, do aço de liga ao isolamento 1000 V.",
    story:
      "A Bahco tem quase um século e meio de história sueca e continua a fabricar ajustáveis de referência. Na REJENDARI entram pela 9031P com mandíbula reversível para tubo, pela 9033 de abertura extra larga e pela família isolada 8071V-8073V em aço de liga de alto desempenho com ensaio individual a 10 kV.",
    whyPt:
      "É a ponte perfeita entre AVAC e elétrico: ajustáveis genuinamente isoladas e geometrias que a concorrência não replica.",
    sourceUrl: "https://www.bahco.com/",
    sourceLabel: "Bahco · site oficial",
  },
];

/** Só as marcas em vitrina navegam; as histórias de reserva continuam guardadas. */
export const BRAND_STORIES: BrandStory[] = ALL_BRAND_STORIES.filter((brand) =>
  (SHOWCASED_BRANDS as readonly string[]).includes(brand.slug),
);

export const BRAND_STORY_MAP = Object.fromEntries(
  BRAND_STORIES.map((brand) => [brand.slug, brand]),
) as Record<ShowcasedBrand | string, BrandStory>;
