export type CatalogSearch = {
  literal?: boolean | undefined;
  brand?: string | undefined;
  task?: string | undefined;
  focus?: string | undefined;
  category?: string | undefined;
  maxPrice?: string | undefined;
  q?: string | undefined;
  sort?: string | undefined;
  page?: number | undefined;
};

export function parseCatalogSearch(input: Record<string, unknown>): CatalogSearch {
  const text = (key: string) => typeof input[key] === "string" ? input[key].trim().slice(0, 160) || undefined : undefined;
  const price = Number(input["maxPrice"]);
  const page = Number(input["page"]);
  return {
    literal: input["literal"] === true || input["literal"] === "true" ? true : undefined,
    brand: text("brand"), task: text("task"), focus: text("focus"), category: text("category"), q: text("q"),
    maxPrice: Number.isFinite(price) && price > 0 ? String(price) : undefined,
    sort: input["sort"] === "name" ? "name" : undefined,
    page: Number.isSafeInteger(page) && page > 1 ? Math.min(page, 10000) : undefined,
  };
}

export function normalizeCatalogText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function matchesCatalogQuery(query: string, values: Array<string | null | undefined>) {
  const haystack = normalizeCatalogText(values.filter(Boolean).join(" "));
  // "1000v" deve encontrar "1000 V": tolerância de tokenização, não interpretação.
  const packed = haystack.replace(/ /g, "");
  return normalizeCatalogText(query).split(/\s+/).every((word) => haystack.includes(word) || packed.includes(word.replace(/ /g, "")));
}


export type SearchIntent = { id: string; label: string; dimension: "focus" | "task" | "certification" };
const ALIASES: Array<SearchIntent & { pattern: RegExp }> = [
  { id: "vde", label: "VDE documentado", dimension: "certification", pattern: /\bvde\b/g },
  { id: "insulated", label: "1000 V / isoladas", dimension: "focus", pattern: /\b(1000\s*v|isolad[oa]s?)\b/g },
  { id: "diamond", label: "Bits Diamante", dimension: "focus", pattern: /\b(diamant[e]?|diamond)\b/g },
  { id: "ratchet", label: "Roquetes", dimension: "focus", pattern: /\b(ratchet|roquetes?|catracas?)\b/g },
  { id: "impact-bits", label: "Bits de impacto", dimension: "focus", pattern: /\bimpacto\b/g },
  { id: "torque", label: "Controlo de binário", dimension: "focus", pattern: /\b(torque|binario)\b/g },
  { id: "extraction", label: "Extração", dimension: "focus", pattern: /\b(extracao|extractor|extrator|extratores)\b/g },
  { id: "wrenches", label: "Chaves ajustáveis", dimension: "focus", pattern: /\b(inglesa|ajustavel|ajustaveis)\b/g },
  { id: "sockets", label: "Sockets", dimension: "task", pattern: /\bsockets?\b/g },
];

/** Consume only whole aliases; brand, profile and exact model codes remain literal. */
export function interpretSmartQuery(query: string) {
  let residual = normalizeCatalogText(query);
  const intents: SearchIntent[] = [];
  for (const { pattern, ...intent } of ALIASES) {
    let found = false;
    residual = residual.replace(pattern, () => { found = true; return " "; });
    if (found) intents.push(intent);
  }
  return { intents, residual: residual.replace(/\s+/g, " ").trim() };
}

export function resolveSmartQuery(search: CatalogSearch) {
  if (search.literal) return { intents: [] as SearchIntent[], residual: search.q ?? "" };
  const result = interpretSmartQuery(search.q ?? "");
  return { ...result, intents: result.intents.filter((intent) =>
    !(intent.dimension === "focus" && search.focus) && !(intent.dimension === "task" && search.task)) };
}

/** Shopify attributes must be explicitly curated, never inferred from marketing copy. */
export function matchesStructuredIntents(tags: string[], intents: SearchIntent[]) {
  const normalized = new Set(tags.map((tag) => tag.trim().toLowerCase()));
  return intents.every(({ id, dimension }) => normalized.has(`${dimension}:${id}`));
}
