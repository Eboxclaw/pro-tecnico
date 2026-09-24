import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CircleDot, ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/marcas")({
  head: () => ({
    meta: [
      { title: "Marcas japonesas — Rejendarī" },
      { name: "description", content: "VESSEL e ANEX lideram a seleção Rejendarī de ferramenta profissional japonesa." },
      { property: "og:title", content: "Marcas japonesas — Rejendarī" },
      { property: "og:description", content: "Ferramenta japonesa escolhida por precisão, aplicação e suporte profissional." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrandsPage,
});

const ANCHORS = [
  { name: "VESSEL", specialty: "Aparafusar · Impacto · Bits" },
  { name: "ANEX", specialty: "Precisão · Adaptadores · ESD" },
];

const NEXT = ["ENGINEER", "FUJIYA", "TSUNODA", "TONE", "KO-KEN", "LOBTEX", "KTC", "TAJIMA", "OLFA", "SILKY"];

function BrandsPage() {
  const t = useT();

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="tech-label text-primary">日本の工具 · Ferramenta japonesa</p>
          <h1 className="mt-3 font-display text-4xl font-bold">{t("brands.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("brands.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          {ANCHORS.map((brand) => (
            <article key={brand.name} className="border border-border bg-card p-7">
              <div className="flex items-center justify-between gap-4">
                <span className="tech-label text-primary">{t("brands.anchor")}</span>
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-8 font-display text-4xl font-bold">{brand.name}</h2>
              <p className="mt-2 font-mono text-sm text-muted-foreground">{brand.specialty}</p>
              <Button className="mt-8" variant="secondary" asChild>
                <Link to="/shop" search={{ brand: brand.name }}>
                  {t("brands.detail")}<ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-10">
          <p className="tech-label text-muted-foreground">{t("brands.next")}</p>
          <div className="mt-5 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
            {NEXT.map((brand) => (
              <div key={brand} className="flex items-center gap-2 bg-surface px-4 py-5 font-mono text-sm">
                <CircleDot className="h-3.5 w-3.5 text-primary" />{brand}
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl border-l-2 border-primary pl-4 text-sm text-muted-foreground">{t("brands.originRule")}</p>
        </div>
      </section>
    </div>
  );
}