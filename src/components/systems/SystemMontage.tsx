import { Link } from "@tanstack/react-router";
import { referenceById } from "@/data/curated-tool-references";
import type { RejendariSystem } from "@/data/systems";
import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import { cn } from "@/lib/utils";

type MontageCell =
  { kind: "piece"; role: string; refId: string } | { kind: "pending"; role: string };

/**
 * Montagem de sistema: uma única imagem composta apenas por peças REAIS do
 * system — cada célula com a sua etiqueta de função. Componentes em sourcing
 * aparecem como slot tracejado; nunca uma foto que o copy não suporte.
 *
 * Peças entram breadth-first (uma por módulo antes de repetir módulo) para a
 * montagem mostrar os pilares do system e não duas peças do mesmo módulo.
 */
function montageCells(system: RejendariSystem, max: number): MontageCell[] {
  const pendingModule = system.modules.find(
    (module) => module.pendingPt?.length && module.pieces.length === 0,
  );
  const pieceModules = system.modules.filter((module) => module.pieces.length > 0);
  const cells: MontageCell[] = [];
  const capacity = pendingModule ? max - 1 : max;

  for (let round = 0; round < pieceModules.length && cells.length < capacity; round++) {
    for (const module of pieceModules) {
      if (cells.length >= capacity) break;
      const piece = module.pieces[round];
      if (piece) cells.push({ kind: "piece", role: module.role, refId: piece.refId });
    }
  }

  if (pendingModule && cells.length < max) {
    cells.push({ kind: "pending", role: pendingModule.role });
  }
  return cells;
}

export function SystemMontage({
  system,
  max = 4,
  dark = false,
  className,
}: {
  system: RejendariSystem;
  max?: number;
  dark?: boolean;
  className?: string;
}) {
  const cells = montageCells(system, max);
  if (cells.length === 0) return null;

  const cols = cells.length <= 2 ? "grid-cols-1" : "grid-cols-2";
  const rule = dark ? "bg-white/12" : "bg-border";

  return (
    <div className={cn("grid h-full gap-px overflow-hidden", cols, rule, className)}>
      {cells.map((cell) => {
        if (cell.kind === "pending") {
          return (
            <div
              key={cell.role + ":pending"}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-2 border border-dashed p-4",
                dark ? "border-white/25 bg-[#23211d]" : "border-border bg-card",
              )}
            >
              <span
                className={cn("font-display text-3xl", dark ? "text-white/25" : "text-black/25")}
              >
                {cell.role === "LOCK" ? "錠" : "？"}
              </span>
              <p
                className={cn(
                  "font-mono text-[8px] uppercase tracking-[0.16em]",
                  dark ? "text-white/45" : "text-muted-foreground",
                )}
              >
                {cell.role} · EM SOURCING
              </p>
            </div>
          );
        }

        const reference = referenceById(cell.refId);
        if (!reference) return null;
        return (
          <Link
            key={cell.refId}
            to="/referencia/$id"
            params={{ id: cell.refId }}
            className="product-plate group relative block aspect-square overflow-hidden"
          >
            {reference.imageUrl ? (
              <ProductImage
                src={reference.imageUrl}
                alt={reference.imageAlt ?? reference.namePt}
                className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <ProductMonogram
                brand={reference.brand}
                label={reference.namePt}
                className="flex h-full w-full items-center justify-center"
              />
            )}
            <span
              className={cn(
                "absolute left-2 top-2 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em]",
                dark ? "bg-black/70 text-white/75" : "bg-black/78 text-white",
              )}
            >
              {cell.role} · {reference.model}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
