import { test } from "node:test";
import assert from "node:assert/strict";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";
import {
  REJENDARI_SYSTEMS,
  communityDemand,
  featuredSystem,
  isReservable,
  systemById,
  systemsOfKind,
  labSystems,
} from "@/data/systems";

const VALID_STATUSES = new Set(["available", "reserving", "negotiating", "lab", "sold_through"]);
const VALID_KINDS = new Set(["system", "module"]);
const VALID_ROLES = new Set([
  "MANUAL",
  "LOCK",
  "IMPACT",
  "REACH",
  "FASTENERS",
  "DRIVE",
  "CONTROL",
  "REPAIR",
]);
const catalogIds = new Set(CURATED_TOOL_REFERENCES.map((tool) => tool.id));
const systemIds = new Set(REJENDARI_SYSTEMS.map((system) => system.id));

test("systems: ids únicos, kind e status válidos", () => {
  assert.ok(REJENDARI_SYSTEMS.length >= 10, "o catálogo tem systems e módulos suficientes");
  const ids = REJENDARI_SYSTEMS.map((system) => system.id);
  assert.equal(new Set(ids).size, ids.length, "ids de system repetidos");

  for (const system of REJENDARI_SYSTEMS) {
    assert.ok(VALID_KINDS.has(system.kind), `${system.id}: kind inválido`);
    assert.ok(VALID_STATUSES.has(system.status), `${system.id}: status inválido`);
    assert.ok(system.name.length > 2, `${system.id}: nome curto`);
    assert.ok(system.jp.length > 0, `${system.id}: falta o rótulo japonês`);
    assert.ok(system.taglinePt.length > 20, `${system.id}: tagline demasiado curta`);
    assert.ok(
      system.capabilitiesPt.length >= 2 && system.capabilitiesPt.length <= 3,
      `${system.id}: cards levam 2-3 capacidades, não uma parede de texto`,
    );
    assert.ok(
      Array.isArray(system.modules) && system.modules.length > 0,
      `${system.id}: sem módulos`,
    );
  }
});

test("systems: todas as peças resolvem no catálogo curado", () => {
  for (const system of REJENDARI_SYSTEMS) {
    for (const module of system.modules) {
      assert.ok(
        VALID_ROLES.has(module.role),
        `${system.id}: role de módulo inválido (${module.role})`,
      );
      assert.ok(module.title.length > 2, `${system.id}/${module.role}: título de módulo curto`);

      for (const piece of module.pieces) {
        assert.ok(
          catalogIds.has(piece.refId),
          `${system.id}/${module.role}: peça ${piece.refId} não existe em CURATED_TOOL_REFERENCES — nada de referências inventadas`,
        );
        assert.ok(
          piece.whyPt.length > 10,
          `${system.id}/${module.role}: falta a razão funcional de ${piece.refId}`,
        );
        assert.ok(
          piece.qty === undefined || (Number.isInteger(piece.qty) && piece.qty >= 1),
          `${system.id}/${module.role}: quantidade inválida em ${piece.refId}`,
        );
      }

      const total = module.pieces.length + (module.pendingPt?.length ?? 0);
      assert.ok(
        total > 0,
        `${system.id}/${module.role}: módulo vazio — peças ou sourcing explícito`,
      );
    }
  }
});

test("systems: imagem e âncora apontam para referências reais", () => {
  for (const system of REJENDARI_SYSTEMS) {
    if (system.imageRefId) {
      assert.ok(catalogIds.has(system.imageRefId), `${system.id}: imageRefId desconhecido`);
    }
    if (system.leadRefId) {
      assert.ok(catalogIds.has(system.leadRefId), `${system.id}: leadRefId desconhecido`);
    }
  }
});

test("systems: featured drop existe e está em reservas com MOQ e target price", () => {
  const featured = featuredSystem();
  assert.ok(featured, "falta o featured drop");
  assert.equal(featured.id, "397-lock-system");
  assert.equal(featured.status, "reserving");
  assert.ok(featured.targetMoq && featured.targetMoq >= 50, "featured drop sem MOQ realista");
  assert.ok(featured.targetPriceEur && featured.targetPriceEur.min < featured.targetPriceEur.max);
});

test("systems: lab não vende, reservável só em reserving/negotiating", () => {
  for (const system of REJENDARI_SYSTEMS) {
    if (system.status === "lab") {
      assert.equal(system.targetPriceEur, undefined, `${system.id}: lab não tem preço`);
      assert.equal(system.targetMoq, undefined, `${system.id}: lab não tem MOQ`);
      assert.equal(isReservable(system), false, `${system.id}: lab não é reservável`);
    }
    if (system.status === "reserving" || system.status === "negotiating") {
      assert.equal(isReservable(system), true, `${system.id}: devia ser reservável`);
      if (system.targetPriceEur) {
        assert.ok(
          system.targetPriceEur.min > 0 && system.targetPriceEur.min < system.targetPriceEur.max,
        );
      }
    }
  }
  assert.ok(labSystems().length >= 2, "o Lab precisa de pelo menos duas combinações em estudo");
});

test("systems: sem números seed — os contadores exibidos são só procura real", () => {
  for (const system of REJENDARI_SYSTEMS) {
    assert.equal(
      system.seedDemand,
      undefined,
      `${system.id}: seedDemand foi removido; contadores são só reais`,
    );
  }
  // sem interações reais, o que se exibe é zero em tudo
  assert.ok(REJENDARI_SYSTEMS.length > 0);
});

test("systems: perfect matches apontam para systems existentes", () => {
  for (const system of REJENDARI_SYSTEMS) {
    for (const match of system.perfectMatches ?? []) {
      assert.ok(
        systemIds.has(match.targetId),
        `${system.id}: perfect match ${match.targetId} não existe`,
      );
      assert.notEqual(match.targetId, system.id, `${system.id}: perfect match para si próprio`);
      assert.ok(match.reasonPt.length > 15, `${system.id}: recomendação sem razão funcional`);
    }
  }
});

test("systems: helpers e procura da comunidade (dados 100% reais)", () => {
  assert.ok(systemsOfKind("system").length >= 4, "faltam systems");
  assert.ok(systemsOfKind("module").length >= 5, "faltam módulos");
  assert.ok(systemById("397-system"), "397-system é o flagship template");
  assert.ok(systemById("desconhecido") === undefined);

  // sem procura real: listas vazias — a UI mostra o estado "sê o primeiro"
  const vazia = communityDemand();
  assert.equal(vazia.mostWanted.length, 0);
  assert.equal(vazia.fastestGrowing.length, 0);
  assert.equal(vazia.almostUnlocked.length, 0);

  // com procura real: ordenação por unidades e likes reais
  const comReal = communityDemand(
    { "ph-work-pack": 40, "397-lock-system": 10 },
    { "397-lock-system": 30 },
  );
  assert.equal(comReal.mostWanted[0].id, "ph-work-pack");
  assert.equal(comReal.fastestGrowing[0].id, "397-lock-system");
  assert.equal(comReal.almostUnlocked[0].id, "ph-work-pack");
});
