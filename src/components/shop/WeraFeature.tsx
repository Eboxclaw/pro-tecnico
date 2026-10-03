import { Link } from "@tanstack/react-router";
import { RejendariSeal } from "@/components/brand/RejendariSeal";
import { ArrowUpRight } from "lucide-react";
import { referenceById } from "@/data/curated-tool-references";
import { ProductImage } from "./ProductImage";

const SYSTEM_IDS = ["wera-838-ra-r-m", "wera-838-ra-r-l", "wera-8784-b1", "wera-8794-b", "wera-899-4-1-sb"];

export function WeraFeature({ compact = false }: { compact?: boolean }) {
  if (compact)
    return (
      <aside className="border-b border-border bg-[#1b1917]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <p className="text-sm text-[#f5f0e5]">
            <strong className="mr-3 font-display text-xl">WERA</strong> A gama alemã pela
            coerência: peças que trabalham umas com as outras.
          </p>
          <Link to="/shop" search={{ brand: "WERA" }} className="inline-flex items-center gap-3 text-xs font-semibold text-[#d65a41]">
            Ver o sistema Wera <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </aside>
    );

  const kit = referenceById("wera-8100-sb-6");
  return (
    <section className="section-reveal border-y border-border bg-[#1b1917] text-[#f5f0e5]" aria-labelledby="wera-feature-title">
      <div className="relative mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-24">
        <RejendariSeal className="absolute -top-3 right-6 z-10 hidden h-20 w-20 opacity-80 lg:grid" />
        <div>
          <p className="jp-label text-[#d65a41]">ドイツ品質 · a gama alemã</p>
          <h2 id="wera-feature-title" className="mt-4 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
            Um sistema,
            <br />
            não uma gaveta de chaves.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/58">
            O 838 RA-R dá o vaivém com Rapidaptor a uma mão — compacto para painéis, longo para
            condutas. O kit Zyklop Speed 3/8″ liga catraca, sockets de 8–19 mm e bits no mesmo
            quadrado, com o adaptador a fechar o círculo. A Wera entra na REJENDARI pela
            coerência: cada peça justifica a seguinte.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {SYSTEM_IDS.map((id) => {
              const tool = referenceById(id);
              if (!tool) return null;
              return (
                <Link
                  key={id}
                  to="/referencia/$id"
                  params={{ id }}
                  className="group flex items-center gap-3 border border-white/15 px-4 py-3 transition-colors hover:border-[#d65a41]"
                >
                  <span className="h-12 w-12 overflow-hidden bg-white/95">
                    {tool.imageUrl ? (
                      <ProductImage src={tool.imageUrl} alt={tool.imageAlt ?? tool.namePt} className="h-full w-full object-contain p-1" loading="lazy" />
                    ) : null}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{tool.model}</span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">{tool.specPt?.slice(0, 34)}</span>
                  </span>
                </Link>
              );
            })}
          </div>
          <p className="mt-4 max-w-xl text-xs leading-5 text-white/45">
            O sistema completo: o kit Zyklop Speed 3/8″ traz a conversão 8784 B1 incluída — a extensão wobble e o Rapidaptor
            inox completam o acesso e a fixação a uma mão.
          </p>
          <Link to="/shop" search={{ brand: "WERA" }} className="mt-8 inline-flex items-center gap-3 border border-[#d65a41] px-6 py-3 text-sm font-semibold transition-colors hover:bg-[#d65a41]">
            Ver o sistema Wera <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <Link to="/referencia/$id" params={{ id: "wera-8100-sb-6" }} className="group relative block border border-white/12 bg-[#23211d] p-6">
          <span className="absolute right-5 top-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">05004046001</span>
          {kit?.imageUrl ? (
            <ProductImage
              src={kit.imageUrl}
              alt={kit.imageAlt ?? "Wera 8100 SB 6 Zyklop Speed"}
              className="h-64 w-full object-contain transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none sm:h-80"
            />
          ) : null}
          <div className="flex items-end justify-between gap-4 border-t border-white/12 pt-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#d65a41]">8100 SB 6 · ZYKLOP SPEED 3/8″</p>
              <p className="mt-2 text-sm text-white/70">29 peças que se interligam: catraca, sockets 8–19 mm, adaptador e bits.</p>
            </div>
            <ArrowUpRight size={22} aria-hidden="true" />
          </div>
        </Link>
      </div>
    </section>
  );
}
