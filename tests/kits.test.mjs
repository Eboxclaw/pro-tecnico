import test from "node:test";
import assert from "node:assert/strict";
import { REJENDARI_KITS } from "../src/data/kits.ts";
import { CURATED_TOOL_REFERENCES } from "../src/data/curated-tool-references.ts";

const BASE_KIT_IDS = ["kit-bits-pro", "kit-caixa-avac", "kit-caixa-tecnico"];

const BASIC_PACK_IDS = [
  "pack-vde-basico",
  "pack-roquete-basico",
  "pack-canalizador-basico",
  "pack-misto-anex",
  "pack-impacto-ryujin",
];

const MALA_IDS = [
  "mala-397",
  "mala-maquinas-makita",
  "mala-avac",
  "mala-canalizacao",
  "mala-eletricidade-vde",
  "mala-manutencao",
];

test("base kits, profession malas and basic packs, unique ids, valid formats", () => {
  assert.equal(REJENDARI_KITS.length, 15);
  const ids = REJENDARI_KITS.map((kit) => kit.id);
  assert.equal(new Set(ids).size, 15, "kit ids must be unique");
  for (const expected of [...BASE_KIT_IDS, ...BASIC_PACK_IDS, ...MALA_IDS]) {
    assert.ok(ids.includes(expected), `missing kit ${expected}`);
  }
  for (const kit of REJENDARI_KITS) {
    assert.ok(["kit", "caixa", "mala"].includes(kit.format), `${kit.id} invalid format`);
  }
  for (const id of MALA_IDS) {
    assert.equal(
      REJENDARI_KITS.find((kit) => kit.id === id).format,
      "mala",
      `${id} should be a mala`,
    );
  }
  // os packs básicos são entrada (Core); o resto é flagship Pro
  for (const id of BASIC_PACK_IDS) {
    assert.equal(
      REJENDARI_KITS.find((kit) => kit.id === id).tier,
      "Core",
      `${id} is an entry pack`,
    );
  }
  for (const kit of REJENDARI_KITS.filter((kit) => !BASIC_PACK_IDS.includes(kit.id))) {
    assert.equal(kit.tier, "Pro", `${kit.id} kits are flagship Pro`);
  }
});

test("ANEX machine bits are only Black Ryujin and Diamond Ryujin (house policy)", () => {
  const FORBIDDEN = new Set([
    "anex-art-14m-2-65", // Ryujin standard (prata)
    "anex-arpm-2365",
    "anex-ryujin-artm5-01",
    "anex-ryujin-slim",
  ]);
  for (const kit of REJENDARI_KITS) {
    for (const piece of kit.pieces) {
      assert.ok(
        !FORBIDDEN.has(piece.id),
        `${kit.id} usa ${piece.id}: fora da política (só Black/Diamond Ryujin)`,
      );
    }
  }
  assert.ok(
    !REJENDARI_KITS.some((kit) => kit.pieces.some((p) => p.id === "olfa-scr-l")),
    "o raspador não entra em kits: o X-ato é sempre melhor",
  );
});

test("basic packs are trade entry points with diverse brands and no 397", () => {
  const catalog = new Map(CURATED_TOOL_REFERENCES.map((tool) => [tool.id, tool]));
  for (const id of BASIC_PACK_IDS) {
    const kit = REJENDARI_KITS.find((entry) => entry.id === id);
    assert.ok(kit.pieces.length >= 3 && kit.pieces.length <= 4, `${id} stays minimal`);
    assert.ok(
      !kit.pieces.some((piece) => piece.id === "anex-397-d"),
      `${id} must not repeat the 397 (it lives in mala-397)`,
    );
  }
  // packs de ofício misturam escolas; o misto é ANEX por definição e o
  // impacto junta ANEX (Ryujin) com Milwaukee (SHOCKWAVE)
  for (const id of ["pack-vde-basico", "pack-roquete-basico", "pack-canalizador-basico"]) {
    const kit = REJENDARI_KITS.find((entry) => entry.id === id);
    const brands = new Set(kit.pieces.map((piece) => catalog.get(piece.id)?.brand));
    assert.ok(brands.size >= 2, `${id} must mix brands (got ${[...brands].join(",")})`);
  }
  assert.equal(
    new Set(
      REJENDARI_KITS.find((kit) => kit.id === "pack-vde-basico").pieces.map(
        (p) => catalog.get(p.id)?.brand,
      ),
    ).size,
    3,
    "pack VDE básico junta ANEX, VESSEL e Knipex",
  );
  const impacto = REJENDARI_KITS.find((kit) => kit.id === "pack-impacto-ryujin");
  const impactoBrands = new Set(impacto.pieces.map((p) => catalog.get(p.id)?.brand));
  assert.ok(impactoBrands.size >= 2, "pack impacto Ryujin junta ANEX e Milwaukee");
});

