import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { useT, useLocale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";

export const Route = createFileRoute("/packs")({
  head: () => ({
    meta: [
      { title: "Professional tool packs — REJENDARI" },
      {
        name: "description",
        content: "Curated Core, Compact and Pro tool packs for HVAC, electrical, maintenance, solar and installation work.",
      },
      { property: "og:title", content: "Professional packs — REJENDARI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PacksPage,
});

const TRADES: Array<{
  key: string;
  icon: ToolGlyphName;
  label: { pt: string; en: string; es: string };
  desc: string;
}> = [
  { key: "hvac", icon: "hvac", label: { pt: "AVAC", en: "HVAC", es: "HVAC" }, desc: "Heat pumps, split systems and installation." },
  { key: "electrical", icon: "precision", label: { pt: "Eletricidade", en: "Electrical", es: "Electricidad" }, desc: "Panels, precision, measurement and fastening." },
  { key: "maintenance", icon: "socket", label: { pt: "Manutenção", en: "Maintenance", es: "Mantenimiento" }, desc: "Industrial maintenance and technical facilities." },
  { key: "solar", icon: "power", label: { pt: "Solar", en: "Solar", es: "Solar" }, desc: "PV installation, storage and field service." },
  { key: "plumbing", icon: "grip", label: { pt: "Canalização", en: "Plumbing", es: "Fontanería" }, desc: "Grip, wrenches, water and heating work." },
];

function PacksPage() {
  const t = useT();
  const locale = useLocale((s) => s.locale);

  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <p className="tech-label text-primary">REJENDARI / Kits</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
            Less duplicate weight.
            <br />
            <span className="text-primary">More useful coverage.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">{t("packs.subtitle")}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:py-16">
        <div className="space-y-4">
          {TRADES.map((trade, tradeIndex) => (
            <article key={trade.key} className="grid border border-border bg-card lg:grid-cols-[0.6fr_1.4fr]">
              <div className="technical-grid border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-8">
                <div className="flex items-center justify-between">
                  <ToolGlyph name={trade.icon} className="h-8 w-8 text-primary" />
                  <span className="font-mono text-[10px] text-muted-foreground">0{tradeIndex + 1}</span>
                </div>
                <h2 className="mt-8 font-display text-3xl font-semibold tracking-[-0.045em]">{trade.label[locale]}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{trade.desc}</p>
                <span className="tech-label mt-7 flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {t("packs.soon")}
                </span>
              </div>

              <div className="grid gap-px bg-border sm:grid-cols-3">
                {[
                  { tier: t("packs.core"), desc: t("packs.coreDesc"), code: "01" },
                  { tier: t("packs.compact"), desc: t("packs.compactDesc"), code: "02" },
                  { tier: t("packs.pro"), desc: t("packs.proDesc"), code: "03" },
                ].map(({ tier, desc, code }) => (
                  <div key={tier} className="flex min-h-52 flex-col bg-surface p-6">
                    <div className="flex items-center justify-between">
                      <p className="tech-label text-primary">{tier}</p>
                      <span className="font-mono text-[9px] text-muted-foreground">{code}</span>
                    </div>
                    <p className="mt-auto text-sm leading-6 text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="paper-panel mt-8 grid gap-6 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">Catalog-dependent</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/65">
              Packs only become purchasable after the individual products, stock and supplier-approved data exist in Shopify. No fictional bundle pricing.
            </p>
          </div>
          <Button className="rounded-none bg-black text-white hover:bg-black/85" asChild>
            <Link to="/b2b">
              {t("b2b.submit")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
