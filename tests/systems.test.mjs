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
  assert.ok(REJENDARI_SYSTEMS.length >= 10, "o catálogo seed tem systems e módulos suficientes");
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
      `${system.id}: cards levam 2–3 capacidades, não uma parede de texto`,
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
  // 64/100 do documento direcional: reservas abaixo do MOQ, drop ainda não confirmado
  assert.ok(
    featured.seedDemand.units < featured.targetMoq,
    "seed do featured não pode já estar desbloqueado",
  );
});

test("systems: lab não vende, reservável só em reserving/negotiating", () => {
  for (const system of REJENDARI_SYSTEMS) {
    if (system.status === "lab") {
      assert.equal(system.targetPriceEur, undefined, `${system.id}: lab não tem preço`);
      assert.equal(system.targetMoq, undefined, `${system.id}: lab não tem MOQ`);
      assert.equal(system.seedDemand.reservations, 0, `${system.id}: lab não tem reservas seed`);
      assert.equal(system.seedDemand.units, 0, `${system.id}: lab não tem unidades seed`);
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

test("systems: procura seed coerente (unidades abaixo do MOQ em reservas abertas)", () => {
  for (const system of REJENDARI_SYSTEMS) {
    const { likes, favorites, reservations, units, momentum } = system.seedDemand;
    for (const [field, value] of Object.entries({
      likes,
      favorites,
      reservations,
      units,
      momentum,
    })) {
      assert.ok(
        Number.isInteger(value) && value >= 0,
        `${system.id}: seedDemand.${field} inválido`,
      );
    }
    assert.ok(momentum <= 100, `${system.id}: momentum é um índice 0–100`);
    assert.ok(
      favorites >= reservations,
      `${system.id}: favoritos < reservas não faz sentido no seed`,
    );
    if (system.targetMoq && system.status !== "available") {
      assert.ok(
        units < system.targetMoq,
        `${system.id}: unidades seed (${units}) ≥ MOQ (${system.targetMoq}) mostraria DROP CONFIRMED com status aberto`,
      );
    }
  }
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

test("systems: helpers e procura da comunidade", () => {
  assert.ok(systemsOfKind("system").length >= 4, "faltam systems");
  assert.ok(systemsOfKind("module").length >= 5, "faltam módulos");
  assert.ok(systemById("397-system"), "397-system é o flagship template");
  assert.ok(systemById("desconhecido") === undefined);

  const community = communityDemand();
  assert.equal(community.mostWanted.length, 3);
  assert.equal(community.fastestGrowing.length, 3);
  assert.ok(community.almostUnlocked.length > 0);

  // Procura real soma-se ao seed na ordenação
  const withReal = communityDemand({ "ph-work-pack": 5 });
  assert.equal(
    withReal.mostWanted[0].id,
    "ph-work-pack",
    "reservas reais devem subir o system no ranking",
  );
});
