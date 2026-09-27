import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, ImageOff, Sparkles } from "lucide-react";
import type { CuratedToolReference } from "@/data/curated-tool-references";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

export function ReferenceProductCard({
  tool,
  featured = false,
}: {
  tool: CuratedToolReference;
  featured?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <HoverCard openDelay={160} closeDelay={90}>
      <HoverCardTrigger asChild>
        <article
          tabIndex={0}
          className="group flex min-h-full flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_22px_55px_rgba(42,36,29,0.16)] focus:outline-none focus:ring-2 focus:ring-primary/35"
        >
          <div className={`relative overflow-hidden bg-[#f4f0e7] ${featured ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
            <div className="washi-noise absolute inset-0 opacity-55" aria-hidden="true" />
            <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-3.5">
              <span className="border border-black/10 bg-white/90 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-black/62 shadow-sm backdrop-blur">
                {tool.badge}
              </span>
              <span className="font-display text-[11px] font-semibold tracking-[0.06em] text-black/42">
                {tool.japanese}
              </span>
            </div>

            {!imageFailed ? (
              <img
                src={tool.imageUrl}
                alt={tool.imageAlt}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
                className={`relative z-[1] h-full w-full object-contain transition duration-500 ease-out group-hover:scale-[1.055] group-hover:-rotate-[0.25deg] ${featured ? "p-8 sm:p-10" : "p-7"}`}
              />
            ) : (
              <div className="micro-grid relative z-[1] flex h-full w-full items-center justify-center text-black/35">
                <ImageOff className="h-7 w-7" />
              </div>
            )}

            <div className="pointer-events-none absolute inset-x-[14%] bottom-5 h-7 rounded-[50%] bg-black/10 blur-xl" />
            <div className="absolute inset-x-3 bottom-3 z-[2] flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.14em] text-black/42">
              <span>{tool.categoryPt}</span>
              <span>日本工具</span>
            </div>
          </div>

          <div className={`flex flex-1 flex-col ${featured ? "p-6" : "p-5"}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="tech-label text-primary">{tool.brand}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">{tool.model}</span>
            </div>

            <h3 className={`mt-3 font-display font-semibold leading-[1.08] tracking-[-0.04em] ${featured ? "text-2xl" : "text-xl"}`}>
              {tool.namePt}
            </h3>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{tool.categoryPt}</p>
            {tool.specPt && (
              <p className="mt-3 inline-flex w-fit border border-border bg-background px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-foreground">
                {tool.specPt}
              </p>
            )}
            <p className="mt-4 text-[13px] leading-6 text-muted-foreground">{tool.notePt}</p>

            {tool.evidencePt && (
              <p className="mt-4 border-l border-primary/55 pl-3 text-[11px] leading-5 text-muted-foreground">
                {tool.evidencePt}
              </p>
            )}

            <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
              <Button size="sm" className="rounded-none" asChild>
                <Link to="/b2b">
                  Pedir disponibilidade
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button size="sm" variant="ghost" className="rounded-none" asChild>
                <a href={tool.referenceUrl} target="_blank" rel="noreferrer">
                  Ficha oficial
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </article>
      </HoverCardTrigger>

      <HoverCardContent
        side="top"
        align="center"
        sideOffset={12}
        className="w-[340px] rounded-none border-black/15 bg-[#f5f0e5] p-0 text-[#25211c] shadow-[0_24px_70px_rgba(39,32,25,0.22)]"
      >
        <div className="washi-noise relative overflow-hidden p-5">
          <div className="absolute right-4 top-3 font-display text-4xl font-semibold text-black/[0.06]">{tool.japanese}</div>
          <div className="relative">
            <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#b33f2d]">
              <Sparkles className="h-3 w-3" />
              porque recomendamos
            </p>
            <p className="mt-3 font-display text-xl font-semibold tracking-[-0.04em]">{tool.brand} {tool.model}</p>
            <p className="mt-2 text-xs leading-5 text-black/62">{tool.notePt}</p>
            {tool.evidencePt && (
              <p className="mt-4 border-t border-black/10 pt-4 text-[11px] leading-5 text-black/50">{tool.evidencePt}</p>
            )}
            <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.13em] text-black/40">
              Consulta disponibilidade ou abre a ficha oficial
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
