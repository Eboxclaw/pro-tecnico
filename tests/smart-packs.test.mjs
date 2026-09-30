import test from 'node:test';
import assert from 'node:assert/strict';
import { SMART_PACKS } from '../src/data/smart-packs.ts';
import { CURATED_TOOL_REFERENCES } from '../src/data/curated-tool-references.ts';

test('every smart pack piece resolves to a curated reference with a rationale', () => {
  const ids = new Set(CURATED_TOOL_REFERENCES.map(tool => tool.id));
  for (const pack of SMART_PACKS) {
    assert.ok(pack.pieces.length >= 4, `${pack.id} too thin`);
    for (const piece of pack.pieces) {
      assert.ok(ids.has(piece.id), `${pack.id} references missing tool ${piece.id}`);
      assert.ok(piece.quantity >= 1 && piece.whyPt.length > 10, `${pack.id}/${piece.id} quantity or rationale invalid`);
    }
    assert.ok(pack.notIncludedPt.length > 0 && pack.limitationsPt.length > 10, `${pack.id} lacks honesty fields`);
  }
});

test('tiers only exist with real functional differences inside a trade', () => {
  const byTrade = new Map();
  for (const pack of SMART_PACKS) {
    const set = pack.pieces.map(p => p.id).sort().join('|');
    for (const other of byTrade.get(pack.trade) ?? []) {
      assert.notEqual(set, other.set, `${pack.id} duplicates composition of ${other.id}`);
    }
    byTrade.set(pack.trade, [...(byTrade.get(pack.trade) ?? []), { id: pack.id, set }]);
  }
  for (const pack of SMART_PACKS) {
    assert.ok(['Compact', 'Core', 'Pro'].includes(pack.tier), `${pack.id} invalid tier`);
  }
});
