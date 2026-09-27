import { useState } from "react";
import { ArrowUpRight, ImageOff } from "lucide-react";
import type { CuratedToolReference } from "@/data/curated-tool-references";

export function ReferenceProductCard({ tool }: { tool: CuratedToolReference }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <a
      href={tool.referenceUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex min-h-full flex-col overflow-hidden border border-border bg-card transition-colors hover:border-primary/55"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-[#ece9e2]">
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3">
          <span className="border border-black/10 bg-white/86 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-black/62 backdrop-blur">
            {tool.badge}
          </span>
          <span className="font-display text-[11px] font-semibold tracking-[0.06em] text-black/48">
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
            className="h-full w-full object-contain p-7 transition duration-500 ease-out group-hover:scale-[1.045] group-hover:-rotate-[0.35deg]"
          />
        ) : (
          <div className="micro-grid flex h-full w-full items-center justify-center text-black/35">
            <ImageOff className="h-7 w-7" />
          </div>
        )}

        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.14em] text-black/43">
          <span>Imagem de referência</span>
          <span>RJD / ESTUDO</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="tech-label text-primary">{tool.brand}</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">{tool.model}</span>
        </div>

        <h3 className="mt-3 font-display text-xl font-semibold leading-[1.08] tracking-[-0.04em]">
          {tool.namePt}
        </h3>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{tool.categoryPt}</p>
        <p className="mt-4 text-[13px] leading-6 text-muted-foreground">{tool.notePt}</p>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4">
          <span className="text-xs font-medium">Referência do fabricante</span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
      </div>
    </a>
  );
}
