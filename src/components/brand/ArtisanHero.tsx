import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ProductImage } from "@/components/shop/ProductImage";
import { referenceById } from "@/data/curated-tool-references";

const HERO_STAGE_IDS = { main: "anex-397-d", bits: ["anex-adrs-2065", "anex-adsk-2065"] } as const;

export function ArtisanHero() {
  const main = referenceById(HERO_STAGE_IDS.main);
  const bits = HERO_STAGE_IDS.bits
    .map((id) => referenceById(id))
    .flatMap((tool) => (tool?.imageUrl ? [tool] : []));
  return (
    <section className="artisan-hero" aria-labelledby="artisan-title">
      <div className="artisan-hero-shade" />
      <div className="artisan-hero-content">
        <p className="artisan-eyebrow">
          <span /> 厳選工具 · FERRAMENTA COM CRITÉRIO
        </p>
        <h1 id="artisan-title">
          Precisão na escolha.
          <br />
          <em>Confiança na mão.</em>
        </h1>
        <p className="artisan-hero-description">
          Ferramenta japonesa e europeia para quem conhece o valor
          <br />
          de um trabalho bem feito. Escolhida pelo trabalho que resolve.
        </p>
        <p className="artisan-hero-motto">Cada referência, uma razão para estar aqui.</p>
        <div className="artisan-hero-actions">
          <Link to="/shop" className="artisan-link artisan-link-solid">
            Explorar ferramentas <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
          <Link to="/marcas" className="artisan-link">
            Conhecer as marcas <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>

      {/* Palco topo: o produto da casa (397-D) com os consumíveis Diamond ao lado. */}
      <div className="artisan-hero-stage" aria-label="Destaques ANEX">
        {main?.imageUrl && (
          <Link to="/referencia/$id" params={{ id: main.id }} className="artisan-stage-main group">
            <ProductImage
              src={main.imageUrl}
              alt={main.imageAlt ?? "ANEX Quick Ball 72, modelo 397-D"}
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-contain p-4"
            />
            <span className="artisan-stage-tag">397-D · QUICK BALL 72</span>
          </Link>
        )}
        {bits.map((tool, index) => (
          <Link
            key={tool.id}
            to="/referencia/$id"
            params={{ id: tool.id }}
            className={`artisan-stage-bit artisan-stage-bit-${index + 1} group`}
          >
            <ProductImage
              src={tool.imageUrl!}
              alt={tool.imageAlt ?? `${tool.brand} ${tool.model}`}
              loading="eager"
              className="h-full w-full object-contain p-2"
            />
            <span className="artisan-stage-tag artisan-stage-tag-sm">DIAMOND · {tool.model}</span>
          </Link>
        ))}
      </div>

      <div className="artisan-hero-foot">
        <a href="#selecao" className="flex items-center gap-3">
          <ArrowDown size={14} aria-hidden="true" /> DESCOBRIR A SELEÇÃO
        </a>
        <span className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
          <span>JP·DE·SE / seleção</span>
          <span>PT / curadoria</span>
          <span>PRO / dados claros</span>
        </span>
        <Link to="/referencia/$id" params={{ id: "anex-397-d" }} className="artisan-photo-credit">
          PREFERÊNCIA DA CASA / ANEX 397-D <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
