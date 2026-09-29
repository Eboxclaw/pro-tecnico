import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ANEX_SIGNATURE_SOLUTIONS } from "@/data/anex-editorial";
import { referenceById } from "@/data/curated-tool-references";
import { ProductImage } from "./ProductImage";

export function AnexSignatureSolutions() {
  return (
    <section
      className="border-y border-black/10 bg-[#f5f1e9] px-4 py-14 text-[#252521] sm:px-6 lg:py-20"
      aria-label="Cinco soluções principais ANEX"
    >
      <div className="mx-auto max-w-[1392px]">
        <p className="anex-kicker text-[#913d29]">ANEX / OS ESSENCIAIS DA NOSSA SELEÇÃO</p>
        <div className="mb-9 mt-4 flex flex-wrap items-end justify-between gap-5">
          <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
            Cinco formas de fazer melhor.
          </h2>
          <p className="max-w-sm text-sm leading-6 text-[#645e54]">
            Contacto, alcance, movimento, isolamento e acesso. Cada solução tem o seu lugar.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-5">
          {ANEX_SIGNATURE_SOLUTIONS.map((solution, index) => {
            const tool = referenceById(solution.id);
            return (
              <Link
                key={solution.id}
                to="/referencia/$id"
                params={{ id: solution.id }}
                className="group flex flex-col bg-[#faf8f3] p-5 transition-colors hover:bg-white focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#913d29] motion-reduce:transition-none"
              >
                <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-[#746b5c]">
                  <span>
                    0{index + 1} / {solution.code}
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </div>
                <ProductImage
                  src={tool?.imageUrl}
                  alt={tool?.imageAlt ?? solution.name}
                  className="my-5 h-44 w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                />
                <h3 className="mt-auto font-display text-xl">{solution.name}</h3>
                <p className="mt-2 text-xs leading-5 text-[#645e54]">{solution.detail}</p>
                <span className="mt-5 text-xs font-semibold text-[#913d29]">
                  Conhecer a solução
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-5 text-xs leading-5 text-[#645e54]">
          Seleção editorial independente. Consulta aplicações e limites em cada ficha. As cinco
          soluções não constituem um conjunto certificado nem indicam disponibilidade.
        </p>
      </div>
    </section>
  );
}
