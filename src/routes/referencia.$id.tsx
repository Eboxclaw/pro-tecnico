import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { referenceById, similarReferences } from "@/data/curated-tool-references";
import { ANEX_CATALOG_URL } from "@/data/anex-editorial";
import { BRAND_STORY_MAP } from "@/data/brand-stories";
import { ReferenceProductCard } from "@/components/shop/ReferenceProductCard";
import { SmartProductVisual } from "@/components/shop/SmartProductVisual";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/referencia/$id")({
  head: () => ({
    meta: [
      { title: "Referência, REJENDARI" },
      {
        name: "description",
        content:
          "História, especificações, fonte oficial e alternativas de uma referência REJENDARI.",
      },
    ],
  }),
  component: ReferencePage,
});

function ReferencePage() {
  const { id } = Route.useParams();
  const tool = referenceById(id);

  if (!tool) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="jp-label text-primary">見つかりません · referência</p>
        <h1 className="mt-4 font-display text-4xl font-semibold">Referência não encontrada.</h1>
        <Button className="mt-8 rounded-none" asChild>
          <Link to="/shop">Voltar à loja</Link>
        </Button>
      </div>
    );
  }

  const brand = BRAND_STORY_MAP[tool.brandSlug];
  const similar = similarReferences(tool, 4);

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar à loja
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-0 border-x border-border lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative border-b border-border lg:border-b-0 lg:border-r">
          <SmartProductVisual tool={tool} hero />
          {tool.imageCaption && (
            <p className="border-t border-border px-5 py-3 text-xs leading-5 text-muted-foreground">
              {tool.imageCaption}
            </p>
          )}
          <div className="absolute left-5 top-16 z-30 border border-black/10 bg-white/88 px-3 py-2 backdrop-blur">
            <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-foreground/65">
              {tool.imageSourceLabel ?? "Referência oficial"}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-primary/30 bg-primary/[0.06] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
              {tool.badge}
            </span>
            <span className="jp-label text-muted-foreground">{tool.japanese}</span>
          </div>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            {tool.brand} · {tool.model}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-6xl">
            {tool.namePt}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{tool.notePt}</p>

          {tool.kitContents && (
            <section className="mt-6 border border-border bg-surface p-5">
              <h2 className="font-display text-xl font-semibold">O que inclui o conjunto</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {tool.kitContents.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Composição publicada pelo fabricante para esta referência. Confirma a versão
                regional, o carregador e o conteúdo no orçamento.
              </p>
            </section>
          )}
          {tool.specPt && (
            <div className="mt-7 border-y border-border py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-foreground">
                {tool.specPt}
              </p>
              {tool.officialCode && (
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  Código oficial · {tool.officialCode}
                </p>
              )}
            </div>
          )}

          {tool.evidencePt && (
            <div className="mt-4 flex gap-3 border border-border bg-surface p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs leading-6 text-muted-foreground">{tool.evidencePt}</p>
            </div>
          )}

          <div className="mt-8">
            <p className="jp-label text-primary">物語 · a história desta ferramenta</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              {tool.storyPt ??
                `A ${tool.model} faz parte da seleção ${tool.categoryPt.toLowerCase()}. Compara as medidas e o encaixe com a ferramenta que já utilizas antes de escolher.`}
            </p>
          </div>

          {(tool.limitationsPt || tool.manufacturedIn) && (
            <section className="mt-7 border-l-2 border-primary bg-surface p-4">
              <h2 className="text-sm font-semibold">Antes de escolher</h2>
              {tool.limitationsPt && (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.limitationsPt}</p>
              )}
              {tool.manufacturedIn && (
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  País de fabrico indicado pelo fabricante: <strong>{tool.manufacturedIn}</strong>
                </p>
              )}
            </section>
          )}
          {tool.catalogViewerPage && (
            <a
              className="mt-4 inline-flex items-center gap-2 text-xs text-primary underline underline-offset-4"
              href={`${ANEX_CATALOG_URL}?page=${tool.catalogViewerPage}`}
              target="_blank"
              rel="noreferrer"
            >
              Catálogo ANEX · capítulo {tool.catalogViewerPage}{" "}
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          )}
          <div className="mt-7 border-l-2 border-primary pl-4 text-sm leading-6 text-muted-foreground">
            Referência editorial: preço, variante e prazo são confirmados no pedido. A presença
            nesta seleção não indica stock disponível.
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button className="rounded-none" asChild>
              <Link to="/b2b" search={{ reference: tool.id }}>
                Pedir disponibilidade
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="rounded-none" asChild>
              <a href={tool.referenceUrl} target="_blank" rel="noreferrer">
                Fonte oficial
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {brand && (
        <section className="paper-panel border-y border-black/10">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:py-16">
            <div>
              <p className="jp-label text-[#a87c1f]">
                {brand.jp} · {brand.name}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-[1] tracking-[-0.05em]">
                {brand.headline}
              </h2>
            </div>
            <div>
              <p className="text-sm leading-7 text-foreground/75">{brand.story}</p>
              <Link
                to="/marcas"
                search={{ brand: tool.brandSlug }}
                className="mt-5 inline-flex items-center text-xs font-medium text-[#a87c1f]"
              >
                Toda a marca
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="jp-label text-primary">似た道具 · produtos semelhantes</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.045em]">
                Compara antes de fechar a escolha.
              </h2>
            </div>
            <Link
              to="/shop"
              search={{ task: tool.task }}
              className="text-xs font-medium text-primary"
            >
              Ver categoria →
            </Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((item) => (
              <ReferenceProductCard key={item.id} tool={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
