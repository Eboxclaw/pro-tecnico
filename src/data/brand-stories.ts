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

export const BRAND_STORIES: BrandStory[] = [
  {
    slug: "ANEX",
    name: "ANEX",
    jp: "締結工具",
    specialty: "Acesso difícil · bits · precisão · eletricidade",
    headline: "Quando o parafuso está no sítio errado, a ferramenta tem de pensar diferente.",
    story:
      "Na seleção REJENDARI, a ANEX representa soluções de acesso: offset adapters, mini roquetes, bits slim e ferramentas para trabalhar onde um punho ou uma máquina normal já não entram.",
    whyPt:
      "É uma marca especialmente interessante para instalação, manutenção, AVAC e eletricidade porque transforma limitações de espaço em produtos muito específicos.",
    sourceUrl: "https://www.anextool.co.jp/item_post/",
    sourceLabel: "ANEX · catálogo oficial",
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
      "A VESSEL junta chaves manuais, roquetes compactos e assistência elétrica sem abandonar a lógica do aperto à mão. A família 220USB resume bem isso: velocidade para avançar, controlo manual para terminar.",
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
      "LOBSTER / LOBTEX entra para cobrir chaves ajustáveis, rebitagem e ferramenta de manutenção. A UM-XG é um bom exemplo: uma chave ajustável com mecanismos desenhados para reduzir folga e melhorar o contacto.",
    whyPt:
      "É importante para equilibrar a loja: não queremos uma seleção japonesa feita só de aparafusamento e corte.",
    sourceUrl: "https://www.lobtex.co.jp/",
    sourceLabel: "LOBTEX",
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
];

export const BRAND_STORY_MAP = Object.fromEntries(BRAND_STORIES.map((brand) => [brand.slug, brand])) as Record<string, BrandStory>;
