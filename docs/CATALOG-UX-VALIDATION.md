# Catalog UX validation

Base: GitHub main at 9ecbfc9. This change extends the existing REJENDARI components, brand system and curated references. It does not replace the current design or duplicate the image/logo work in PR #12.

## Changes

- Search curated references by brand, model, official code, name, application notes and specification; search loaded Shopify products by name, vendor, tags, category and SKU.
- Persist search, filters, ordering and reference pagination in the URL. Browser history restores filter state. Render at most 24 reference cards per page.
- Recoverable Shopify loading error; curated references remain separate from purchasable products. Price/category filters apply only to published products; focus filters apply to curated references.
- Keyboard access to existing navigation flyouts, skip link and accessible cart/filter labels.
- Preserve router history when consuming referral links; defer referral RPC outside the authentication callback; tolerate unavailable browser storage. Existing referral RPC and points schema are unchanged.
- Correct existing strict TypeScript errors for brand fallback and optional product imagery.

## Verified locally

- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `node --experimental-strip-types --test tests/catalog-search.test.mjs` (Node 22): 3 tests passed, covering search normalization, URL bounds and referral storage fallback.
- Browser: all 70 curated references available; search `VESSEL 220USB` returns two references; browser Back restores all 70 and clears the query; desktop layout inspected.

## Not validated

No staging environment was provided. Authenticated referral attribution, points balances, purchases, webhook delivery and order history were not exercised against live services. No production data or migrations were changed. This is a catalog/navigation improvement, not certification of the complete commerce flow. Shopify search currently covers the existing first-100-product fetch; it is not a server-wide search. Mobile and full assistive-technology audit remain outstanding.
