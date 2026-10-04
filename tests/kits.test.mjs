import test from 'node:test';
import assert from 'node:assert/strict';
import { REJENDARI_KITS } from '../src/data/kits.ts';
import { CURATED_TOOL_REFERENCES } from '../src/data/curated-tool-references.ts';

test('there are exactly the five first kits, with unique ids and valid format', () => {
  assert.equal(REJENDARI_KITS.length, 5);
  const ids = REJENDARI_KITS.map(kit => kit.id);
  assert.equal(new Set(ids).size, 5, 'kit ids must be unique');
  assert.deepEqual(
    new Set(ids),
    new Set(['kit-bits-pro', 'kit-roquetes-pro', 'kit-caixa-avac', 'kit-caixa-eletricista', 'kit-caixa-tecnico']),
  );
  for (const kit of REJENDARI_KITS) {
    assert.ok(['kit', 'caixa'].includes(kit.format), `${kit.id} invalid format`);
    assert.equal(kit.tier, 'Pro', `${kit.id} the first kits are flagship Pro`);
  }
});

test('every kit piece resolves to a curated reference with a rationale', () => {
  const ids = new Set(CURATED_TOOL_REFERENCES.map(tool => tool.id));
  for (const kit of REJENDARI_KITS) {
    assert.ok(kit.pieces.length >= 6, `${kit.id} too thin`);
    for (const piece of kit.pieces) {
      assert.ok(ids.has(piece.id), `${kit.id} references missing tool ${piece.id}`);
      assert.ok(piece.quantity >= 1 && piece.whyPt.length > 10, `${kit.id}/${piece.id} quantity or rationale invalid`);
    }
    assert.ok(kit.conceptPt.length > 20, `${kit.id} lacks concept`);
    assert.ok(kit.dayPt.length > 20, `${kit.id} lacks day story`);
    assert.ok(kit.notIncludedPt.length > 0 && kit.limitationsPt.length > 10, `${kit.id} lacks honesty fields`);
  }
});

test('kits stay differentiated from each other and from smart packs', () => {
  const compositions = REJENDARI_KITS.map(kit => kit.pieces.map(p => p.id).sort().join('|'));
  for (let i = 0; i < compositions.length; i++) {
    for (let j = i + 1; j < compositions.length; j++) {
      assert.notEqual(compositions[i], compositions[j], `kits ${i} and ${j} duplicate composition`);
    }
  }
});

test('kit editorial names the pieces with brand and model (B2B prefill basis)', () => {
  for (const kit of REJENDARI_KITS) {
    for (const piece of kit.pieces) {
      const tool = CURATED_TOOL_REFERENCES.find(entry => entry.id === piece.id);
      assert.ok(tool && tool.brand && tool.model, `${kit.id}/${piece.id} missing brand/model for prefill`);
    }
  }
});