test("the mala de máquinas brings 2 batteries 5Ah or more plus a charger", () => {
  const machines = REJENDARI_KITS.find((kit) => kit.id === "mala-maquinas-makita");
  const catalog = new Map(CURATED_TOOL_REFERENCES.map((tool) => [tool.id, tool]));
  const combined = machines.pieces
    .flatMap((piece) => {
      const tool = catalog.get(piece.id);
      return tool?.kitContents ?? [];
    })
    .join(" ")
    .toLowerCase();
  // o conjunto DLX2549TJ traz 2× 5,0 Ah + carregador nos seus kitContents
  assert.ok(combined.includes("5,0 ah"), "batteries must be 5.0 Ah or higher");
  assert.ok(combined.includes("carregador"), "a charger must be included");
});

test("every kit piece resolves to a curated reference with a rationale", () => {
  const ids = new Set(CURATED_TOOL_REFERENCES.map((tool) => tool.id));
  for (const kit of REJENDARI_KITS) {
    // packs (bits ordenados e básicos) são pequenos por desenho: 3 peças chegam
    const minPieces = kit.id.startsWith("pack-") ? 3 : 6;
    assert.ok(kit.pieces.length >= minPieces, `${kit.id} too thin (mín ${minPieces})`);
    for (const piece of kit.pieces) {
      assert.ok(ids.has(piece.id), `${kit.id} references missing tool ${piece.id}`);
      assert.ok(
        piece.quantity >= 1 && piece.whyPt.length > 10,
        `${kit.id}/${piece.id} quantity or rationale invalid`,
      );
    }
    assert.ok(kit.conceptPt.length > 20, `${kit.id} lacks concept`);
    assert.ok(kit.dayPt.length > 20, `${kit.id} lacks day story`);
    assert.ok(
      kit.notIncludedPt.length > 0 && kit.limitationsPt.length > 10,
      `${kit.id} lacks honesty fields`,
    );
  }
});

test("kits stay differentiated from each other and from smart packs", () => {
  const compositions = REJENDARI_KITS.map((kit) =>
    kit.pieces
      .map((p) => p.id)
      .sort()
      .join("|"),
  );
  for (let i = 0; i < compositions.length; i++) {
    for (let j = i + 1; j < compositions.length; j++) {
      assert.notEqual(compositions[i], compositions[j], `kits ${i} and ${j} duplicate composition`);
    }
  }
});

test("no single reference dominates the kit catalog (anti-repetition guard)", () => {
  // consumíveis (bits, o 397 como porta-bits do dia) não se repetem em muitos
  // kits — era a redundância que se sentia; ferramentas de grip podem ser a
  // recomendação comum de vários ofícios, com um teto mais folgado.
  const CONSUMABLES = new Set([
    "anex-397-d",
    "anex-art-14m-2-65",
    "anex-adrs-2065",
    "anex-abrs5-2065",
    "anex-arpm-2365",
    "anex-ryujin-slim",
  ]);
  const counts = new Map();
  for (const kit of REJENDARI_KITS) {
    for (const piece of kit.pieces) {
      counts.set(piece.id, (counts.get(piece.id) ?? 0) + 1);
    }
  }
  for (const [refId, count] of counts) {
    const limit = CONSUMABLES.has(refId) ? 4 : 8;
    assert.ok(count <= limit, `${refId} appears in ${count} kits (max ${limit})`);
  }
  // o 397 vive só na mala base — o kit de roquetes foi dissolvido em packs
  assert.equal(counts.get("anex-397-d"), 1, "397-d only in mala-397");
  // a VDE chain deixou de existir duas vezes: a caixa virou pack básico, degrau de
  // entrada da MESMA cadeia (subset intencional da mala, nunca composição paralela)
  const vdeMala = new Set(
    REJENDARI_KITS.find((kit) => kit.id === "mala-eletricidade-vde").pieces.map((p) => p.id),
  );
  const packVde = REJENDARI_KITS.find((kit) => kit.id === "pack-vde-basico").pieces.map(
    (p) => p.id,
  );
  const shared = packVde.filter((id) => vdeMala.has(id));
  assert.ok(packVde.length <= 5, "pack VDE básico mantém-se mínimo");
  assert.ok(
    shared.length <= 4,
    `pack VDE básico partilha ${shared.length} peças com a mala: upgrade path da mesma cadeia, não kit paralelo`,
  );
});

test("kit editorial names the pieces with brand and model (B2B prefill basis)", () => {
  for (const kit of REJENDARI_KITS) {
    for (const piece of kit.pieces) {
      const tool = CURATED_TOOL_REFERENCES.find((entry) => entry.id === piece.id);
      assert.ok(
        tool && tool.brand && tool.model,
        `${kit.id}/${piece.id} missing brand/model for prefill`,
      );
    }
  }
});

test("malas keep low tool count and cross-bit language", () => {
  for (const kit of REJENDARI_KITS.filter((kit) => kit.format === "mala")) {
    assert.ok(kit.pieces.length <= 16, `${kit.id} mala too heavy for low tool count`);
    const combined = `${kit.conceptPt} ${kit.dayPt}`.toLowerCase();
    assert.ok(
      combined.includes("mala") || combined.includes("profiss"),
      `${kit.id} should speak the profession language`,
    );
  }
});
