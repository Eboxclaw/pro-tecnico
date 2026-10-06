import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULAR_PACKS, modularPackById } from '../src/data/modular-packs.ts';
import { CURATED_TOOL_REFERENCES } from '../src/data/curated-tool-references.ts';

test('there are exactly four modular packs with unique, expected ids', () => {
  assert.equal(MODULAR_PACKS.length, 4);
  const ids = MODULAR_PACKS.map(pack => pack.id);
  assert.equal(new Set(ids).size, 4, 'pack ids must be unique');
  for (const expected of ['mod-impacto', 'mod-roquete', 'mod-canalizacao', 'mod-vde']) {
    assert.ok(ids.includes(expected), `missing pack ${expected}`);
  }
});

test('every slot option resolves to a curated reference', () => {
  const ids = new Set(CURATED_TOOL_REFERENCES.map(tool => tool.id));
  for (const pack of MODULAR_PACKS) {
    for (const slot of pack.slots) {
      for (const option of slot.options) {
        assert.ok(ids.has(option.refId), `${pack.id}/${slot.id} references missing tool ${option.refId}`);
      }
    }
  }
});

test('packs have at least two slots; slots have options and unique ids', () => {
  for (const pack of MODULAR_PACKS) {
    assert.ok(pack.slots.length >= 2, `${pack.id} needs at least two slots`);
    const slotIds = pack.slots.map(slot => slot.id);
    assert.equal(new Set(slotIds).size, slotIds.length, `${pack.id} slot ids must be unique`);
    for (const slot of pack.slots) {
      assert.ok(slot.options.length >= 1, `${pack.id}/${slot.id} needs at least one option`);
    }
  }
});

test('formulas are composable and editorial fields carry real copy', () => {
  for (const pack of MODULAR_PACKS) {
    assert.ok(pack.formulaPartsPt.length >= 2, `${pack.id} formula too thin`);
    assert.ok(pack.conceptPt.length > 20, `${pack.id} concept too thin`);
    assert.ok(pack.conceptPt.length > 10, `${pack.id} lacks concept`);
    assert.ok(pack.limitationsPt.length > 10, `${pack.id} lacks honesty`);
  }
});

test('EM SOURCING is named where the catalog is incomplete; canalizacao stays a duo', () => {
  const vde = MODULAR_PACKS.find(pack => pack.id === 'mod-vde');
  assert.ok(
    vde.limitationsPt.includes('EM SOURCING'),
    'mod-vde must name the missing VDE roquete as EM SOURCING',
  );
  const canalizacao = MODULAR_PACKS.find(pack => pack.id === 'mod-canalizacao');
  assert.equal(canalizacao.slots.length, 2, 'mod-canalizacao is a duo by design');
});

test('modularPackById resolves known ids and returns undefined for unknown ones', () => {
  assert.equal(modularPackById('mod-impacto').id, 'mod-impacto');
  assert.equal(modularPackById('nao-existe'), undefined);
  assert.equal(modularPackById('kit-bits-pro'), undefined);
});
