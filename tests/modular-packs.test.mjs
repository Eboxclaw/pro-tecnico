import test from "node:test";
import assert from "node:assert/strict";
import { MODULAR_PACKS, modularPackById } from "../src/data/modular-packs.ts";
import { CURATED_TOOL_REFERENCES } from "../src/data/curated-tool-references.ts";

test("there are exactly three modular packs with unique, expected ids", () => {
  assert.equal(MODULAR_PACKS.length, 3);
  const ids = MODULAR_PACKS.map((pack) => pack.id);
  assert.equal(new Set(ids).size, 3, "pack ids must be unique");
  for (const expected of ["mod-impacto", "mod-canalizacao", "mod-vde"]) {
    assert.ok(ids.includes(expected), `missing pack ${expected}`);
  }
  // o roquete vive no builder 397 Lock, não em pack próprio
  assert.ok(!ids.includes("mod-roquete"), "mod-roquete was folded into mod-impacto");
});

test("the 397 Lock builder carries lock-first, Ryujin-only, ratchets and adapters", () => {
  const impact = MODULAR_PACKS.find((pack) => pack.id === "mod-impacto");
  const slotIds = impact.slots.map((slot) => slot.id);
  for (const expected of ["lock", "ponteiras", "extensao", "roquete", "adaptador"]) {
    assert.ok(slotIds.includes(expected), `397 Lock builder missing slot ${expected}`);
  }
  assert.equal(impact.slots[0].id, "lock", "lock comes first");
  // ponteiras: pack múltiplo, PH2 S (Black) e S+ (Diamond), SHOCKWAVE, VDE isolada;
  // Ryujin standard (prata) nunca entra
  const ponteiraIds = impact.slots
    .find((slot) => slot.id === "ponteiras")
    .options.map((option) => option.refId);
  for (const refId of ponteiraIds) {
    assert.ok(
      !/art-14m|arpm|artm5|ryujin-slim/.test(refId),
      `${refId} fora da política (Ryujin standard banido)`,
    );
  }
  assert.ok(
    ponteiraIds.some((id) => /abrs5/.test(id)),
    "pack PH2 S (Black Ryujin) presente",
  );
  assert.ok(
    ponteiraIds.some((id) => /adrs/.test(id)),
    "pack PH2 S+ (Diamond) presente",
  );
  assert.ok(
    ponteiraIds.some((id) => id === "anex-525-28b"),
    "pack múltiplo presente",
  );
  assert.ok(
    ponteiraIds.some((id) => /azm/.test(id)),
    "ponteira VDE/isolada presente",
  );
  // extensão: sub-tabs por grupo — AEH eco (100/200/300), ALHP impacto (100/150/300),
  // VESSEL e Klein; medidas eco em 100/200/300 como pedido
  const extensaoSlot = impact.slots.find((slot) => slot.id === "extensao");
  const extensaoIds = extensaoSlot.options.map((option) => option.refId);
  assert.equal(extensaoIds.length, 12, "4 grupos × 3 níveis");
  const groups = [...new Set(extensaoSlot.options.map((option) => option.groupPt))];
  assert.deepEqual(
    groups,
    ["AEH · eco", "ALHP · impacto", "VESSEL", "Klein"],
    "sub-tabs por linha/marca",
  );
  for (const refId of ["anex-aeh-100", "anex-aeh-200", "anex-aeh-300"]) {
    assert.ok(extensaoIds.includes(refId), `AEH eco trio inclui ${refId}`);
  }
  // roquete: pack ANEX, só roquetes ou offsets — sem screwdrivers de outras marcas
  const roqueteSlot = impact.slots.find((slot) => slot.id === "roquete");
  const roqueteIds = roqueteSlot.options.map((o) => o.refId);
  assert.ok(roqueteIds.includes("anex-436"), "offset ratchet presente");
  assert.ok(roqueteIds.includes("anex-397-d"), "bit ratchet presente");
  for (const refId of roqueteIds) {
    assert.ok(refId.startsWith("anex-"), `${refId} fora do pack ANEX (só roquetes/offsets ANEX)`);
  }
  assert.ok(roqueteIds.includes("anex-370"), "t-handle presente");
  assert.ok(!roqueteIds.includes("anex-395-d"), "quick ball 60 fora dos packs (a pedido)");
  // soquetes: 3/8 primeiro, adaptadores depois, com honestidade sobre o roscado
  const soquetesSlot = impact.slots.find((slot) => slot.id === "soquetes");
  assert.ok(soquetesSlot, "slot de soquetes presente no builder 397 Lock");
  const soquetesGroups = [...new Set(soquetesSlot.options.map((option) => option.groupPt))];
  assert.equal(soquetesGroups[0], "3/8 impacto", "soquetes 3/8 primeiro");
  assert.ok(soquetesGroups.includes("KNECT pass-through"), "pass-through KNECT presente");
  assert.ok(soquetesGroups.includes("Chave de tubo M4-M12"), "chave de tubo M4-M12 presente");
  assert.ok(
    soquetesSlot.notePt.includes("M12") &&
      soquetesSlot.notePt.includes("não há M12 em pass-through"),
    "nota honesta: M12 não existe em pass-through",
  );
  // adaptadores: os dois sentidos Zyklop + a fêmea porta-soquete em impacto
  const adaptadorIds = impact.slots
    .find((slot) => slot.id === "adaptador")
    .options.map((option) => option.refId);
  assert.deepEqual(
    adaptadorIds,
    ["wera-8784-b1", "wera-8784-a1", "milwaukee-shockwave-adaptor-set-3pc"],
    "redução 3/8→1/4, o irmão 1/4″ e a fêmea SHOCKWAVE 3-em-1",
  );
});

