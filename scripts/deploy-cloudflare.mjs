// Deploy para Cloudflare Workers — REJENDARI.
// O wrapper Lovable gera o wrangler.json com o nome do repo; este script
// corrige o nome do worker e injeta as variáveis publicáveis antes do deploy.
//
// Uso: bun run deploy:cloudflare   (requer `npx wrangler login` prévio)
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const NAME = "rejendari";
const ENV = JSON.parse(readFileSync(new URL("../.env", import.meta.url), "utf8"));
const vars = {};
for (const line of ENV.split("\n")) {
  const match = line.match(/^([A-Z_]+)="(.*)"$/);
  if (match) vars[match[1]] = match[2];
}

for (const path of [".output/server/wrangler.json", ".wrangler/deploy/config.json"]) {
  try {
    const config = JSON.parse(readFileSync(path, "utf8"));
    config.name = NAME;
    config.vars = { ...config.vars, ...vars };
    writeFileSync(path, JSON.stringify(config, null, 2));
    console.log(`${path} → worker "${NAME}" + ${Object.keys(vars).length} vars`);
  } catch {
    // ficheiro opcional (.wrangler pode não existir)
  }
}

const result = spawnSync("npx", ["-y", "wrangler", "deploy"], {
  cwd: ".output/server",
  stdio: "inherit",
});
process.exit(result.status ?? 1);
