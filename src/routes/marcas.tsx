import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/marcas")({
  head: () => ({
    meta: [
      { title: "Japanese tool brands — REJENDARI" },
      {
        name: "description",
        content:
          "VESSEL, Ko-ken, OLFA, LOBSTER / LOBTEX, ANEX, Makita, ENGINEER, Fujiya, Tsunoda, TONE, KTC, Tajima and Silky.",
      },
      { property: "og:title", content: "Japanese tool brands — REJENDARI" },
      { property: "og:description", content: "A curated research pool of professional Japanese tool makers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrandsPage,
});

const BRANDS = [
  { name: "VESSEL", specialty: "Drivers · Impact bits · Megadora", status: "Core research pool" },
  { name: "KO-KEN", specialty: "Sockets · Ratchets · Drive tools", status: "Core research pool" },
  { name: "OLFA", specialty: "Professional blades · Cutters", status: "Core research pool" },
  { name: "LOBSTER / LOBTEX", specialty: "Riveting · Wrenches · Hand tools", status: "Core research pool" },
  { name: "ANEX", specialty: "Precision · Bit holders · ESD", status: "Core research pool" },
  { name: "MAKITA", specialty: "18V+ cordless ecosystems", status: "Power-tool research" },
  { name: "ENGINEER", specialty: "Extraction · Precision · Pliers", status: "Research pool" },
  { name: "FUJIYA", specialty: "Pliers · Cutting · Electrical", status: "Research pool" },
  { name: "TSUNODA", specialty: "Pliers · Precision gripping", status: "Research pool" },
  { name: "TONE", specialty: "Sockets · Torque · Automotive", status: "Research pool" },
  { name: "KTC", specialty: "Automotive · Sockets · Service tools", status: "Research pool" },
  { name: "TAJIMA", specialty: "Measurement · Cutting · Site tools", status: "Research pool" },
  { name: "SILKY", specialty: "Professional saws · Arborist cutting", status: "Research pool" },
];

function BrandsPage() {
  const t = useT();

  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <p className="tech-label text-primary">日本の工具 · Japanese tool makers</p>
          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
              More than two brands.
              <br />
              <span className="text-primary">One strict filter.</span>
            </h1>
            <div>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">{t("brands.subtitle")}</p>
              <p className="mt-5 border-l border-primary/70 pl-4 font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-muted-foreground">
                A brand can be Japanese while an individual SKU is manufactured elsewhere. We treat brand origin and
                manufacturing origin as separate product data.
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
                <h2 className="mt-12 font-display text-3xl font-semibold tracking-[-0.05em]">{brand.name}</h2>
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
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/48">What "in the pool" means</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1] tracking-[-0.05em]">
              Research is not the same as stocking.
            </h2>
          </div>
          <div className="grid gap-5 text-sm leading-6 text-black/62 sm:grid-cols-2">
            <p>
              A manufacturer enters the research pool because its engineering, category depth or specialist reputation
              is relevant. A product only enters the store after supplier access, pricing, warranty and technical data
              are verified.
            </p>
            <p>
              This keeps REJENDARI open to exceptional German, Swiss and American products later without turning the
              launch into an impossible inventory exercise. Japan remains the specialist core.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
