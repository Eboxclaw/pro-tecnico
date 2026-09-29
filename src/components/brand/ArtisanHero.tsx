import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ProductImage } from "@/components/shop/ProductImage";

export function ArtisanHero() {
  return (
    <section className="artisan-hero" aria-labelledby="artisan-title">
      <div className="artisan-hero-media" aria-hidden="true">
        <ProductImage
          src="https://images.makita.co.nz/_productshots/actionshot/D/DT/DTD173_3_act-M.jpg"
          alt=""
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="artisan-hero-shade" />
      <div className="artisan-hero-content">
        <p className="artisan-eyebrow">
          <span /> REJENDARI — FERRAMENTA COM CRITÉRIO
        </p>
        <h1 id="artisan-title">
          O valor está
          <br />
          no <em>detalhe.</em>
        </h1>
        <p className="artisan-hero-description">
          Precisão japonesa. Engenharia europeia.
          <br />
          Escolhidas para o trabalho que levas a sério.
        </p>
        <div className="artisan-hero-actions">
          <Link to="/shop" className="artisan-link artisan-link-solid">
            Explorar ferramentas <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
          <Link to="/marcas" className="artisan-link">
            Conhecer as marcas <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
      <div className="artisan-hero-foot">
        <a href="#selecao" className="flex items-center gap-3">
          <ArrowDown size={14} aria-hidden="true" /> DESCOBRIR A SELEÇÃO
        </a>
        <Link
          to="/referencia/$id"
          params={{ id: "makita-dtd173z" }}
          className="artisan-photo-credit"
        >
          EM TRABALHO / MAKITA DTD173 <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
