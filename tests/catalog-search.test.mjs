import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCatalogSearch, matchesCatalogQuery } from '../src/lib/catalog-search.ts';
import { normalizeReferralCode, rememberReferralCode, getRememberedReferralCode, clearRememberedReferralCode } from '../src/lib/referrals.ts';

test('search matches accents, brand punctuation, model and technical codes', () => {
  assert.equal(matchesCatalogQuery('ko ken precisao 24', ['Ko-ken', 'Precisão', '3724']), true);
  assert.equal(matchesCatalogQuery('olfa 24', ['VESSEL', '220USB']), false);
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
