import test from 'node:test';
import assert from 'node:assert/strict';
import { ANEX_CHAPTERS, parseAnexSearch } from '../src/data/anex-editorial.ts';
import { ANEX_ADDITIONS } from '../src/data/anex-additions.ts';
import { CURATED_TOOL_REFERENCES } from '../src/data/curated-tool-references.ts';

test('ANEX deep links accept only supported applications and recover from malformed input', () => {
  for (const chapter of ANEX_CHAPTERS) assert.equal(parseAnexSearch({ family: chapter.id }).family, chapter.id);
  for (const family of ['unknown', ['torque'], { id: 'torque' }, 42, null]) assert.equal(parseAnexSearch({ family }).family, undefined);
});

test('every editorial application resolves to unique existing ANEX references', () => {
  const references = new Map(CURATED_TOOL_REFERENCES.map(tool => [tool.id, tool]));
  assert.equal(references.size, CURATED_TOOL_REFERENCES.length);
  for (const chapter of ANEX_CHAPTERS) {
    assert.equal(new Set(chapter.ids).size, chapter.ids.length);
    for (const id of chapter.ids) assert.equal(references.get(id)?.brandSlug, 'ANEX', id);
  }
});

test('new ANEX references retain official evidence and application limits without invented commerce data', () => {
  for (const tool of ANEX_ADDITIONS) {
    assert.equal(new URL(tool.referenceUrl).hostname, 'www.anextool.co.jp');
    assert.ok(tool.imageUrl && tool.officialCode && tool.limitationsPt);
    assert.ok(tool.catalogViewerPage > 0 && tool.catalogViewerPage <= 98);
    assert.equal('price' in tool || 'stock' in tool, false);
  }
  assert.match(ANEX_ADDITIONS.find(t => t.id === 'anex-ata-m4').limitationsPt, /Não utilizar.*impacto/);
  assert.match(ANEX_ADDITIONS.find(t => t.id === 'anex-3610-n').limitationsPt, /exclusivamente manual/);
});
