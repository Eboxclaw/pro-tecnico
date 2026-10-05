import { Link } from "@tanstack/react-router";
import { ArrowRight, Box } from "lucide-react";
import { referenceById } from "@/data/curated-tool-references";
import { REJENDARI_KITS, type RejendariKit } from "@/data/kits";
import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import { Button } from "@/components/ui/button";
import { RejendariSeal } from "@/components/brand/RejendariSeal";

const FORMAT_MARK: Record<RejendariKit["format"], { glyph: string; label: string }> = {
  mala: { glyph: "鞄", label: "mala de trabalho" },
  kit: { glyph: "組", label: "kit de sistema" },
  caixa: { glyph: "箱", label: "caixa de ofício" },
};

function KitCard({ kit, index, compact }: { kit: RejendariKit; index: number; compact?: boolean }) {
  const pieces = kit.pieces.flatMap((piece) => {
    const tool = referenceById(piece.id);
    return tool ? [{ tool, quantity: piece.quantity, whyPt: piece.whyPt }] : [];
  });
  const mark = FORMAT_MARK[kit.format];
  return (
    <article className="flex flex-col border border-border bg-card transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(42,36,29,0.14)]">
      <header className="border-b border-border bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="jp-label text-primary">
            <span aria-hidden className="mr-2 font-display text-base">
              {mark.glyph}
            </span>
            {kit.jp}
          </p>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            0{index + 1} · {mark.label}
          </span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-[-0.03em]">
          {kit.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-foreground/80">{kit.conceptPt}</p>
        {!compact && (
          <p className="mt-3 border-l-2 border-primary/40 pl-3 text-sm leading-7 text-muted-foreground">
            {kit.dayPt}
          </p>
        )}
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
              <span className="product-plate block h-14 w-14 overflow-hidden border border-border">
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
            {kit.notIncludedPt.join(" · ")}
          </p>
        </div>
        <p className="border-l-2 border-primary/40 pl-3 text-xs leading-5 text-muted-foreground">
          {kit.limitationsPt}
        </p>
        <Button className="w-full rounded-none" asChild>
          <Link to="/b2b" search={{ kit: kit.id }}>
            <Box className="mr-2 h-4 w-4" />
            Pedir este kit no B2B
          </Link>
        </Button>
      </footer>
    </article>
  );
}

export function KitsShowcase() {
  const malas = REJENDARI_KITS.filter((kit) => kit.format === "mala");
  const kits = REJENDARI_KITS.filter((kit) => kit.format === "kit");
  const caixas = REJENDARI_KITS.filter((kit) => kit.format === "caixa");
  return (
    <section className="border-b border-border bg-surface/45">
      <div className="relative mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
        <RejendariSeal className="absolute -top-2 right-6 z-10 hidden h-20 w-20 opacity-80 lg:grid" />
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="jp-label text-primary">最初のキット · os primeiros kits REJENDARI</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
              Onze composições.
              <br />
              <span className="text-primary">Nada que não ganhe o seu lugar.</span>
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            A inspiração vem de duas escolas: a produção integrada da ANEX em Sanjō, 一貫生産, cada
            bit do aço ao fio nas mesmas mãos, e a escola "Tool Rebel" da Wera, que provou que uma
            caixa pequena bem pensada é um milagre de espaço. Dois kits dominam uma família até ao
            fim; seis malas cobrem profissões, três caixas cobrem o dia de um ofício. Cross bit
            utilization: cada bit serve o 397, a impacto e a Zyklop. Cada peça já tem ficha própria:
            o pedido segue para o B2B com a composição preenchida, sem SKU inventado.
          </p>
        </div>

        <h3 className="mt-10 font-display text-2xl font-semibold tracking-[-0.03em]">
          Malas de trabalho
        </h3>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {malas.map((kit, index) => (
            <KitCard key={kit.id} kit={kit} index={index} />
          ))}
        </div>

        <h3 className="mt-14 font-display text-2xl font-semibold tracking-[-0.03em]">
          Kits de sistema
        </h3>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {kits.map((kit, index) => (
            <KitCard key={kit.id} kit={kit} index={malas.length + index} />
          ))}
        </div>

        <h3 className="mt-14 font-display text-2xl font-semibold tracking-[-0.03em]">
          Caixas de ofício
        </h3>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {caixas.map((kit, index) => (
            <KitCard key={kit.id} kit={kit} index={malas.length + kits.length + index} compact />
          ))}
        </div>

        <p className="mt-8 flex items-center gap-2 text-xs leading-5 text-muted-foreground">
          <ArrowRight className="h-3.5 w-3.5 text-primary" />
          Composição à medida para empresa ou equipa: diz-nos o que já tens e construímos à volta,
          sem duplicados.
        </p>
      </div>
    </section>
  );
}
