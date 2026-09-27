import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/marcas")({
  head: () => ({
    meta: [
      { title: "Marcas de ferramenta japonesa — REJENDARI" },
      {
        name: "description",
        content:
          "VESSEL, Ko-ken, OLFA, LOBSTER / LOBTEX, ANEX, Makita, ENGINEER, Fujiya, Tsunoda, TONE, KTC, Tajima e Silky.",
      },
      { property: "og:title", content: "Marcas de ferramenta japonesa — REJENDARI" },
      { property: "og:description", content: "Uma seleção técnica e curada de fabricantes japoneses de ferramenta profissional." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrandsPage,
});

const BRANDS = [
  { name: "VESSEL", jp: "ドライバー", specialty: "Chaves · bits de impacto · Ball Grip", status: "Destaque REJENDARI" },
  { name: "KO-KEN", jp: "ソケット", specialty: "Sockets · roquetes · drive tools", status: "Destaque REJENDARI" },
  { name: "OLFA", jp: "カッター", specialty: "Lâminas profissionais · cutters", status: "Destaque REJENDARI" },
  { name: "LOBSTER / LOBTEX", jp: "作業工具", specialty: "Rebitagem · chaves · ferramenta manual", status: "Destaque REJENDARI" },
  { name: "ANEX", jp: "締結工具", specialty: "Precisão · bit holders · offset · ESD", status: "Destaque REJENDARI" },
  { name: "MAKITA", jp: "電動工具", specialty: "Ecossistema sem fios 18V+", status: "Destaque 18V" },
  { name: "ENGINEER", jp: "精密工具", specialty: "Extração · precisão · alicates", status: "Especialista japonês" },
  { name: "FUJIYA", jp: "プライヤー", specialty: "Alicates · corte · eletricidade", status: "Especialista japonês" },
  { name: "TSUNODA", jp: "作業工具", specialty: "Alicates · grip de precisão", status: "Especialista japonês" },
  { name: "TONE", jp: "整備工具", specialty: "Sockets · torque · mecânica", status: "Especialista japonês" },
  { name: "KTC", jp: "整備工具", specialty: "Automóvel · sockets · assistência", status: "Especialista japonês" },
  { name: "TAJIMA", jp: "測定・切削", specialty: "Medição · marcação · corte · obra", status: "Especialista japonês" },
  { name: "SILKY", jp: "鋸", specialty: "Serras profissionais · corte arborista", status: "Especialista japonês" },
];

function BrandsPage() {
  const t = useT();

  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <p className="jp-label text-primary">日本の工具 · fabricantes japoneses</p>
          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
              Japão, marca a marca.
              <br />
              <span className="text-primary">Especialistas para trabalhos diferentes.</span>
            </h1>
            <div>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">{t("brands.subtitle")}</p>
              <p className="mt-5 border-l border-primary/70 pl-4 font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-muted-foreground">
                A origem da marca e o país de fabrico são dados diferentes. Quando o fabrico está confirmado para uma referência,
                indicamo-lo na ficha do produto.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-20">
        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {BRANDS.map((brand, index) => (
            <article key={brand.name} className="group relative min-h-64 overflow-hidden bg-card p-6 sm:p-7">
              <span className="absolute right-5 top-4 font-mono text-5xl font-semibold tracking-[-0.08em] text-white/[0.035]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center justify-between gap-4">
                  <span className="tech-label text-muted-foreground">{brand.status}</span>
                  {index < 6 && <ShieldCheck className="h-4 w-4 text-primary" />}
                </div>
                <p className="jp-label mt-10 text-primary/70">{brand.jp}</p>
                <h2 className="mt-1 font-display text-3xl font-semibold tracking-[-0.05em]">{brand.name}</h2>
                <p className="mt-2 font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-muted-foreground">
                  {brand.specialty}
                </p>
                <Button className="mt-auto w-fit rounded-none px-0" variant="ghost" asChild>
                  <Link to="/shop" search={{ brand: brand.name.split(" / ")[0] }}>
                    {t("brands.detail")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="paper-panel mt-10 grid gap-8 p-7 sm:p-10 lg:grid-cols-[0.7fr_1.3fr] lg:p-12">
          <div>
            <p className="jp-label text-black/48">選定 · como escolhemos</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1] tracking-[-0.05em]">
              Cada marca tem de acrescentar alguma coisa.
            </h2>
          </div>
          <div className="grid gap-5 text-sm leading-6 text-black/62 sm:grid-cols-2">
            <p>
              Procuramos fabricantes fortes numa tarefa concreta: aparafusamento, sockets, corte, grip, medição, eletricidade
              ou máquinas. A especialização conta mais do que ter um catálogo enorme.
            </p>
            <p>
              Dentro de cada marca, damos prioridade às referências que fazem sentido para profissionais: compatibilidade clara,
              boa ergonomia, construção adequada e suporte que permita continuar a usar a ferramenta.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
