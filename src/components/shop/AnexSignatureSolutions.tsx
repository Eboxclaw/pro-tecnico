import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ANEX_SIGNATURE_SOLUTIONS } from "@/data/anex-editorial";

/**
 * Índice tipográfico das cinco soluções ANEX, sem imagens de produto:
 * o banner do topo já apresenta os objetos; esta banda é o mapa das soluções.
 */
const SOLUTION_GLYPHS = ["ダイヤ", "龍靭", "球", "絶縁", "偏"] as const;

export function AnexSignatureSolutions() {
  return (
    <section
      className="border-y border-white/10 bg-card px-4 py-14 text-foreground sm:px-6 lg:py-20"
      aria-label="Cinco soluções principais ANEX"
    >
      <div className="mx-auto max-w-[1392px]">
        <p className="anex-kicker text-primary">ANEX / OS ESSENCIAIS DA NOSSA SELEÇÃO</p>
        <div className="mb-9 mt-4 flex flex-wrap items-end justify-between gap-5">
          <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
            Cinco formas de fazer melhor.
          </h2>
          <p className="max-w-sm text-sm leading-6 text-[#645e54]">
            Contacto, alcance, movimento, isolamento e acesso. Cada solução tem o seu lugar.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden border border-black/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-5">
          {ANEX_SIGNATURE_SOLUTIONS.map((solution, index) => (
            <Link
              key={solution.id}
              to="/referencia/$id"
              params={{ id: solution.id }}
              className="group flex flex-col bg-card p-6 transition-colors hover:bg-surface focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary motion-reduce:transition-none"
            >
              <span className="jp-label text-primary">{SOLUTION_GLYPHS[index] ?? "解"}</span>
              <span className="mt-6 font-display text-5xl font-semibold tracking-[-0.05em] text-[#25252114]">
                0{index + 1}
              </span>
              <h3 className="mt-6 font-display text-xl leading-tight">{solution.name}</h3>
              <p className="mt-2 flex-1 text-xs leading-5 text-[#645e54]">{solution.detail}</p>
              <span className="mt-6 flex items-center justify-between border-t border-black/10 pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#746b5c]">
                {solution.code}
                <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-[#645e54]">
          Seleção editorial independente. Consulta aplicações e limites em cada ficha. As cinco
          soluções não constituem um conjunto certificado nem indicam disponibilidade.
        </p>
      </div>
    </section>
  );
}