test("every slot option resolves to a curated reference", () => {
  const ids = new Set(CURATED_TOOL_REFERENCES.map((tool) => tool.id));
  for (const pack of MODULAR_PACKS) {
    for (const slot of pack.slots) {
      for (const option of slot.options) {
        assert.ok(
          ids.has(option.refId),
          `${pack.id}/${slot.id} references missing tool ${option.refId}`,
        );
      }
    }
  }
});

test("packs have at least two slots; slots have options and unique ids", () => {
  for (const pack of MODULAR_PACKS) {
    assert.ok(pack.slots.length >= 2, `${pack.id} needs at least two slots`);
    const slotIds = pack.slots.map((slot) => slot.id);
    assert.equal(new Set(slotIds).size, slotIds.length, `${pack.id} slot ids must be unique`);
    for (const slot of pack.slots) {
      assert.ok(slot.options.length >= 1, `${pack.id}/${slot.id} needs at least one option`);
    }
  }
});

test("formulas are composable and editorial fields carry real copy", () => {
  for (const pack of MODULAR_PACKS) {
    assert.ok(pack.formulaPartsPt.length >= 2, `${pack.id} formula too thin`);
    assert.ok(pack.conceptPt.length > 20, `${pack.id} concept too thin`);
    assert.ok(pack.conceptPt.length > 10, `${pack.id} lacks concept`);
    assert.ok(pack.limitationsPt.length > 10, `${pack.id} lacks honesty`);
  }
});

test("EM SOURCING is named where the catalog is incomplete; canalizacao stays a duo", () => {
  const vde = MODULAR_PACKS.find((pack) => pack.id === "mod-vde");
  assert.ok(
    vde.limitationsPt.includes("EM SOURCING"),
    "mod-vde must name the missing VDE roquete as EM SOURCING",
  );
  const canalizacao = MODULAR_PACKS.find((pack) => pack.id === "mod-canalizacao");
  assert.equal(canalizacao.slots.length, 2, "mod-canalizacao is a duo by design");
});

test("modularPackById resolves known ids and returns undefined for unknown ones", () => {
  assert.equal(modularPackById("mod-impacto").id, "mod-impacto");
  assert.equal(modularPackById("nao-existe"), undefined);
  assert.equal(modularPackById("kit-bits-pro"), undefined);
});

test("symbolism: quality dots stay in range and 1000 V claims carry a norm", async () => {
  const { CURATED_TOOL_REFERENCES } = await import("../src/data/curated-tool-references.ts");
  for (const tool of CURATED_TOOL_REFERENCES) {
    if (tool.qualityDots !== undefined) {
      assert.ok(
        Number.isInteger(tool.qualityDots) && tool.qualityDots >= 0 && tool.qualityDots <= 5,
        `${tool.id}: qualityDots fora da escala 0-5`,
      );
    }
    const claims1000 = `${tool.notePt} ${tool.namePt}`.match(/1000 V|1000V/i);
    if (claims1000) {
      assert.ok(
        tool.normPt && /60900|F1505|1000/i.test(tool.normPt),
        `${tool.id} afirma 1000 V sem normPt com norma (IEC 60900/F1505)`,
      );
    }
  }
});
