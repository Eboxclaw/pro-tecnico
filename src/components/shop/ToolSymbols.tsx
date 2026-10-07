import type { CuratedToolReference } from "@/data/curated-tool-references";
import { cn } from "@/lib/utils";

/** Bolinhas 0-5 da escala da casa: cheias = qualidade, vazias = resto da escala. */
function QualityDots({ dots, className }: { dots: number; className?: string }) {
  const safe = Math.max(0, Math.min(5, dots));
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`qualidade ${safe} de 5`}
      title={`escala da casa: ${safe}/5`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "block h-1.5 w-1.5 rounded-full",
            i < safe ? "bg-primary" : "border border-border bg-transparent",
          )}
        />
      ))}
    </span>
  );
}

function Norm1000({ norm }: { norm: string }) {
  const isThousand = /60900|F1505|1000 V|1000V/i.test(norm);
  return (
    <span
      className={cn(
        "border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em]",
        isThousand
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border text-muted-foreground",
      )}
      title={`norma: ${norm}`}
    >
      {isThousand ? "⚡ 1000 V" : norm}
    </span>
  );
}

/** Símbolos curtos derivados do texto da ficha (impacto, diamante, torsão, lock). */
function derivedSymbols(tool: CuratedToolReference): string[] {
  const haystack = `${tool.notePt} ${tool.treatmentPt ?? ""} ${tool.categoryPt}`.toLowerCase();
  const symbols: string[] = [];
  if (tool.normPt && /60900|F1505|1000/i.test(tool.normPt)) symbols.push("⚡");
  if (/diamante|diamond/.test(haystack)) symbols.push("DIAMANTE");
  if (/torsion|torsão/.test(haystack)) symbols.push("TORSÃO");
  if (/anel de retenção|locking|lock\b/.test(haystack)) symbols.push("LOCK");
  if (/pass-through|pass thru/.test(haystack)) symbols.push("PASS-THROUGH");
  if (/impacto|impact duty|40 v|18 v\/40 v/.test(haystack) && tool.task !== "cutting")
    symbols.push("IMPACTO");
  return symbols;
}

/** Simbologia de qualidade: bolinhas 0-5, norma, aço, tratamento e corte. */
export function ToolSymbols({
  tool,
  compact = false,
  className,
}: {
  tool: CuratedToolReference;
  /** compact: só bolinhas + norma — para cards pequenos (builder). */
  compact?: boolean;
  className?: string;
}) {
  const symbols = derivedSymbols(tool);
  const hasAnything =
    tool.qualityDots !== undefined || tool.normPt || (!compact && symbols.length > 0);
  if (!hasAnything) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      {tool.qualityDots !== undefined && <QualityDots dots={tool.qualityDots} />}
      {tool.normPt && <Norm1000 norm={tool.normPt} />}
      {!compact &&
        symbols
          .filter((s) => s !== "⚡")
          .map((symbol) => (
            <span
              key={symbol}
              className="border border-border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              {symbol}
            </span>
          ))}
      {!compact && tool.steelPt && (
        <span
          className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground"
          title={tool.steelPt}
        >
          {tool.steelPt}
        </span>
      )}
      {!compact && tool.treatmentPt && (
        <span
          className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground"
          title={tool.treatmentPt}
        >
          {tool.treatmentPt}
        </span>
      )}
      {!compact && tool.cutTypePt && (
        <span
          className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground"
          title={`corte: ${tool.cutTypePt}`}
        >
          corte: {tool.cutTypePt}
        </span>
      )}
      {tool.certificationUrl && !compact && (
        <a
          href={tool.certificationUrl}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[8px] uppercase tracking-[0.12em] text-primary underline underline-offset-2"
        >
          certificação ↗
        </a>
      )}
    </div>
  );
}
