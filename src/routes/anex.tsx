import { AnexSignatureSolutions } from "@/components/shop/AnexSignatureSolutions";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { ANEX_CATALOG_URL, ANEX_CHAPTERS, parseAnexSearch } from "@/data/anex-editorial";
import { referenceById, referencesForBrand } from "@/data/curated-tool-references";
import { ProductImage } from "@/components/shop/ProductImage";
import { ReferenceProductCard } from "@/components/shop/ReferenceProductCard";

export const Route = createFileRoute("/anex")({
  validateSearch: parseAnexSearch,
  head: () => ({
    meta: [
      { title: "ANEX — A preferência da casa | REJENDARI" },
      {
        name: "description",
        content:
          "A seleção independente ANEX da REJENDARI: roquetes Quick Ball 72, bits Ryujin, adaptadores offset e extração de parafusos. Aplicações, limites e fontes de fabricante.",
      },
      { property: "og:title", content: "ANEX, escolhida ao detalhe — REJENDARI" },
      {
        property: "og:description",
        content:
          "Explora o catálogo ANEX pelo trabalho: acesso, roquetes, bits, binário e extração.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AnexPage,
});

function AnexPage() {
  const { family } = Route.useSearch();
  const chapter = ANEX_CHAPTERS.find((item) => item.id === family) ?? ANEX_CHAPTERS[0];
  const hero = referenceById("anex-aoa-17s1");
  const selected = chapter.ids.map(referenceById).filter((tool) => tool !== undefined);
  const total = referencesForBrand("ANEX").length;
  return (
    <div className="anex-editorial">
      <section className="anex-opening">
        <div className="anex-opening-copy">
          <Link to="/marcas" className="anex-kicker inline-flex items-center gap-2">
            REJENDARI / CADERNO DE MARCAS <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
          <p className="anex-wordmark">
            ANEX<span>選定</span>
          </p>
          <h1>
            Pequenas ferramentas.
            <br />
            <em>Grandes soluções.</em>
          </h1>
          <p className="anex-lead">
            Há marcas que nos fazem olhar duas vezes para um detalhe. A ANEX é uma delas. Escolhemos
            soluções para o espaço que falta, o aperto que exige controlo e o parafuso que já não
            colabora.
          </p>
          <a href="#anex-selection" className="artisan-link artisan-link-solid">
            Encontrar uma solução <ArrowRight size={17} aria-hidden="true" />
          </a>
          <p className="anex-independent">
            Seleção independente REJENDARI. Sem parceria ou representação oficial da ANEX.
          </p>
        </div>
        <div className="anex-opening-visual">
          <p className="anex-kicker">EM FOCO / AOA-17S1</p>
          <Link to="/referencia/$id" params={{ id: "anex-aoa-17s1" }} className="block">
            <ProductImage
              src={hero?.imageUrl}
              alt="Conjunto ANEX AOA-17S1 com adaptador offset e sockets"
              loading="eager"
              fetchPriority="high"
              className="aspect-square w-full object-contain p-5 mix-blend-multiply sm:p-10"
            />
            <div className="flex items-end justify-between gap-4 border-t border-black/20 pt-5">
              <div>
                <p className="text-xl font-medium">
                  O obstáculo muda.
                  <br />O ponto de aperto também.
                </p>
                <p className="mt-2 text-xs text-[#645e54]">Conhecer o conjunto offset de 17 mm</p>
              </div>
              <ArrowUpRight size={25} aria-hidden="true" />
            </div>
          </Link>
        </div>
      </section>

      <AnexSignatureSolutions />

      <section className="anex-principles" aria-label="Critérios da seleção ANEX">
        {[
          [
            "01",
            "Escolher pelo problema",
            "Acesso, movimento, perfil e material vêm antes do tamanho do conjunto.",
          ],
          [
            "02",
            "Explicar o limite",
            "Máquina permitida, binário e compatibilidade fazem parte da escolha.",
          ],
          ["03", "Ir à fonte", "Códigos de fabricante e páginas do catálogo acompanham a seleção."],
        ].map(([n, title, text]) => (
          <div key={n}>
            <span>{n}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
        ))}
      </section>

      <section
        id="anex-selection"
        className="mx-auto max-w-[1440px] scroll-mt-48 px-4 py-16 sm:px-6 lg:py-24"
        aria-labelledby="anex-selection-title"
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="anex-kicker text-primary">DO CATÁLOGO PARA O TRABALHO</p>
            <h2
              id="anex-selection-title"
              className="mt-4 font-display text-4xl tracking-tight sm:text-5xl"
            >
              O que precisas de resolver?
            </h2>
          </div>
          <Link
            to="/shop"
            search={{ brand: "ANEX" }}
            className="inline-flex items-center gap-2 text-sm text-primary"
          >
            Ver as {total} referências <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <nav aria-label="Aplicações ANEX" className="anex-family-nav">
          {ANEX_CHAPTERS.map((item, index) => (
            <Link
              key={item.id}
              to="/anex"
              search={{ family: item.id }}
              resetScroll={false}
              aria-current={chapter.id === item.id ? "true" : undefined}
              className={chapter.id === item.id ? "is-selected" : ""}
            >
              <span>0{index + 1}</span>
              {item.short}
            </Link>
          ))}
        </nav>
        <div
          aria-live="polite"
          aria-atomic="true"
          className="mb-8 grid gap-5 border-b border-border pb-8 lg:grid-cols-2"
        >
          <h3 className="font-display text-3xl tracking-tight">{chapter.label}</h3>
          <div>
            <p className="text-sm leading-7 text-muted-foreground">{chapter.description}</p>
            <a
              href={`${ANEX_CATALOG_URL}?page=${chapter.page}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs text-primary underline underline-offset-4"
            >
              Catálogo ANEX 2026 · páginas impressas {chapter.printed}{" "}
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {selected.map((tool) => (
            <ReferenceProductCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="anex-catalog-note">
        <div>
          <p className="anex-kicker">CATÁLOGO ANEX / 2026</p>
          <h2>
            A referência é o fabricante.
            <br />
            <em>A seleção é nossa.</em>
          </h2>
        </div>
        <div>
          <p>
            O catálogo completo tem 98 páginas no visualizador. Este caderno destaca algumas
            famílias e referências; não pretende reproduzir toda a gama.
          </p>
          <p>
            As páginas impressas e as do visualizador têm numeração diferente. Os nossos links abrem
            diretamente o capítulo correspondente.
          </p>
          <a href={ANEX_CATALOG_URL} target="_blank" rel="noreferrer" className="artisan-link mt-6">
            Abrir catálogo do fabricante <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </section>
      <section className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6 px-4 py-14 sm:px-6">
        <div>
          <h2 className="font-display text-2xl">Já tens uma referência em mente?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Envia o código ANEX e a quantidade. Confirmamos preço, versão e prazo no orçamento. A
            seleção editorial não indica stock.
          </p>
        </div>
        <Link to="/b2b" className="artisan-link border-border text-foreground">
          Pedir uma referência ANEX <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
