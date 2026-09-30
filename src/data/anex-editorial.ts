export const ANEX_CATALOG_URL = "https://my.ebook5.net/anextool_catalog/k9dGJL/";

export const ANEX_CHAPTERS = [
  {
    id: "access",
    japanese: "到達",
    talePt: "O parafuso está à vista. A máquina não cabe. Antes de aumentar a força, muda o acesso: deslocar o ponto de aperto ou baixar o perfil pode resolver o obstáculo. Confirma o encaixe e o limite de binário de cada adaptador.",
    label: "Chegar onde falta espaço",
    short: "Acesso",
    page: 38,
    printed: "36–40",
    description:
      "Adaptadores offset e ferramentas de perfil baixo para obstáculos que não se resolvem com mais força.",
    ids: ["anex-aoa-17s1", "anex-6102-t", "anex-6103-f", "anex-436"],
  },
  {
    id: "ratchet",
    japanese: "回転",
    talePt: "Há trabalhos em que o movimento disponível é mais pequeno do que a ferramenta. Um roquete permite avançar sem reposicionar continuamente a mão. Escolhe pelo espaço, pelo punho e pelo comprimento de bit admitido.",
    label: "Apertar com movimento curto",
    short: "Roquetes",
    page: 57,
    printed: "55–58",
    description:
      "Quick Ball 72, MiniSta72 e roquetes compactos: escolhe pelo espaço, pelo punho e pelos bits que precisas.",
    ids: ["anex-397-d", "anex-397-h", "anex-431", "anex-307-s1", "anex-525-10b", "anex-370"],
  },
  {
    id: "bits",
    japanese: "龍靭",
    talePt: "Tudo passa por uma pequena superfície de contacto. Diamond procura aderência sem íman; Ryujin oferece formatos e comprimentos para diferentes acessos. Perfil, encaixe e máquina permitida continuam a decidir a escolha.",
    label: "Escolher a ponta certa",
    short: "Bits",
    page: 10,
    printed: "8–13",
    description:
      "A família Ryujin merece uma escolha por perfil, comprimento e encaixe. O nome da série não substitui a compatibilidade.",
    ids: ["anex-adrs-2065", "anex-adsk-2065", "anex-ryujin-artm5-01", "anex-abrs5-01"],
  },
  {
    id: "insulated",
    japanese: "絶縁",
    talePt: "Num quadro, a escolha exige mais do que chegar ao parafuso. Os AZM introduzem isolamento no próprio bit, com aplicações e limites definidos pela ANEX. A classificação do bit não transforma o punho ou a máquina num conjunto certificado.",
    label: "Isolamento com limites claros",
    short: "AZM 1000 V",
    page: 26,
    printed: "24",
    description:
      "Bits isolados AZM de dupla ponta. A recomendação ANEX para máquinas é até 7,2 V; a classificação do bit não certifica todo o conjunto.",
    ids: ["anex-azm-2698", "anex-azm-1598"],
  },
  {
    id: "torque",
    japanese: "締付",
    talePt: "O último aperto merece tanto cuidado como o primeiro. Um adaptador de binário definido ajuda a controlar uma operação repetida. O valor correto é o prescrito pelo equipamento, não uma conclusão tirada apenas do diâmetro do parafuso.",
    label: "Definir o limite de aperto",
    short: "Binário",
    page: 26,
    printed: "24",
    description:
      "Adaptadores com binário definido. Confirma o valor exigido pelo equipamento e a máquina permitida antes de escolher.",
    ids: ["anex-ata-m4", "anex-ata-s1"],
  },
  {
    id: "extract",
    japanese: "修復",
    talePt: "Uma cabeça danificada muda o próximo passo. Em vez de insistir, escolhe um método de extração adequado à dimensão e ao material. Precisão manual e perfuração são soluções diferentes, com exclusões que importa conhecer.",
    label: "Recuperar um parafuso danificado",
    short: "Extração",
    page: 44,
    printed: "42–47",
    description:
      "Da precisão manual à extração por perfuração: o tamanho e o material do parafuso decidem o método.",
    ids: ["anex-3610-n", "anex-anh-s3", "anex-1902", "anex-3980-2-100"],
  },
] as const;

export function parseAnexSearch(input: Record<string, unknown>): { family?: string | undefined } {
  const family = input["family"];
  return {
    family:
      typeof family === "string" && ANEX_CHAPTERS.some((chapter) => chapter.id === family)
        ? family
        : undefined,
  };
}

export const ANEX_SIGNATURE_SOLUTIONS = [
  { id: "anex-adrs-2065", name: "Diamond", detail: "Aderência sem íman.", code: "ADRS-2065" },
  {
    id: "anex-ryujin-artm5-01",
    name: "Ryujin / Dragon",
    detail: "Cinco bits. Três alcances.",
    code: "ARTM5-01",
  },
  {
    id: "anex-397-d",
    name: "Quick Ball 397",
    detail: "72 dentes. Movimento preciso.",
    code: "397-D",
  },
  {
    id: "anex-azm-2698",
    name: "AZM 1000 V",
    detail: "Isolamento no próprio bit.",
    code: "AZM-2698",
  },
  {
    id: "anex-aoa-17s1",
    name: "Offset AOA-17",
    detail: "O aperto além do obstáculo.",
    code: "AOA-17S1",
  },
] as const;

export const ANEX_ACCESSORY_IDS = ["anex-aqh-s1", "anex-abh-10", "anex-aeh-100", "anex-amb-635", "anex-abs-2065"] as const;
