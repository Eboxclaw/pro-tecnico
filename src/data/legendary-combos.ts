/**
 * Legendary Combos — combinações editoriais que cruzam marcas quando a
 * mistura supera a marca isolada. Não são conjuntos fechados à venda:
 * cada peça liga à ficha da referência curada.
 */
export type LegendaryCombo = {
  name: string;
  jp: string;
  work: string;
  desc: string;
  ids: string[];
};

export const LEGENDARY_COMBOS: LegendaryCombo[] = [
  {
    name: "Impact Beast",
    jp: "衝撃 · impacto",
    work: "Parafuso pesado",
    desc: "Aparafusadora de impacto 18 V de 180 N·m com bits Black Ryujin HRC 62,5 em Cr-Mo-V, dimensionados pela ANEX para 18 V e 40 V.",
    ids: ["makita-dtd172z", "anex-abrs5-2065", "anex-abrs5-01"],
  },
  {
    name: "Zyklop Speed",
    jp: "速さ · velocidade",
    work: "Montagem · mecânica",
    desc: "O kit Zyklop Speed 3/8″ de 29 peças — catraca de 72 dentes, sockets 8–19 mm, adaptador de bits — e a 838 RA-R M para o aperto manual.",
    ids: ["wera-8100-sb-6", "wera-838-ra-r-m"],
  },
  {
    name: "Japanese Impact",
    jp: "龍靭 · made in Japan",
    work: "Chapa · madeira · montagem",
    desc: "Bits Ryujin em Cr-Mo-V fabricados no Japão, especificados pela ANEX para máquinas de 18 V e 40 V.",
    ids: ["makita-dtd172z", "anex-ryujin-artm5-01", "anex-ryujin-slim"],
  },
  {
    name: "Ball Grip Hybrid",
    jp: "差替 · intercambiável",
    work: "Manual universal",
    desc: "Ergonomia japonesa Ball Grip com tang-through a aceitar o universo inteiro de bits 1/4″, com Ryujin de série.",
    ids: ["vessel-230w", "anex-ryujin-artm5-01", "anex-abrs5-2065"],
  },
  {
    name: "Ratchet Driver",
    jp: "ラチェット · roquete",
    work: "Manutenção · AVAC",
    desc: "A 838 RA-R L de movimento curto, o Gandora 431 com bits guardados no punho e bits longos para acesso através de painéis.",
    ids: ["wera-838-ra-r-l", "anex-431", "vessel-tdbs23"],
  },
  {
    name: "Pocket Mechanic",
    jp: "携帯 · bolso",
    work: "Assistência",
    desc: "Catraca compacta de bolso 52, a versão com dez bits incluídos e porta-porcas magnéticos: um sistema de assistência num cinto.",
    ids: ["anex-525", "anex-525-10b", "porta-porcas-magneticos-1-4"],
  },
  {
    name: "Electrician 1000",
    jp: "絶縁 · 1000 V",
    work: "Elétrico",
    desc: "Bits AZM isolados 1000 V, chave slim isolada VESSEL, corte de alta alavanca ~64 HRC e o alicate de seis funções 1000 V: o circuito completo do eletricista.",
    ids: ["anex-azm-2698", "vessel-960-ph2-100", "knipex-74-06-200", "knipex-13-96-200"],
  },
  {
    name: "Drywall Finish",
    jp: "石膏ボード · pladur",
    work: "Pladur · acabamento",
    desc: "Serrote de ponta para aberturas, raspador inox para juntas e o catch&stop ANEX que segura o parafuso de gesso: montar pladur sem parafuso no chão.",
    ids: ["tajima-ng165js-k1", "olfa-scr-l", "anex-abs-2065"],
  },
  {
    name: "Slim Electrician",
    jp: "スリム · slim",
    work: "Quadros · bornes fundos",
    desc: "O roquete VDE com dezassete lâminas ensaiadas a 10 kV, a chave slim isolada ANEX para bornes fundos e o bit +1/−5 para o parafuso pequeno: o sistema slim do quadro cheio.",
    ids: ["wera-kompakt-vde-17-ra-1", "anex-7920", "anex-azm-1598"],
  },
  {
    name: "HVAC Grip",
    jp: "設備 · AVAC",
    work: "AVAC · canalização",
    desc: "Cobra auto-bloqueante de dentes ~61 HRC, Pliers Wrench que não marca fittings e a 9031P com mandíbula para tubo.",
    ids: ["knipex-cobra-250", "knipex-pliers-wrench-250", "bahco-9031p"],
  },
  {
    name: "Broken Screw",
    jp: "破損ネジ · resgate",
    work: "Parafuso danificado",
    desc: "Wanidora para morder a cabeça destruída, impacto manual 3/8″ para soltar e Ball Grip tang-through para terminar o trabalho.",
    ids: ["anex-3980-2-100", "anex-1902", "vessel-230w"],
  },
  {
    name: "Electronics Bench",
    jp: "電子 · bancada",
    work: "Eletrónica",
    desc: "Trinta e seis bits de precisão, o roquete Ball Ratchet de bancada e o extrator manual para parafusos +0 danificados.",
    ids: ["vessel-9836", "vessel-2200-ph2-100", "anex-3610-n"],
  },
  {
    name: "EV High-Voltage",
    jp: "電気自動車 · VE",
    work: "Veículos elétricos",
    desc: "Bits 1000 V AZM, adaptadores de binário ATA e a chave USB isolada: a cadeia de aperto calibrada para HV.",
    ids: ["anex-azm-2698", "anex-ata-s1", "vessel-220usb-s1eb"],
  },
];
