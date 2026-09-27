import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { useT, useLocale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";

export const Route = createFileRoute("/packs")({
  head: () => ({
    meta: [
      { title: "Malas e kits profissionais — REJENDARI" },
      {
        name: "description",
        content: "Kits Core, Compact e Pro para AVAC, eletricidade, manutenção, solar e instalação.",
      },
      { property: "og:title", content: "Kits profissionais — REJENDARI" },
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
  { key: "hvac", icon: "hvac", label: { pt: "AVAC", en: "HVAC", es: "HVAC" }, desc: "Bombas de calor, sistemas split e instalação." },
  { key: "electrical", icon: "precision", label: { pt: "Eletricidade", en: "Electrical", es: "Electricidad" }, desc: "Quadros, precisão, medição e aperto." },
  { key: "maintenance", icon: "socket", label: { pt: "Manutenção", en: "Maintenance", es: "Mantenimiento" }, desc: "Manutenção industrial e instalações técnicas." },
  { key: "solar", icon: "power", label: { pt: "Solar", en: "Solar", es: "Solar" }, desc: "Instalação fotovoltaica, armazenamento e assistência em obra." },
  { key: "plumbing", icon: "grip", label: { pt: "Canalização", en: "Plumbing", es: "Fontanería" }, desc: "Grip, chaves, água e aquecimento." },
];

function PacksPage() {
  const t = useT();
  const locale = useLocale((s) => s.locale);

  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <p className="jp-label text-primary">職人キット · REJENDARI / kits</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
            Menos peso duplicado.
            <br />
            <span className="text-primary">Mais cobertura útil.</span>
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
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">商品構成 · dependente do catálogo</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/65">
              Os kits só ficam disponíveis para compra quando os produtos individuais, stock e dados aprovados pelo fornecedor existirem no Shopify. Sem preços fictícios de bundle.
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
