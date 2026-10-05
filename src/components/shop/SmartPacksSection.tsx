import { Link } from "@tanstack/react-router";
import { RejendariSeal } from "@/components/brand/RejendariSeal";
import { ArrowRight, PackageCheck } from "lucide-react";
import { referenceById } from "@/data/curated-tool-references";
import { smartPacksByTrade, type SmartPack } from "@/data/smart-packs";
import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import { Button } from "@/components/ui/button";

const JOURNEY = [
  { jp: "準備", label: "Preparar", note: "medir e traçar antes de furar" },
  { jp: "実行", label: "Executar", note: "apertar no regime certo" },
  { jp: "調整", label: "Ajustar", note: "binário e acesso fino" },
  { jp: "収納", label: "Guardar", note: "a mala volta inteira ao fim do dia" },
];

const TIER_ORDER = ["Compact", "Core", "Pro"] as const;

function PackCard({ pack }: { pack: SmartPack }) {
  const pieces = pack.pieces.flatMap((piece) => {
    const tool = referenceById(piece.id);
    return tool ? [{ tool, quantity: piece.quantity, whyPt: piece.whyPt }] : [];
  });
  return (
    <article
      className="smart-pack-card flex flex-col border border-border bg-card"
      data-signature={pack.trade === "Assinatura REJENDARI" || undefined}
    >
      <header className="border-b border-border bg-surface p-5">
        <p className="jp-label text-primary">{pack.tier}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.03em]">
          {pack.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{pack.dayPt}</p>
      </header>
      <ul className="flex-1 divide-y divide-border">
        {pieces.map(({ tool, quantity, whyPt }) => (
          <li key={tool.id} className="flex items-start gap-4 p-4">
            <Link
              to="/referencia/$id"
              params={{ id: tool.id }}
              className="shrink-0"
              aria-label={`${tool.brand} ${tool.model}`}
            >
              <span className="product-plate block h-16 w-16 overflow-hidden border border-border">
                {tool.imageUrl ? (
                  <ProductImage
                    src={tool.imageUrl}
                    alt={tool.imageAlt ?? tool.namePt}
                    className="h-full w-full object-contain p-1"
                    loading="lazy"
                  />
                ) : (
                  <ProductMonogram
                    brand={tool.brand}
                    label={tool.model}
                    className="h-full w-full"
                  />
                )}
              </span>
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {tool.brand} {tool.model}
                {quantity > 1 ? ` × ${quantity}` : ""}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{whyPt}</p>
              <Link
                to="/referencia/$id"
                params={{ id: tool.id }}
                className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-primary hover:underline"
              >
                Ficha <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <footer className="space-y-3 border-t border-border p-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Não inclui
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {pack.notIncludedPt.join(" · ")}
          </p>
        </div>
        <p className="border-l-2 border-primary/40 pl-3 text-xs leading-5 text-muted-foreground">
          {pack.limitationsPt}
        </p>
        <Button className="w-full rounded-none" asChild>
          <Link to="/b2b" search={{ pack: pack.id }}>
            Pedir este pack no B2B
          </Link>
        </Button>
      </footer>
    </article>
  );
}

export function SmartPacksSection() {
  const trades = smartPacksByTrade();
  return (
    <section className="section-reveal border-y border-border bg-[#1b1917] py-16 text-[#f5f0e5] lg:py-24">
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6">
        <RejendariSeal className="absolute -top-2 right-6 z-10 hidden h-20 w-20 opacity-80 lg:grid" />
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="jp-label text-[#7a6ff0]">
              <PackageCheck className="mr-2 inline h-3.5 w-3.5" />
              一日の仕事 · packs para o dia de trabalho
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
              Não vendemos mais ferramentas. Desenhamos o dia.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/58">
            Cada pack REJENDARI é uma mala pensada para um dia real de trabalho: as peças
            escolhem-se umas pelas outras. Os níveis existem só quando a diferença é funcional,
            nunca para encher grelha. É proposta editorial: o pedido segue para o B2B com a
            composição preenchida, sem SKU inventado.
          </p>
        </div>

        <ol className="mt-10 grid gap-px border border-white/12 bg-white/12 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY.map((step, index) => (
            <li key={step.label} className="bg-[#23211d] p-5">
              <p className="jp-label text-[#7a6ff0]">{step.jp}</p>
              <p className="mt-2 text-sm font-medium">
                {index + 1}. {step.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-white/52">{step.note}</p>
            </li>
          ))}
        </ol>

        {trades.map(({ trade, packs }) => (
          <div key={trade} className="mt-14">
            <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{trade}</h3>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {[...packs]
                .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier))
                .map((pack) => (
                  <PackCard key={pack.id} pack={pack} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
