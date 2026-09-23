import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { useT, useLocale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/packs")({
  head: () => ({
    meta: [
      { title: "Packs por profissão — Rejendarī" },
      {
        name: "description",
        content: "Packs de ferramenta profissional por profissão — AVAC, eletricista, manutenção, solar e canalização — em três níveis: Core, Compact e Pro.",
      },
      { property: "og:title", content: "Packs por profissão — Rejendarī" },
      {
        property: "og:description",
        content: "Conjuntos desenhados para o trabalho real, em três níveis: Core, Compact e Pro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PacksPage,
});

const TRADES = [
  { key: "hvac", label: { pt: "AVAC", en: "HVAC", es: "HVAC" }, desc: "Bombas de calor, split e climatização." },
  { key: "eletricista", label: { pt: "Eletricista", en: "Electrician", es: "Electricista" }, desc: "Quadros, VDE, medição e crimpagem." },
  { key: "manutencao", label: { pt: "Manutenção", en: "Maintenance", es: "Mantenimiento" }, desc: "Industrial e instalações técnicas." },
  { key: "solar", label: { pt: "Solar", en: "Solar", es: "Solar" }, desc: "Fotovoltaico e armazenamento." },
  { key: "canalizacao", label: { pt: "Canalização", en: "Plumbing", es: "Fontanería" }, desc: "Água, gás e aquecimento." },
];

function PacksPage() {
  const t = useT();
  const locale = useLocale((s) => s.locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t("packs.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("packs.subtitle")}</p>

      <div className="mt-8 space-y-6">
        {TRADES.map((trade) => (
          <div key={trade.key} className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl font-bold">{trade.label[locale]}</h2>
              <span className="tech-label flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3 w-3" />
                {t("packs.soon")}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{trade.desc}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { tier: t("packs.core"), desc: t("packs.coreDesc") },
                { tier: t("packs.compact"), desc: t("packs.compactDesc") },
                { tier: t("packs.pro"), desc: t("packs.proDesc") },
              ].map(({ tier, desc }) => (
                <div key={tier} className="rounded-md border border-border bg-surface p-4">
                  <p className="tech-label text-primary">{tier}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">{t("shop.emptyHint")}</p>
        <Button className="mt-4" variant="secondary" asChild>
          <Link to="/b2b">
            {t("b2b.submit")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

