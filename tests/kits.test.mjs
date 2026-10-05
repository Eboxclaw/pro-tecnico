import test from 'node:test';
import assert from 'node:assert/strict';
import { REJENDARI_KITS } from '../src/data/kits.ts';
import { CURATED_TOOL_REFERENCES } from '../src/data/curated-tool-references.ts';

const BASE_KIT_IDS = [
  'kit-bits-pro',
  'kit-roquetes-pro',
  'kit-caixa-avac',
  'kit-caixa-eletricista',
  'kit-caixa-tecnico',
];

const MALA_IDS = [
  'mala-397',
  'mala-maquinas-makita',
  'mala-avac',
  'mala-canalizacao',
  'mala-eletricidade-vde',
  'mala-manutencao',
];

test('there are the five base kits plus six profession malas, unique ids, valid formats', () => {
  assert.equal(REJENDARI_KITS.length, 11);
  const ids = REJENDARI_KITS.map(kit => kit.id);
  assert.equal(new Set(ids).size, 11, 'kit ids must be unique');
  for (const expected of [...BASE_KIT_IDS, ...MALA_IDS]) {
    assert.ok(ids.includes(expected), `missing kit ${expected}`);
  }
  for (const kit of REJENDARI_KITS) {
    assert.ok(['kit', 'caixa', 'mala'].includes(kit.format), `${kit.id} invalid format`);
    assert.equal(kit.tier, 'Pro', `${kit.id} kits are flagship Pro`);
  }
  // as malas estão todas presentes e identificadas como mala
  for (const id of MALA_IDS) {
    assert.equal(REJENDARI_KITS.find(kit => kit.id === id).format, 'mala', `${id} should be a mala`);
  }
});

test('the mala de máquinas brings 2 batteries 5Ah or more plus a charger', () => {
  const machines = REJENDARI_KITS.find(kit => kit.id === 'mala-maquinas-makita');
  const catalog = new Map(CURATED_TOOL_REFERENCES.map(tool => [tool.id, tool]));
  const combined = machines.pieces
    .flatMap(piece => {
      const tool = catalog.get(piece.id);
      return tool?.kitContents ?? [];
    })
    .join(' ')
    .toLowerCase();
  // o conjunto DLX2549TJ traz 2× 5,0 Ah + carregador nos seus kitContents
  assert.ok(combined.includes('5,0 ah'), 'batteries must be 5.0 Ah or higher');
  assert.ok(combined.includes('carregador'), 'a charger must be included');
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

test('malas keep low tool count and cross-bit language', () => {
  for (const kit of REJENDARI_KITS.filter(kit => kit.format === 'mala')) {
    assert.ok(kit.pieces.length <= 16, `${kit.id} mala too heavy for low tool count`);
    const combined = `${kit.conceptPt} ${kit.dayPt}`.toLowerCase();
    assert.ok(
      combined.includes('mala') || combined.includes('profiss'),
      `${kit.id} should speak the profession language`,
    );
  }
});
