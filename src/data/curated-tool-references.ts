export type CuratedToolReference = {
  id: string;
  brand: string;
  model: string;
  namePt: string;
  japanese: string;
  categoryPt: string;
  notePt: string;
  badge: string;
  referenceUrl: string;
  imageUrl: string;
  imageAlt: string;
};

export const CURATED_TOOL_REFERENCES: CuratedToolReference[] = [
  {
    id: "vessel-220w",
    brand: "VESSEL",
    model: "220W",
    namePt: "Ball Grip com bit substituível",
    japanese: "ボールグリップ",
    categoryPt: "Aparafusamento",
    notePt: "Punho de bola compacto para bits hexagonais de 6,35 mm. Uma referência simples para mostrar a lógica japonesa de ergonomia + modularidade.",
    badge: "Japan Core",
    referenceUrl: "https://www.vessel.co.jp/english/product/screwdriver/125344",
    imageUrl: "https://www.vessel.co.jp/userfiles/handtools/220W_d1.jpg",
    imageAlt: "VESSEL 220W Ball Grip",
  },
  {
    id: "anex-aoa-17s1",
    brand: "ANEX",
    model: "AOA-17S1",
    namePt: "Adaptador offset 17 mm + sockets",
    japanese: "オフセットアダプター",
    categoryPt: "Problem Solver",
    notePt: "Sistema offset para apertos em zonas apertadas. É exatamente o tipo de mecanismo engenhoso que deve viver no REJENDARI LAB.",
    badge: "REJENDARI LAB",
    referenceUrl: "https://www.anextool.co.jp/item/aoa-17s1/",
    imageUrl: "https://www.anextool.co.jp/wp-content/uploads/AOA-17S1_2.jpg",
    imageAlt: "ANEX AOA-17S1 offset adapter socket set",
  },
  {
    id: "olfa-xh-1",
    brand: "OLFA",
    model: "XH-1",
    namePt: "Cutter extra heavy-duty 25 mm",
    japanese: "大型カッター",
    categoryPt: "Corte",
    notePt: "Cutter robusto da série X-design para lâmina de 25 mm. Já apareceu repetidamente na nossa seleção de facas e corte profissional.",
    badge: "Japan Core",
    referenceUrl: "https://www.olfa.co.jp/en/products/370.html",
    imageUrl: "https://www.olfa.co.jp/en/wordpress/wp-content/uploads/1586830258XH-1_1-1.jpg",
    imageAlt: "OLFA XH-1 cutter",
  },
  {
    id: "tajima-lc650",
    brand: "TAJIMA",
    model: "LC-650BL",
    namePt: "H-Blade Hard Cutter",
    japanese: "H刃 ハードカッター",
    categoryPt: "Corte · Obra",
    notePt: "Uma referência real da TAJIMA para corte pesado. Faz sentido ao lado de medição, marcação e ferramentas de obra, não apenas como mais um cutter.",
    badge: "Japan Core",
    referenceUrl: "https://jpn.tajimatool.co.jp/product/4975364020871",
    imageUrl: "https://jpn-assets.tajimatool.co.jp/img/4975364020871_l.jpg?v=1736114915",
    imageAlt: "TAJIMA LC-650BL H blade hard cutter",
  },
  {
    id: "engineer-pz58",
    brand: "ENGINEER",
    model: "PZ-58",
    namePt: "Neji-Saurus Screw Removal Pliers GT",
    japanese: "ネジザウルス",
    categoryPt: "Extração · Alicates",
    notePt: "Alicate de extração de parafusos danificados. Um dos exemplos mais claros da filosofia 'ferramenta que resolve um problema específico'.",
    badge: "Problem Solver",
    referenceUrl: "https://www.engineertools-jp.com/product-page/pz-58-screw-removal-pliers-gt",
    imageUrl: "https://static.wixstatic.com/media/104650_76eea0311218458d9f1d6938daefd876~mv2.jpg/v1/fill/w_980%2Ch_980%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/104650_76eea0311218458d9f1d6938daefd876~mv2.jpg",
    imageAlt: "ENGINEER PZ-58 screw removal pliers",
  },
  {
    id: "wera-838-ra-r-l",
    brand: "WERA",
    model: "838 RA-R L",
    namePt: "Porta-bits com roquete e Rapidaptor",
    japanese: "ラチェットドライバー",
    categoryPt: "Global Special · LAB",
    notePt: "Não é japonesa, mas foi uma das ferramentas especiais mais discutidas: roquete integrado no punho, Rapidaptor e formato muito compacto.",
    badge: "Global Special",
    referenceUrl: "https://www.wera.de/en/tools/838-ra-r-l-bitholding-screwdriver-with-ratchet-functionality-1-4",
    imageUrl: "https://www.wera.de/prodimg/218x218/838_ra-r_l.webp",
    imageAlt: "Wera 838 RA-R L ratcheting bit holder",
  },
  {
    id: "irega-99xs-4",
    brand: "IREGA",
    model: "99XS 4”",
    namePt: "Chave ajustável de maxilas extra-finas",
    japanese: "薄口モンキーレンチ",
    categoryPt: "Global Special · AVAC",
    notePt: "Uma exceção europeia coerente com o trabalho real: maxilas finas para acesso onde uma chave ajustável convencional é demasiado grossa.",
    badge: "Global Special",
    referenceUrl: "https://www.irega.es/99xs_109",
    imageUrl: "https://www.irega.es/Imagenes/Blog/IREGA_99XS-4_SP.jpg",
    imageAlt: "IREGA 99XS 4 inch extra slim adjustable wrench",
  },
];

export const REFERENCE_QUEUE = [
  "Ko-ken Z-Series / 3725Z",
  "Wiha 47169",
  "Bahco 9031-T",
  "Makita DTD173 / DTD172",
  "ANEX Ginjo",
  "VESSEL 220USBC",
  "TAJIMA GS Lock",
];
