import { ProductImage } from "@/components/shop/ProductImage";
import { Link } from "@tanstack/react-router";
import { referencesForFocus } from "@/data/curated-tool-references";

export function BitKitRail() {
  const tools = [
    ...referencesForFocus("bits"),
    ...referencesForFocus("adapters"),
    ...referencesForFocus("insulated"),
    ...referencesForFocus("torque"),
  ].filter((tool, index, list) => tool.imageUrl && list.findIndex((entry) => entry.id === tool.id) === index);

  const repeated = [...tools, ...tools];

  return (
    <section className="section-reveal overflow-hidden border-y border-border bg-[#ede7db] text-[#24211d]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 pb-5 pt-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="jp-label text-[#b54530]">小物こそ重要 · bits, isolação & adapters</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            As peças pequenas que fazem uma ferramenta trabalhar como três.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-black/58">
          Bits ultra-curtos, dual-side 1000 V, conversão 3/8″ ↔ 1/4″, adapters de socket e controlo de torque. São estas peças que permitem reduzir ferramentas duplicadas no kit.
        </p>
      </div>

      <div className="bit-rail border-y border-black/10 py-5">
        <div className="bit-rail-track gap-3 pr-3">
          {repeated.map((tool, index) => (
            <Link
              key={`${tool.id}-${index}`}
              to="/referencia/$id"
              params={{ id: tool.id }}
              className="group grid w-[300px] shrink-0 grid-cols-[112px_1fr] overflow-hidden border border-black/10 bg-[#f8f4eb] transition-all duration-300 hover:-translate-y-1 hover:border-[#b54530]/50 hover:shadow-[0_18px_45px_rgba(45,37,29,0.14)] sm:w-[360px] sm:grid-cols-[136px_1fr]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#e8e1d4]">
                <ProductImage
                  src={tool.imageUrl!}
                  alt={tool.imageAlt ?? tool.namePt}
                  className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="flex min-w-0 flex-col p-4">
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#b54530]">{tool.brand}</p>
                <p className="mt-1 font-display text-base font-semibold leading-tight">{tool.model}</p>
                <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-black/55">{tool.namePt}</p>
                <p className="mt-auto pt-3 font-mono text-[8px] uppercase tracking-[0.1em] text-black/42">{tool.specPt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
