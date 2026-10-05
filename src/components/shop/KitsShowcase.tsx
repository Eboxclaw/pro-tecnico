import { Link } from "@tanstack/react-router";
import { ArrowRight, Box } from "lucide-react";
import { referenceById } from "@/data/curated-tool-references";
import { REJENDARI_KITS, type RejendariKit, type RejendariKitFormat } from "@/data/kits";
import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RejendariSeal } from "@/components/brand/RejendariSeal";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FORMAT_MARK: Record<RejendariKit["format"], { glyph: string; label: string }> = {
  mala: { glyph: "鞄", label: "mala de trabalho" },
  kit: { glyph: "組", label: "kit de sistema" },
  caixa: { glyph: "箱", label: "caixa de ofício" },
};

type Filter = "all" | RejendariKitFormat;

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "mala", label: "Malas de trabalho" },
  { id: "kit", label: "Kits de sistema" },
  { id: "caixa", label: "Caixas de ofício" },
];

/** Card compacto: identidade + gancho; o detalhe completo abre em janela. */
function KitCompactCard({
  kit,
  index,
  onOpen,
}: {
  kit: RejendariKit;
  index: number;
  onOpen: () => void;
}) {
  const mark = FORMAT_MARK[kit.format];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex min-h-52 flex-col border border-border bg-card p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_20px_50px_rgba(42,36,29,0.16)]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="jp-label text-primary">
          <span aria-hidden className="mr-2 font-display text-base">
            {mark.glyph}
          </span>
          {kit.jp}
        </p>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          0{index + 1}
        </span>
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold leading-tight tracking-[-0.03em] group-hover:text-primary">
        {kit.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{kit.conceptPt}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-primary">
          {kit.pieces.length} peças · {mark.label}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground transition-all group-hover:text-primary">
          Ver dentro
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}

/** Janela com o detalhe completo do kit (a ficha que estava inline antes). */
function KitDetailDialog({
  kit,
  index,
  open,
  onOpenChange,
}: {
  kit: RejendariKit;
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mark = FORMAT_MARK[kit.format];
  const pieces = kit.pieces.flatMap((piece) => {
    const tool = referenceById(piece.id);
    return tool ? [{ tool, quantity: piece.quantity, whyPt: piece.whyPt }] : [];
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto rounded-none border-border bg-card p-0">
        <DialogHeader className="space-y-0 border-b border-border bg-surface p-6 text-left">
          <p className="jp-label text-primary">
            <span aria-hidden className="mr-2 font-display text-base">
              {mark.glyph}
            </span>
            {kit.jp}
          </p>
          <DialogTitle className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.03em]">
            {kit.title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-6 text-foreground/80">
            {kit.conceptPt}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <p className="border-l-2 border-primary/40 pl-3 text-sm leading-7 text-muted-foreground">
            {kit.dayPt}
          </p>

          <ul className="mt-5 divide-y divide-border border-y border-border">
            {pieces.map(({ tool, quantity, whyPt }) => (
              <li key={tool.id} className="flex items-start gap-4 py-3">
                <Link
                  to="/referencia/$id"
                  params={{ id: tool.id }}
                  aria-label={`${tool.brand} ${tool.model}`}
                >
                  <span className="product-plate block h-12 w-12 overflow-hidden border border-border">
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
                        label={tool.namePt}
                        className="flex h-full w-full items-center justify-center"
                      />
                    )}
                  </span>
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    <Link
                      to="/referencia/$id"
                      params={{ id: tool.id }}
                      className="hover:text-primary"
                    >
                      {tool.brand} {tool.model}
                    </Link>
                    {quantity > 1 && (
                      <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                        × {quantity}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{whyPt}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-3 text-xs leading-5 text-muted-foreground">
            <p>
              <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-foreground">
                Não inclui:{" "}
              </span>
              {kit.notIncludedPt.join(" · ")}
            </p>
            <p className="border-l-2 border-primary/40 pl-3">{kit.limitationsPt}</p>
          </div>

          <Button className="mt-5 w-full rounded-none" asChild>
            <Link to="/b2b" search={{ kit: kit.id }}>
              <Box className="mr-2 h-4 w-4" />
              Pedir este kit no B2B
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function KitsShowcase() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<{ kit: RejendariKit; index: number } | null>(null);

  const visible = REJENDARI_KITS.filter((kit) => filter === "all" || kit.format === filter);
  const malas = REJENDARI_KITS.filter((kit) => kit.format === "mala").length;
  const kitsCount = REJENDARI_KITS.filter((kit) => kit.format === "kit").length;
  const caixas = REJENDARI_KITS.filter((kit) => kit.format === "caixa").length;

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
            caixa pequena bem pensada é um milagre de espaço. {malas} malas cobrem profissões,{" "}
            {kitsCount} kits dominam uma família, {caixas} caixas cobrem o dia de um ofício. Cross
            bit utilization: cada bit serve o 397, a impacto e a Zyklop. O pedido segue para o B2B
            com a composição preenchida, sem SKU inventado.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              aria-pressed={filter === option.id}
              className={cn(
                "border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] transition-colors",
                filter === option.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((kit, index) => (
            <KitCompactCard
              key={kit.id}
              kit={kit}
              index={index}
              onOpen={() => setSelected({ kit, index })}
            />
          ))}
        </div>

        <p className="mt-8 flex items-center gap-2 text-xs leading-5 text-muted-foreground">
          <ArrowRight className="h-3.5 w-3.5 text-primary" />
          Clica numa composição para ver a lista completa peça a peça, com o porque de cada uma.
        </p>
      </div>

      {selected && (
        <KitDetailDialog
          kit={selected.kit}
          index={selected.index}
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        />
      )}
    </section>
  );
}
