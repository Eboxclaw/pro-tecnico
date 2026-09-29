import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { CuratedToolReference } from "@/data/curated-tool-references";
import { SmartProductVisual } from "@/components/shop/SmartProductVisual";
import { ProductQuickStudy } from "@/components/shop/ProductQuickStudy";
import { Button } from "@/components/ui/button";

export function ReferenceProductCard({
  tool,
  featured = false,
}: {
  tool: CuratedToolReference;
  featured?: boolean;
}) {
  return (
    <article className="catalogue-card group flex min-h-full flex-col overflow-hidden">
      <div className="relative">
        <SmartProductVisual tool={tool} featured={featured} />
        {tool.imageCaption && <p className="border-t border-border bg-card px-4 py-2 text-[10px] leading-4 text-muted-foreground">{tool.imageCaption}</p>}
        <div className="absolute right-3 top-12 z-30 opacity-100 transition-all duration-200 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 sm:group-focus-within:translate-y-0">
          <ProductQuickStudy tool={tool} compact />
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${featured ? "p-7" : "p-6"}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="tech-label text-primary">{tool.brand}</span>
          <span className="text-right font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
            REF {tool.officialCode ?? tool.model}
          </span>
        </div>

        <h3 className={`mt-3 font-display font-semibold leading-[1.2] tracking-[-0.025em] ${featured ? "text-2xl" : "text-xl"}`}>
          {tool.namePt}
        </h3>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{tool.categoryPt}</p>

        <p className="mb-6 mt-4 text-sm leading-6 text-muted-foreground">
          {tool.storyPt ?? tool.notePt}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Button size="sm" variant="outline" className="rounded-none" asChild>
            <Link to="/referencia/$id" params={{ id: tool.id }}>
              Ver referência
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button size="sm" variant="ghost" className="rounded-none" asChild>
            <Link to="/b2b" search={{ reference: tool.id }}>Disponibilidade</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
