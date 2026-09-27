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
    <article className="group flex min-h-full flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_22px_55px_rgba(42,36,29,0.16)]">
      <div className="relative">
        <SmartProductVisual tool={tool} featured={featured} />
        <div className="absolute right-3 top-12 z-30 opacity-100 transition-all duration-200 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <ProductQuickStudy tool={tool} compact />
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${featured ? "p-6" : "p-5"}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="tech-label text-primary">{tool.brand}</span>
          <span className="text-right font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
            REF {tool.officialCode ?? tool.model}
          </span>
        </div>

        <h3 className={`mt-3 font-display font-semibold leading-[1.08] tracking-[-0.04em] ${featured ? "text-2xl" : "text-xl"}`}>
          {tool.namePt}
        </h3>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{tool.categoryPt}</p>

        <p className="mt-4 text-[13px] leading-6 text-muted-foreground">
          {tool.storyPt ?? tool.notePt}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Button size="sm" className="rounded-none" asChild>
            <Link to="/referencia/$id" params={{ id: tool.id }}>
              Abrir produto
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button size="sm" variant="ghost" className="rounded-none" asChild>
            <Link to="/b2b">Disponibilidade</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
