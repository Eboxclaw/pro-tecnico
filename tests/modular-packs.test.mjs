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
  // ponteiras: só Black/Diamond Ryujin e SHOCKWAVE — standard fora
  const ponteiraIds = impact.slots
    .find((slot) => slot.id === "ponteiras")
    .options.map((option) => option.refId);
  for (const refId of ponteiraIds) {
    assert.ok(
      /abrs5|adrs|shockwave/.test(refId),
      `${refId} fora da política (só Black/Diamond Ryujin e SHOCKWAVE)`,
    );
  }
  // extensão nos três níveis
  const extensaoIds = impact.slots
    .find((slot) => slot.id === "extensao")
    .options.map((option) => option.refId);
  assert.equal(extensaoIds.length, 3, "curta 100 · média 150 · longa 300");
  // roquete tem de incluir um offset e um roquete de bits
  const roqueteIds = impact.slots.find((slot) => slot.id === "roquete").options.map((o) => o.refId);
  assert.ok(roqueteIds.includes("anex-436"), "offset ratchet presente");
  assert.ok(roqueteIds.includes("anex-397-d"), "bit ratchet presente");
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
