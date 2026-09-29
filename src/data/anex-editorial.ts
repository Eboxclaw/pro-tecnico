export const ANEX_CATALOG_URL = "https://my.ebook5.net/anextool_catalog/k9dGJL/";

export const ANEX_CHAPTERS = [
  {
    id: "access",
    label: "Chegar onde falta espaço",
    short: "Acesso",
    page: 38,
    printed: "36–40",
    description:
      "Adaptadores offset e ferramentas de perfil baixo para obstáculos que não se resolvem com mais força.",
    ids: ["anex-aoa-17s1", "anex-aoa-19", "anex-6102-t", "anex-6103-f"],
  },
  {
    id: "ratchet",
    label: "Apertar com movimento curto",
    short: "Roquetes",
    page: 57,
    printed: "55–58",
    description:
      "Quick Ball 72, MiniSta72 e roquetes compactos: escolhe pelo espaço, pelo punho e pelos bits que precisas.",
    ids: ["anex-397-d", "anex-397-h", "anex-307-s1", "anex-525-10b", "anex-370"],
  },
  {
    id: "bits",
    label: "Escolher a ponta certa",
    short: "Bits",
    page: 10,
    printed: "8–13",
    description:
      "A família Ryujin merece uma escolha por perfil, comprimento e encaixe. O nome da série não substitui a compatibilidade.",
    ids: ["anex-abrs5-2065", "anex-abrs5-01"],
  },
  {
    id: "torque",
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
    label: "Recuperar um parafuso danificado",
    short: "Extração",
    page: 44,
    printed: "42–47",
    description:
      "Da precisão manual à extração por perfuração: o tamanho e o material do parafuso decidem o método.",
    ids: ["anex-3610-n", "anex-anh-s3", "anex-1902"],
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
