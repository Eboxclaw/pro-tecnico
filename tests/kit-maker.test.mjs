import test from 'node:test';
import assert from 'node:assert/strict';
import { KIT_MAKER_STEPS, kitMakerStepById } from '../src/data/kit-maker.ts';
import { CURATED_TOOL_REFERENCES, SHOWCASED_BRANDS } from '../src/data/curated-tool-references.ts';

const ALL_STEP_REF_IDS = KIT_MAKER_STEPS.flatMap((step) => [
  ...(step.refIds ?? []),
  ...(step.branches?.flatMap((branch) => branch.refIds) ?? []),
  ...(step.groups?.flatMap((group) => group.refIds) ?? []),
]);

test('kit maker: eleven guided steps covering the whole catalog', () => {
  assert.equal(KIT_MAKER_STEPS.length, 11);
  const ids = KIT_MAKER_STEPS.map((step) => step.id);
  assert.equal(new Set(ids).size, 11, 'step ids must be unique');
  assert.deepEqual(
    ids,
    [
      'basico',
      'extensoes',
      'bits',
      'roquetes',
      'chaves',
      'soquetes',
      'canalizacao',
      'eletricidade',
      'corte',
      'precisao',
      'maquinas',
    ],
    'ordem da casa',
  );
  for (const step of KIT_MAKER_STEPS) {
    assert.ok(step.topicPt.length > 3, `${step.id} lacks topic`);
    assert.ok(step.questionPt.length > 10, `${step.id} lacks question`);
    const count =
      (step.refIds?.length ?? 0) +
      (step.branches?.reduce((sum, b) => sum + b.refIds.length, 0) ?? 0) +
      (step.groups?.reduce((sum, g) => sum + g.refIds.length, 0) ?? 0);
    assert.ok(count >= 4, `${step.id} too thin (${count} opções)`);
  }
  assert.equal(kitMakerStepById('basico')?.id, 'basico');
  assert.equal(kitMakerStepById('nao-existe'), undefined);
});

test('kit maker: every option resolves to a curated reference', () => {
  const ids = new Set(CURATED_TOOL_REFERENCES.map((tool) => tool.id));
  for (const refId of ALL_STEP_REF_IDS) {
    assert.ok(ids.has(refId), `referência em falta no catálogo: ${refId}`);
  }
});

test('kit maker: every showcased brand is represented in the wizard', () => {
  const toolsById = new Map(CURATED_TOOL_REFERENCES.map((tool) => [tool.id, tool]));
  const brandsInWizard = new Set(
    ALL_STEP_REF_IDS.map((refId) => toolsById.get(refId)?.brand).filter(Boolean),
  );
  for (const brand of SHOWCASED_BRANDS) {
    assert.ok(brandsInWizard.has(brand), `marca ${brand} sem representação no Kit Maker`);
  }
});

test('kit maker: roquetes follow the battle order the client defined', () => {
  const roquetes = KIT_MAKER_STEPS.find((step) => step.id === 'roquetes');
  const labels = (roquetes?.groups ?? []).map((group) => group.labelPt);
  assert.deepEqual(labels, [
    '1.º O nosso offset',
    '2.º Wera Zyklop · o personagem principal',
    '3.º Klein pass-through',
    '4.º Bahco pass-through',
    '5.º Bits e cabeças especiais',
  ]);
});

test('kit maker: house policies hold (sem chaves normais, bits só Black/Diamond)', () => {
  const forbidden = /art-14m|arpm-2365|ryujin-artm5|ryujin-slim|7000-2-100|170-2-100|524k/;
  for (const refId of ALL_STEP_REF_IDS) {
    assert.ok(!forbidden.test(refId), `${refId} viola a política da casa`);
  }
  const basico = KIT_MAKER_STEPS.find((step) => step.id === 'basico');
  const vde = basico.branches.find((branch) => branch.id === 'vde');
  assert.ok(vde, 'o submenu VDE tem de existir no básico');
  for (const refId of vde.refIds) {
    assert.match(refId, /(vde|ins|7920|7900|960|200-ph2)/, `${refId} não parece driver VDE`);
  }
});
