import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { referenceById } from "@/data/curated-tool-references";
import { ProductImage } from "./ProductImage";

export function LxtCollection() {
  const kit = referenceById("makita-dlx2549tj");
  if (!kit) return null;
  return (
    <section className="border-y border-border bg-[#edece5]">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
          <p className="artisan-section-index">02 / A PLATAFORMA LXT</p>
          <h2 className="mt-8 font-display text-4xl font-normal leading-[1.06] tracking-[-0.045em] sm:text-5xl">
            Uma plataforma.
            <br />
            <span className="text-muted-foreground">O teu próximo trabalho.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
            Perfuração, aperto e acabamento na plataforma Makita 18 V. Escolhe uma máquina para as
            baterias que já tens ou começa com um conjunto do fabricante.
          </p>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {[
              ["makita-dhp492z", "01", "Perfurar", "DHP492Z"],
              ["makita-dgd800z", "02", "Retificar", "DGD800Z"],
              ["makita-dga519z", "03", "Cortar e desbastar", "DGA519Z"],
            ].map(([id, n, label, model]) => (
              <Link
                key={id}
                to="/referencia/$id"
                params={{ id: id! }}
                className="group flex items-center gap-5 py-4 text-sm"
              >
                <span className="font-mono text-[10px] text-muted-foreground">{n}</span>
                <span className="flex-1">{label}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{model}</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
          <Link
            to="/shop"
            search={{ task: "power", brand: "MAKITA" }}
            className="artisan-text-link mt-5 w-fit"
          >
            Explorar Makita 18 V <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <Link
          to="/referencia/$id"
          params={{ id: kit.id }}
          className="group flex flex-col border-t border-border bg-[#f5f4ee] p-6 sm:p-12 lg:border-l lg:border-t-0"
        >
          <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            <span>Conjunto do fabricante</span>
            <span>DLX2549TJ</span>
          </div>
          <ProductImage
            src={kit.imageUrl}
            alt="Makita DLX2549TJ: berbequim, aparafusadora de impacto, baterias, carregador e mala"
            className="my-6 aspect-square max-h-[440px] w-full object-contain mix-blend-multiply"
          />
          <div className="mt-auto flex justify-between gap-6 border-t border-border pt-5">
            <div>
              <h3 className="font-display text-2xl">Perfuração + impacto.</h3>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                DHP492 + DTD173 · 2 baterias de 5,0 Ah
                <br />
                Carregador e mala · disponibilidade sob consulta
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
          </div>
        </Link>
      </div>
    </section>
  );
}
