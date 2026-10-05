import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { referenceById } from "@/data/curated-tool-references";
import { isReservable, resolveSystemPieces, systemById, targetPriceLabel } from "@/data/systems";
import { mergedDemand, useSystemDemand } from "@/lib/systems-demand";
import {
  DemandProgress,
  ImpactReadySeal,
  LikeFavoriteButtons,
  ReserveButton,
  SystemStatusBadge,
} from "@/components/systems/SystemPrimitives";
import { SystemMontage } from "@/components/systems/SystemMontage";
import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/systems/$id")({
  head: () => ({
    meta: [
      { title: "System, REJENDARI" },
      {
        name: "description",
        content: "Composição, módulos, fabricantes e procura de um curated system REJENDARI.",
      },
    ],
  }),
  component: SystemPage,
});

function SystemPage() {
  const { id } = Route.useParams();
  const system = systemById(id);
  const { data: demandBySystem } = useSystemDemand();

  if (!system) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="jp-label text-primary">見つかりません · system</p>
        <h1 className="mt-4 font-display text-4xl font-semibold">System não encontrado.</h1>
        <Button className="mt-8 rounded-none" asChild>
          <Link to="/packs">Voltar aos systems</Link>
        </Button>
      </div>
    );
  }

  const demand = mergedDemand(system, demandBySystem?.[system.id]);
  const lead = system.leadRefId ? referenceById(system.leadRefId) : undefined;
  const price = targetPriceLabel(system);

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6">
          <Link
            to="/packs"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar aos systems
          </Link>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="technical-grid flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
            <div className="flex flex-wrap items-center gap-3">
              <SystemStatusBadge status={system.status} />
              <span className="jp-label text-muted-foreground">{system.jp}</span>
            </div>

            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              {system.kind === "system" ? "curated system" : "módulo de sistema"} · REJENDARI
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
              {system.name}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
              {system.taglinePt}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {isReservable(system) ? <ReserveButton system={system} size="lg" /> : null}
              <LikeFavoriteButtons system={system} />
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3">
              <div className="bg-card p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                  Reservas
                </p>
                <p className="mt-2 font-display text-2xl font-semibold">{demand.reservations}</p>
              </div>
              <div className="bg-card p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                  Procura (un.)
                </p>
                <p className="mt-2 font-display text-2xl font-semibold">{demand.units}</p>
              </div>
              <div className="bg-card p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                  Target price
                </p>
                <p className="mt-2 font-display text-2xl font-semibold">{price ?? "-"}</p>
              </div>
            </div>

            {system.targetMoq ? (
              <DemandProgress
                units={demand.units}
                moq={system.targetMoq}
                className="mt-5 max-w-xl"
              />
            ) : null}

            <p className="mt-6 max-w-xl font-mono text-[9px] uppercase leading-5 tracking-[0.13em] text-muted-foreground">
              Reservation is free · final price confirmed before payment · never a fake stock
              counter
            </p>
          </div>

          <div className="relative border-t border-border lg:border-l lg:border-t-0">
            <SystemMontage system={system} max={4} className="min-h-72" />
            {lead && (
              <p className="border-t border-border bg-card px-5 py-3 text-xs leading-5 text-muted-foreground">
                {lead.brand} {lead.model}, componente âncora deste system, selecionado e configurado
                pela REJENDARI.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface/45">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-16">
          <p className="jp-label text-primary">構成 · o que o sistema desbloqueia</p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Módulos, não uma parede de peças.
          </h2>

          <div className="mt-8 space-y-px border border-border bg-border">
            {system.modules.map((module) => {
              const resolved = resolveSystemPieces(system).get(module.role) ?? [];
              return (
                <article key={module.role} className="bg-card p-5 sm:p-7">
                  <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
                    <span className="bg-[#1b1917] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white">
                      {module.role}
                    </span>
                    <h3 className="font-display text-xl font-semibold tracking-[-0.03em]">
                      {module.title}
                    </h3>
                    {module.impactReady ? <ImpactReadySeal /> : null}
                  </div>

                  {resolved.length > 0 ? (
                    <ul className="mt-4 divide-y divide-border">
                      {resolved.map((piece) => (
                        <li key={piece.refId} className="flex items-center gap-4 py-3">
                          <Link
                            to="/referencia/$id"
                            params={{ id: piece.refId }}
                            className="product-plate group relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden"
                          >
                            {piece.reference.imageUrl ? (
                              <ProductImage
                                src={piece.reference.imageUrl}
                                alt={piece.reference.imageAlt ?? piece.reference.namePt}
                                className="h-full w-full object-contain p-1.5"
                              />
                            ) : (
                              <ProductMonogram
                                brand={piece.reference.brand}
                                label={piece.reference.namePt}
                                className="flex h-full w-full items-center justify-center"
                              />
                            )}
                          </Link>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium leading-5">
                              <Link
                                to="/referencia/$id"
                                params={{ id: piece.refId }}
                                className="hover:text-primary"
                              >
                                {piece.reference.brand} {piece.reference.model}
                              </Link>
                              {piece.qty && piece.qty > 1 ? (
                                <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                                  × {piece.qty}
                                </span>
                              ) : null}
                            </p>
                            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                              {piece.whyPt}
                            </p>
                          </div>
                          <p className="hidden shrink-0 font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground sm:block">
                            REF {piece.reference.officialCode ?? piece.reference.model}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {module.pendingPt?.map((pending) => (
                    <p
                      key={pending}
                      className="mt-4 border border-dashed border-border bg-background px-4 py-3 text-xs leading-5 text-muted-foreground"
                    >
                      <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                        EM SOURCING
                      </span>
                      {pending}
                    </p>
                  ))}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {lead && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-16">
            <div className="grid gap-px border border-border bg-border lg:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-[#1b1917] p-7 sm:p-9">
                <p className="jp-label text-[#e3c27c]">透明性 · fabricante sempre transparente</p>
                <h2 className="mt-4 font-display text-3xl font-semibold leading-[1] tracking-[-0.05em] text-white">
                  Original dentro. Curadoria nossa.
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/60">
                  Nunca alteramos gravações, logos ou referências do fabricante. A REJENDARI
                  adiciona seleção, configuração e embalagem, nada mais.
                </p>
              </div>
              <dl className="divide-y divide-border bg-card">
                <div className="grid grid-cols-[0.9fr_1.1fr] gap-4 px-5 py-4">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    Manufacturer
                  </dt>
                  <dd className="text-sm">
                    {lead.brand}
                    {lead.manufacturedIn ? ` · ${lead.manufacturedIn}` : ""}
                  </dd>
                </div>
                <div className="grid grid-cols-[0.9fr_1.1fr] gap-4 px-5 py-4">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    Original reference
                  </dt>
                  <dd className="font-mono text-sm">{lead.officialCode ?? lead.model}</dd>
                </div>
                <div className="grid grid-cols-[0.9fr_1.1fr] gap-4 px-5 py-4">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    Especificação
                  </dt>
                  <dd className="text-sm leading-6 text-muted-foreground">
                    {lead.specPt ?? lead.notePt}
                  </dd>
                </div>
                {lead.evidencePt && (
                  <div className="grid grid-cols-[0.9fr_1.1fr] gap-4 px-5 py-4">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                      Fonte
                    </dt>
                    <dd className="text-sm leading-6 text-muted-foreground">
                      {lead.evidencePt}{" "}
                      <a
                        href={lead.referenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-1 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-primary hover:underline"
                      >
                        Página oficial
                      </a>
                    </dd>
                  </div>
                )}
                <div className="grid grid-cols-[0.9fr_1.1fr] gap-4 px-5 py-4">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    Packed / curated by
                  </dt>
                  <dd className="text-sm">REJENDARI · Portugal</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      )}

      {system.perfectMatches && system.perfectMatches.length > 0 && (
        <section className="border-b border-border bg-surface/45">
          <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-16">
            <p className="jp-label text-primary">完璧な組み合わせ · perfect matches</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              O que se segue, com razão funcional.
            </h2>

            <div className="mt-7 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {system.perfectMatches.map((match) => {
                const target = systemById(match.targetId);
                if (!target) return null;
                return (
                  <Link
                    key={match.targetId}
                    to="/systems/$id"
                    params={{ id: target.id }}
                    className="group flex flex-col bg-card p-5 transition-colors hover:bg-surface/60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold tracking-[-0.03em] group-hover:text-primary">
                        {target.name}
                      </h3>
                      <SystemStatusBadge status={target.status} />
                    </div>
                    <p className="mt-3 flex-1 text-xs leading-5 text-muted-foreground">
                      {match.reasonPt}
                    </p>
                    <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.13em] text-foreground">
                      Ver módulo
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="paper-panel mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#a87c1f]" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                best component wins
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/75">
                Este system não é “tudo de uma marca”. O ANEX 397 está aqui porque é a ferramenta
                certa; os bits Ryujin porque queremos o aço; a Wera Zyklop porque queremos aquele
                roquete. Outro fabricante entra apenas quando resolve claramente melhor outra
                interface.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
