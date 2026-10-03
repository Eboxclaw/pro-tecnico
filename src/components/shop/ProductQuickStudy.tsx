import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Eye, ShieldCheck } from "lucide-react";
import type { CuratedToolReference } from "@/data/curated-tool-references";
import { similarReferences } from "@/data/curated-tool-references";
import { SmartProductVisual } from "@/components/shop/SmartProductVisual";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ProductQuickStudyProps = {
  tool: CuratedToolReference;
  compact?: boolean;
};

export function ProductQuickStudy({ tool, compact = false }: ProductQuickStudyProps) {
  const similar = similarReferences(tool, 3);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant={compact ? "secondary" : "outline"}
          className={compact ? "h-8 rounded-none border border-black/10 bg-white/88 px-2.5 text-[10px] text-black shadow-sm backdrop-blur hover:bg-white" : "rounded-none"}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Estudo rápido
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] w-[min(96vw,980px)] max-w-[980px] gap-0 overflow-y-auto rounded-none border-black/15 bg-[#f5f0e5] p-0 text-[#1b1917] shadow-[0_28px_90px_rgba(31,26,21,0.32)]">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <SmartProductVisual tool={tool} className="min-h-[330px] border-b border-black/10 lg:min-h-full lg:border-b-0 lg:border-r" />

          <div className="p-6 sm:p-8">
            <div className="pr-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#b54530]">{tool.brand} · REF {tool.officialCode ?? tool.model}</p>
              <DialogTitle className="mt-3 font-display text-3xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-4xl">
                {tool.namePt}
              </DialogTitle>
              <DialogDescription className="mt-4 text-sm leading-6 text-black/58">
                {tool.storyPt ?? tool.notePt}
              </DialogDescription>
            </div>

            {tool.specPt && (
              <div className="mt-6 border-y border-black/10 py-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-black/65">{tool.specPt}</p>
              </div>
            )}

            {tool.evidencePt && (
              <div className="mt-5 flex gap-3 border border-black/10 bg-white/55 p-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#b54530]" />
                <p className="text-xs leading-5 text-black/52">{tool.evidencePt}</p>
              </div>
            )}

            {similar.length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-black/40">Comparar também</p>
                <div className="mt-3 divide-y divide-black/10 border-y border-black/10">
                  {similar.map((item) => (
                    <Link
                      key={item.id}
                      to="/referencia/$id"
                      params={{ id: item.id }}
                      className="flex items-center justify-between gap-4 py-3 text-xs transition-colors hover:text-[#b54530]"
                    >
                      <span>
                        <span className="block font-medium">{item.brand} · {item.model}</span>
                        <span className="mt-0.5 block text-[10px] text-black/45">{item.namePt}</span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-2">
              <Button className="rounded-none" asChild>
                <Link to="/referencia/$id" params={{ id: tool.id }}>
                  Abrir produto
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="rounded-none border-black/15 bg-transparent" asChild>
                <a href={tool.referenceUrl} target="_blank" rel="noreferrer">
                  Fonte oficial
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" className="rounded-none" asChild>
                <Link to="/b2b">Pedir disponibilidade</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
