import { Link } from "@tanstack/react-router";
import { ArrowRight, Box, ChevronDown, ChevronUp } from "lucide-react";
import { referenceById, type CuratedToolReference } from "@/data/curated-tool-references";
import { REJENDARI_KITS, type RejendariKit, type RejendariKitFormat } from "@/data/kits";
import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import { ToolSymbols } from "@/components/shop/ToolSymbols";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RejendariSeal } from "@/components/brand/RejendariSeal";
import { useState, type CSSProperties } from "react";
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

type ResolvedKitPiece = {
  tool: CuratedToolReference;
  quantity: number;
  whyPt: string;
};

/** Peças da composição resolvidas contra o catálogo curado, pela ordem do kit. */
function resolveKitPieces(kit: RejendariKit): ResolvedKitPiece[] {
  return kit.pieces.flatMap((piece) => {
    const tool = referenceById(piece.id);
    return tool ? [{ tool, quantity: piece.quantity, whyPt: piece.whyPt }] : [];
  });
}

/** Marcas distintas da composição — os chips que provam que não é mono-marca. */
function kitBrands(pieces: ResolvedKitPiece[]): string[] {
  return [...new Set(pieces.map(({ tool }) => tool.brand))].slice(0, 4);
}

/** A gama Kurokin (Fujiya) merece chamada própria quando entra numa composição. */
function hasKurokin(brands: string[]): boolean {
  return brands.some((brand) => /kurokin|fujiya/i.test(brand));
}

