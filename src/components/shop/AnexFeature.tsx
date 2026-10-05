import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { referenceById } from "@/data/curated-tool-references";
import { ProductImage } from "./ProductImage";

export function AnexFeature({ compact = false }: { compact?: boolean }) {
  if (compact)
    return (
      <aside className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <p className="text-sm text-foreground/85">
            <strong className="mr-3 font-display text-xl">ANEX</strong> A nossa seleção, explicada
            pelo trabalho.
          </p>
          <Link
            to="/anex"
            className="inline-flex items-center gap-3 text-xs font-semibold text-primary"
          >
            Explorar o especial ANEX <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </aside>
    );
  const tool = referenceById("anex-397-d");
  return (
    <section className="anex-feature" aria-labelledby="anex-feature-title">
      <div className="anex-feature-copy">
        <p className="anex-kicker">03 / PREFERÊNCIA DA CASA · ANEX</p>
        <h2 id="anex-feature-title">
          O engenho
          <br />
          está nos <em>detalhes.</em>
        </h2>
        <p>
          Diamond e Ryujin no contacto com o parafuso. Quick Ball 397 no movimento. AZM no
          isolamento do bit. AOA-17 onde falta espaço. Cinco razões para olhar de perto.
        </p>
        <Link to="/anex" className="artisan-link artisan-link-solid">
          Descobrir a seleção ANEX <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        <span className="mt-6 block text-xs leading-5 text-white/65">
          Desde 1949 em Sanjo, Niigata. Uma escolha editorial independente da REJENDARI.
        </span>
      </div>
      <Link
        to="/referencia/$id"
        params={{ id: "anex-397-d" }}
        className="anex-feature-object group"
      >
        <span className="anex-object-word" aria-hidden="true">
          ANEX
        </span>
        <ProductImage
          src={tool?.imageUrl}
          alt="ANEX Quick Ball 72, modelo 397-D"
          className="relative z-10 h-72 w-full object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:-rotate-3 motion-reduce:transition-none sm:h-96"
        />
        <div className="relative z-10 flex items-end justify-between gap-5 border-t border-white/15 pt-5">
          <div>
            <p className="anex-kicker text-[#716a5e]">397-D / QUICK BALL 72</p>
            <p className="mt-2 text-sm">72 dentes. Um gesto contínuo.</p>
          </div>
          <ArrowUpRight size={22} aria-hidden="true" />
        </div>
      </Link>
    </section>
  );
}
