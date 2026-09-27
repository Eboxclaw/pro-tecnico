export type CatalogSearch = {
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
  return normalizeCatalogText(query).split(/\s+/).every((word) => haystack.includes(word));
}