/** Prato editorial de uma peça: fotografia quando existe, monograma quando não. */
function KitPiecePlate({
  piece,
  className,
  imageClassName,
}: {
  piece: ResolvedKitPiece;
  className: string;
  imageClassName: string;
}) {
  const { tool } = piece;
  return (
    <span className={cn("product-plate block overflow-hidden border border-border", className)}>
      {tool.imageUrl ? (
        <ProductImage
          src={tool.imageUrl}
          alt={tool.imageAlt ?? tool.namePt}
          className={imageClassName}
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
  );
}

/** Card compacto: herói fotográfico + leque de peças; o detalhe abre em janela. */
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
  const pieces = resolveKitPieces(kit);
  const hero = pieces[0];
  const fanPieces = [pieces[1], pieces[2]];
  const brands = kitBrands(pieces);
  const kurokin = hasKurokin(brands);

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ "--kit-enter-delay": `${index * 60}ms` } as CSSProperties}
      className="kit-card kit-card-enter group relative flex min-h-52 flex-col border border-border bg-card p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:rotate-x-2 hover:-rotate-y-2 hover:border-primary/60 hover:shadow-[0_20px_50px_rgba(42,36,29,0.16)]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="jp-label text-primary">
          <span aria-hidden className="mr-2 font-display text-base">
            {mark.glyph}
          </span>
          {kit.jp}
        </p>
        <span className="mono-caps text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {hero && (
        <div className="relative mt-4 h-28" aria-hidden="true">
          {fanPieces.map(
            (piece, fanIndex) =>
              piece && (
                <KitPiecePlate
                  key={piece.tool.id}
                  piece={piece}
                  className={cn(
                    "kit-fan absolute z-0 h-14 w-14 border-border/70",
                    `kit-fan-${fanIndex + 1}`,
                  )}
                  imageClassName="h-full w-full object-contain p-1"
                />
              ),
          )}
          <KitPiecePlate
            piece={hero}
            className="absolute bottom-0 right-0 z-[1] h-28 w-24 shadow-[0_14px_32px_rgba(42,36,29,0.24)]"
            imageClassName="h-full w-full object-contain p-2"
          />
        </div>
      )}

      <h3 className="mt-3 line-clamp-2 font-display text-xl font-semibold leading-tight tracking-[-0.03em] group-hover:text-primary">
        {kit.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{kit.conceptPt}</p>

      {brands.length > 0 && (
        <div className="mt-3">
          <p className="flex flex-wrap gap-1.5">
            {brands.map((brand) => (
              <span
                key={brand}
                className="mono-caps border border-border/80 px-1.5 py-0.5 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-foreground/80"
              >
                {brand}
              </span>
            ))}
          </p>
          {kurokin && <p className="mono-caps mt-2 text-primary">Kurokin dentro</p>}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="mono-caps text-primary">
          {kit.pieces.length} peças · {mark.label}
        </span>
        <span className="mono-caps inline-flex items-center gap-1.5 text-foreground transition-all group-hover:text-primary">
          Ver dentro
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}

/** Peça do kit com vista expansível: o chevron abre a ficha completa do artigo. */
function KitPieceRow({
  tool,
  quantity,
  whyPt,
}: {
  tool: CuratedToolReference;
  quantity: number;
  whyPt: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <li className="py-3">
      <div className="flex items-start gap-4">
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
            <Link to="/referencia/$id" params={{ id: tool.id }} className="hover:text-primary">
              {tool.brand} {tool.model}
            </Link>
            {quantity > 1 && (
              <span className="mono-caps ml-2 text-muted-foreground">× {quantity}</span>
            )}
          </p>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{whyPt}</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={
            expanded ? `Fechar ficha de ${tool.model}` : `Expandir ficha de ${tool.model}`
          }
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary sm:h-9 sm:w-9",
            expanded && "border-primary/60 text-primary",
          )}
        >
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          )}
        </button>
      </div>

      {expanded && (
        <div className="animate-in fade-in slide-in-from-top-1 mt-3 border-l-2 border-primary/40 bg-background/60 p-4 duration-300">
          <ToolSymbols tool={tool} />
          {tool.specPt && (
            <p className="mono-caps mt-3 leading-5 text-muted-foreground">{tool.specPt}</p>
          )}
          <p className="mt-3 text-xs leading-6 text-foreground/80">{tool.notePt}</p>
          {tool.storyPt && (
            <p className="mt-2 text-xs leading-6 text-muted-foreground">{tool.storyPt}</p>
          )}
          {tool.evidencePt && (
            <p className="mono-caps mt-3 border-t border-border pt-2 leading-4 text-muted-foreground/80">
              evidência: {tool.evidencePt}
            </p>
          )}
          <Link
            to="/referencia/$id"
            params={{ id: tool.id }}
            className="mono-caps mt-3 inline-flex items-center gap-1.5 text-primary hover:underline"
          >
            Ficha completa
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      )}
    </li>
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
  const pieces = resolveKitPieces(kit);
  const hero = pieces[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto rounded-none border-border bg-card p-0">
        <DialogHeader className="space-y-0 border-b border-border bg-surface p-6 text-left">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0 flex-1">
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
            </div>
            {hero && (
              <KitPiecePlate
                piece={hero}
                className="h-28 w-24 shrink-0 shadow-[0_14px_32px_rgba(42,36,29,0.24)]"
                imageClassName="h-full w-full object-contain p-2"
              />
            )}
          </div>
        </DialogHeader>

        <div className="p-6">
          <p className="border-l-2 border-primary/40 pl-3 text-sm leading-7 text-muted-foreground">
            {kit.dayPt}
          </p>

          <ul className="mt-5 divide-y divide-border border-y border-border">
            {pieces.map(({ tool, quantity, whyPt }) => (
              <KitPieceRow key={tool.id} tool={tool} quantity={quantity} whyPt={whyPt} />
            ))}
          </ul>

          <div className="mt-5 space-y-3 text-xs leading-5 text-muted-foreground">
            <p>
              <span className="mono-caps text-foreground">Não inclui: </span>
              {kit.notIncludedPt.join(" · ")}
            </p>
            <p className="border-l-2 border-primary/40 pl-3">{kit.limitationsPt}</p>
          </div>

          <Button className="mt-5 w-full rounded-none" asChild>
            <Link to="/b2b" search={{ kit: kit.id }}>
              <Box className="mr-2 h-4 w-4" />
              Pedir no B2B · este kit
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
            <p className="jp-label text-primary">
              <span className="font-mono">03</span> · 最初のキット · os primeiros kits REJENDARI
            </p>
            <h2 className="mt-4 max-w-xl text-display-2">
              {REJENDARI_KITS.length} composições.
              <br />
              <span className="text-primary">Nada que não ganhe o seu lugar.</span>
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-body text-muted-foreground">
              A inspiração vem da produção integrada da ANEX em Sanjō, 一貫生産: cada bit nasce do
              aço ao fio nas mesmas mãos. {malas} malas cobrem profissões, {kitsCount} kits dominam
              uma família, {caixas} caixas cobrem o dia de um ofício. Cada peça entra porque resolve
              um trabalho — o que não resolve, fica de fora.
            </p>
            <p className="mono-caps mt-4 inline-flex flex-wrap items-baseline gap-x-2 border border-primary/30 bg-primary/[0.05] px-3 py-1.5 text-primary">
              Kurokin · a gama
              <span className="text-xs font-normal normal-case tracking-normal text-muted-foreground">
                alicates e chaves Fujiya preto-dourado · ficha a ficha no atendimento
              </span>
            </p>
          </div>
        </div>

        {/* Filtros: rail com scroll horizontal em mobile, alvos ≥44px. */}
        <div className="tab-rail -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {FILTERS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              aria-pressed={filter === option.id}
              className={cn(
                "min-h-11 shrink-0 whitespace-nowrap border px-4 py-2.5 mono-caps transition-colors",
                filter === option.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3">
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
