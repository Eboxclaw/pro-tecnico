import test from "node:test";
import assert from "node:assert/strict";
import { KIT_MAKER_STEPS, kitMakerStepById } from "../src/data/kit-maker.ts";
import { CURATED_TOOL_REFERENCES } from "../src/data/curated-tool-references.ts";

test("kit maker: eight guided steps with unique ids and editorial copy", () => {
  assert.equal(KIT_MAKER_STEPS.length, 8);
  const ids = KIT_MAKER_STEPS.map((step) => step.id);
  assert.equal(new Set(ids).size, 8, "step ids must be unique");
  for (const step of KIT_MAKER_STEPS) {
    assert.ok(step.topicPt.length > 3, `${step.id} lacks topic`);
    assert.ok(step.questionPt.length > 10, `${step.id} lacks question`);
  }
  assert.equal(kitMakerStepById("basico")?.id, "basico");
  assert.equal(kitMakerStepById("nao-existe"), undefined);
});

test("kit maker: every option resolves to a curated reference", () => {
  const ids = new Set(CURATED_TOOL_REFERENCES.map((tool) => tool.id));
  for (const step of KIT_MAKER_STEPS) {
    const direct = step.refIds ?? [];
    for (const refId of direct) {
      assert.ok(ids.has(refId), `${step.id} references missing tool ${refId}`);
    }
    for (const branch of step.branches ?? []) {
      assert.ok(branch.refIds.length >= 1, `${step.id}/${branch.id} branch is empty`);
      for (const refId of branch.refIds) {
        assert.ok(ids.has(refId), `${step.id}/${branch.id} references missing tool ${refId}`);
      }
    }
    // cada passo tem de oferecer caminho: opções diretas OU ramos
    assert.ok(
      direct.length > 0 || (step.branches?.length ?? 0) > 0,
      `${step.id} has no options at all`,
    );
  }
});

test("kit maker: the casa order is respected (basic first, machines last)", () => {
  assert.equal(KIT_MAKER_STEPS[0].id, "basico");
  assert.equal(KIT_MAKER_STEPS[KIT_MAKER_STEPS.length - 1].id, "maquinas");
  // ramos impacto/precisão nos passos de extensões e bits
  const extensoes = KIT_MAKER_STEPS.find((step) => step.id === "extensoes");
  const bitLabels = (extensoes?.branches ?? []).map((branch) => branch.labelPt);
  assert.deepEqual(bitLabels, ["Impacto", "Precisão / eco"]);
});
