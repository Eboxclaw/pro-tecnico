import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCatalogSearch, matchesCatalogQuery, interpretSmartQuery, resolveSmartQuery, matchesStructuredIntents } from '../src/lib/catalog-search.ts';
import { normalizeReferralCode, rememberReferralCode, getRememberedReferralCode, clearRememberedReferralCode } from '../src/lib/referrals.ts';

test('search matches accents, brand punctuation, model and technical codes', () => {
  assert.equal(matchesCatalogQuery('ko ken precisao 24', ['Ko-ken', 'Precisão', '3724']), true);
  assert.equal(matchesCatalogQuery('olfa 24', ['VESSEL', '220USB']), false);
  assert.equal(matchesCatalogQuery('1000v', ['Bits AZM 1000 V isolados']), true);
  assert.equal(matchesCatalogQuery('ph2 65', ['PH 2 × 65 mm']), true);
});
test('URL input is bounded and rejects invalid prices and pages', () => {
  assert.equal(parseCatalogSearch({ page: -5, maxPrice: 'NaN' }).page, undefined);
  assert.equal(parseCatalogSearch({ page: 2.5, maxPrice: -10 }).maxPrice, undefined);
  assert.equal(parseCatalogSearch({ page: 3, maxPrice: '25.50', q: '  VESSEL  ' }).q, 'VESSEL');
  assert.equal(parseCatalogSearch({ page: 3 }).page, 3);
  assert.equal(parseCatalogSearch({ q: 'a'.repeat(500) }).q.length, 160);
  assert.equal(parseCatalogSearch({ sort: 'script' }).sort, undefined);
});
test('blocked browser storage retains and clears a referral in the current session', () => {
  globalThis.window = { get localStorage() { throw new Error('Blocked'); } };
  try {
    assert.equal(normalizeReferralCode(' ab-12 '), 'AB-12');
    rememberReferralCode('ab-12');
    assert.equal(getRememberedReferralCode(), 'AB-12');
    clearRememberedReferralCode();
    assert.equal(getRememberedReferralCode(), '');
  } finally { delete globalThis.window; }
});

test('smart aliases preserve residual brand and profile, with conservative exclusions', () => {
  for (const [q, id] of [['1000v','insulated'], ['1000 V','insulated'], ['diamante','diamond'], ['ratchet','ratchet'], ['roquete','ratchet'], ['impacto','impact-bits'], ['vde','vde']]) {
    assert.equal(interpretSmartQuery(q).intents[0].id, id);
  }
  assert.equal(interpretSmartQuery('ANEX diamante PH2').residual, 'anex ph2');
  assert.equal(interpretSmartQuery('tubo rompe ADRS-2065').intents.length, 0);
  assert.equal(interpretSmartQuery('sockets').intents[0].dimension, 'task');
  assert.equal(interpretSmartQuery('diamantado').intents.length, 0);
});
test('explicit focus wins, literal dismissal survives URL parsing, changing query can re-enable interpretation', () => {
  assert.deepEqual(resolveSmartQuery({ q: 'ANEX diamante PH2', focus: 'ratchet' }), { residual: 'anex ph2', intents: [] });
  assert.deepEqual(resolveSmartQuery(parseCatalogSearch({ q: 'vde', literal: 'true' })), { residual: 'vde', intents: [] });
  assert.equal(resolveSmartQuery({ q: 'ratchet' }).intents.length, 1);
  assert.equal(resolveSmartQuery({ q: 'vde', focus: 'insulated' }).intents[0].id, 'vde');
});
test('Shopify technical filtering requires explicit attributes, not incidental text', () => {
  const vde = interpretSmartQuery('vde').intents;
  assert.equal(matchesStructuredIntents(['focus:insulated', 'not VDE'], vde), false);
  assert.equal(matchesStructuredIntents(['certification:vde'], vde), true);
  assert.equal(matchesStructuredIntents(['focus:diamond'], interpretSmartQuery('diamante ratchet').intents), false);
});
