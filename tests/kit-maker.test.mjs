import test from "node:test";
import assert from "node:assert/strict";
import { KIT_MAKER_STEPS, kitMakerStepById } from "../src/data/kit-maker.ts";
import { CURATED_TOOL_REFERENCES } from "../src/data/curated-tool-references.ts";

test("kit maker: nine guided steps with unique ids and editorial copy", () => {
  assert.equal(KIT_MAKER_STEPS.length, 9);
  const ids = KIT_MAKER_STEPS.map((step) => step.id);
  assert.equal(new Set(ids).size, 9, "step ids must be unique");
  for (const step of KIT_MAKER_STEPS) {
    assert.ok(step.topicPt.length > 3, `${step.id} lacks topic`);
    assert.ok(step.questionPt.length > 10, `${step.id} lacks question`);
  }
  assert.equal(kitMakerStepById("basico")?.id, "basico");
  assert.equal(kitMakerStepById("chaves")?.id, "chaves");
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
    for (const group of step.groups ?? []) {
      assert.ok(group.refIds.length >= 1, `${step.id}/${group.id} group is empty`);
      for (const refId of group.refIds) {
        assert.ok(ids.has(refId), `${step.id}/${group.id} references missing tool ${refId}`);
      }
    }
    // cada passo tem de oferecer caminho: opções diretas, ramos OU grupos
    assert.ok(
      direct.length > 0 || (step.branches?.length ?? 0) > 0 || (step.groups?.length ?? 0) > 0,
      `${step.id} has no options at all`,
    );
  }
});

test("kit maker: the casa order is respected (basico first, chaves in the middle, maquinas last)", () => {
  assert.equal(KIT_MAKER_STEPS[0].id, "basico");
  assert.equal(KIT_MAKER_STEPS[KIT_MAKER_STEPS.length - 1].id, "maquinas");
  assert.deepEqual(
    KIT_MAKER_STEPS.map((step) => step.id),
    [
      "basico",
      "extensoes",
      "bits",
      "roquetes",
      "chaves",
      "canalizacao",
      "eletricidade",
      "corte",
      "maquinas",
    ],
  );
  // ramos impacto/precisão nos passos de extensões e bits
  const extensoes = KIT_MAKER_STEPS.find((step) => step.id === "extensoes");
  const bitLabels = (extensoes?.branches ?? []).map((branch) => branch.labelPt);
  assert.deepEqual(bitLabels, ["Impacto", "Precisão / eco"]);
});

test("kit maker: roquetes march in the client's battle order (5 groups, no branches)", () => {
  const roquetes = KIT_MAKER_STEPS.find((step) => step.id === "roquetes");
  assert.ok(roquetes, "roquetes step is missing");
  assert.equal(roquetes.branches, undefined, "roquetes uses groups, not branches");
  const groups = roquetes.groups ?? [];
  assert.equal(groups.length, 5);
  assert.deepEqual(
    groups.map((group) => group.labelPt),
    [
      "1.º O nosso offset",
      "2.º Wera Zyklop · o personagem principal",
      "3.º Klein pass-through",
      "4.º Bahco pass-through",
      "5.º Bits e cabeças especiais",
    ],
  );
  // o personagem principal tem o palco só para ele
  assert.deepEqual(groups[1].refIds, ["wera-8100-sb-6"]);
  // o nosso offset abre a marcha
  assert.deepEqual(groups[0].refIds, ["anex-aoa-17s1", "anex-436"]);
});

test("kit maker: basico has 4 branches including Screwdriver VDE and Chave de fenda clássica", () => {
  const basico = KIT_MAKER_STEPS.find((step) => step.id === "basico");
  assert.ok(basico, "basico step is missing");
  const branches = basico.branches ?? [];
  const labels = branches.map((branch) => branch.labelPt);
  assert.equal(labels.length, 4);
  assert.ok(labels.includes("Screwdriver VDE"), "basico lacks the VDE submenu");
  assert.ok(labels.includes("Chave de fenda clássica"), "basico lacks the classic driver branch");
  assert.ok(labels.includes("Screwdriver ratchet"));
  assert.ok(labels.includes("Hold bit (porta-bits)"));
  // o ramo VDE tem de levar ponteiras realmente isoladas
  const vde = branches.find((branch) => branch.labelPt === "Screwdriver VDE");
  for (const refId of vde.refIds) {
    assert.match(refId, /(vde|ins|7920|7900|960)/, `${refId} does not look like a VDE driver`);
  }
});
