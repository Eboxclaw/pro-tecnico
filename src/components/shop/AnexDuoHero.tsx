import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { referenceById } from "@/data/curated-tool-references";
import { ProductImage } from "./ProductImage";

export function AnexDuoHero() {
  const quickBall = referenceById("anex-397-d");
  const offset = referenceById("anex-aoa-17s1");
  if (!quickBall || !offset) return null;

  return (
    <section className="anex-duo" aria-labelledby="anex-duo-title">
      <div className="anex-duo-stage">
        <span className="anex-object-word" aria-hidden="true">
          ANEX
        </span>
        <Link
          to="/referencia/$id"
          params={{ id: quickBall.id }}
          className="anex-duo-object anex-duo-object-main group"
        >
          <ProductImage
            src={quickBall.imageUrl}
            alt="ANEX Quick Ball 72, modelo 397-D"
            className="h-full w-full object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:-rotate-2 motion-reduce:transition-none"
          />
          <span className="anex-duo-tag">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/45">397-D</span>
            <span className="mt-1 block font-display text-sm font-semibold text-[#1b1917]">Quick Ball 72</span>
            <span className="mt-1 block text-[10px] leading-4 text-black/55">72 dentes. Um gesto contínuo.</span>
          </span>
        </Link>
        <Link
          to="/referencia/$id"
          params={{ id: offset.id }}
          className="anex-duo-object anex-duo-object-offset group"
        >
          <ProductImage
            src={offset.imageUrl}
            alt={offset.imageAlt ?? "ANEX AOA-17S1, adaptador offset de 17 mm"}
            className="h-full w-full object-contain p-3 mix-blend-multiply transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
          <span className="anex-duo-tag">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/45">AOA-17S1</span>
            <span className="mt-1 block font-display text-sm font-semibold text-[#1b1917]">Offset 17 mm</span>
            <span className="mt-1 block text-[10px] leading-4 text-black/55">O cotovelo além do obstáculo.</span>
          </span>
        </Link>
      </div>

      <div className="anex-duo-copy">
        <p className="anex-kicker">ANEX / DUO DE ASSINATURA · MOVIMENTO + ACESSO</p>
        <h2 id="anex-duo-title">
          O movimento.
          <br />
          Depois, o <em>acesso.</em>
        </h2>
        <p>
          Quick Ball 397-D avança com 72 dentes onde só existe um quarto de volta. AOA-17S1 desvia o
          aperto para lá do obstáculo, com a máquina fora do caminho. Um par de assinatura ANEX para
          o espaço curto e o ângulo impossível.
        </p>
        <p className="anex-kicker mt-5">三条市 NIIGATA · DESDE 1949</p>
        <div className="anex-duo-actions">
          <Link to="/referencia/$id" params={{ id: quickBall.id }} className="artisan-link artisan-link-solid">
            Ver a Quick Ball 397 <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <Link to="/referencia/$id" params={{ id: offset.id }} className="artisan-link artisan-link-ghost">
            Ver a AOA-17 <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <span className="mt-6 block text-xs leading-5 text-white/65">
          Escolha editorial independente da REJENDARI. Consulta limites e compatibilidade em cada ficha.
        </span>
      </div>
    </section>
  );
}
