import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CURATED_TOOL_REFERENCES,
  QUICK_BRANDS,
  SHOWCASED_BRANDS,
  isShowcasedBrand,
  referencesForBrand,
  referencesForFocus,
  referencesForTask,
  showcasedReferences,
  referenceById,
} from "@/data/curated-tool-references";
import { BRAND_STORIES } from "@/data/brand-stories";
import { REJENDARI_KITS } from "@/data/kits";
import { SMART_PACKS } from "@/data/smart-packs";
import { LEGENDARY_COMBOS } from "@/data/legendary-combos";

const KEPT = ["ANEX", "MAKITA", "VESSEL", "WERA", "KNIPEX", "BAHCO", "TAJIMA", "OLFA"];

test("vitrina: exatamente as oito marcas mantidas, nada escondido na navegação", () => {
  assert.deepEqual([...SHOWCASED_BRANDS].sort(), [...KEPT].sort());
  assert.deepEqual([...QUICK_BRANDS].sort(), [...KEPT].sort());
  const hidden = [
    "KO-KEN",
    "WIHA",
    "TONE",
    "ENGINEER",
    "LOBSTER",
    "TSUNODA",
    "FUJIYA",
    "TOP",
    "HOZAN",
    "NEPROS",
  ];
  for (const brand of hidden) {
    assert.equal(isShowcasedBrand(brand), false, `${brand} devia estar fora da vitrina`);
    assert.deepEqual(referencesForBrand(brand), [], `${brand} não devia devolver referências`);
  }
});

test("vitrina: superfícies de navegação só devolvem marcas mantidas", () => {
  const surfaces = [
    ...referencesForTask("fastening"),
    ...referencesForTask("sockets"),
    ...referencesForFocus("ratchet"),
    ...referencesForFocus("insulated"),
    ...referencesForFocus("sets"),
    ...showcasedReferences(),
  ];
  const brands = new Set(surfaces.map((tool) => tool.brandSlug));
  for (const brand of brands) {
    assert.ok(isShowcasedBrand(brand), `marca ${brand} escapou-se à vitrina`);
  }
  assert.ok(showcasedReferences().length > 80, "a vitrina mantém a maioria do catálogo curado");
  assert.equal(
    referenceById("koken-3725z").id,
    "koken-3725z",
    "ids de reserva continuam a resolver para composições antigas",
  );
});

test("vitrina: composições (kits, packs, combos) sem marcas escondidas", () => {
  const catalogBrands = new Map(CURATED_TOOL_REFERENCES.map((tool) => [tool.id, tool.brandSlug]));

  for (const kit of REJENDARI_KITS) {
    for (const piece of kit.pieces) {
      const brand = catalogBrands.get(piece.id);
      assert.ok(brand, `${kit.id}: peça ${piece.id} não resolve`);
      assert.ok(isShowcasedBrand(brand), `${kit.id}: peça ${piece.id} é ${brand}, fora da vitrina`);
    }
  }

  for (const pack of SMART_PACKS) {
    for (const piece of pack.pieces) {
      const brand = catalogBrands.get(piece.id);
      assert.ok(brand, `${pack.id}: peça ${piece.id} não resolve`);
      assert.ok(
        isShowcasedBrand(brand),
        `${pack.id}: peça ${piece.id} é ${brand}, fora da vitrina`,
      );
    }
  }

  for (const combo of LEGENDARY_COMBOS) {
    for (const id of combo.ids) {
      const brand = catalogBrands.get(id);
      assert.ok(brand, `${combo.name}: id ${id} não resolve`);
      assert.ok(isShowcasedBrand(brand), `${combo.name}: id ${id} é ${brand}, fora da vitrina`);
    }
  }
});

test("vitrina: histórias de marca cobrem exatamente as oito mantidas", () => {
  const slugs = BRAND_STORIES.map((brand) => brand.slug);
  assert.deepEqual([...new Set(slugs)].sort(), [...KEPT].sort());
});
