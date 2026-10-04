import { Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, Users } from "lucide-react";
import { referenceById } from "@/data/curated-tool-references";
import { dropUnlocked, targetPriceLabel, type RejendariSystem } from "@/data/systems";
import { mergedDemand, useSystemDemand } from "@/lib/systems-demand";
import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import {
  DemandProgress,
  LikeFavoriteButtons,
  ReserveButton,
  SystemStatusBadge,
} from "@/components/systems/SystemPrimitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SystemPlate({ system, className }: { system: RejendariSystem; className?: string }) {
  const reference = system.imageRefId ? referenceById(system.imageRefId) : undefined;
  if (!reference) return null;
  return (
    <div className={cn("product-plate overflow-hidden", className)}>
      {reference.imageUrl ? (
        <ProductImage
          src={reference.imageUrl}
          alt={reference.imageAlt ?? reference.namePt}
          className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <ProductMonogram
          brand={reference.brand}
          label={reference.namePt}
          className="flex h-full w-full items-center justify-center"
        />
      )}
    </div>
  );
}

function targetPriceRow(system: RejendariSystem, dark = false) {
  const price = targetPriceLabel(system);
  if (!price) return null;
  return (
    <p
      className={cn(
        "font-mono text-[9px] uppercase tracking-[0.14em]",
        dark ? "text-white/50" : "text-muted-foreground",
      )}
    >
      Target price <span className={dark ? "text-white" : "text-foreground"}>{price}</span>
    </p>
  );
}

/** Card grande do featured drop — banda escura, status RESERVATIONS OPEN. */
export function FeaturedDropCard({ system }: { system: RejendariSystem }) {
  const { data: demandBySystem } = useSystemDemand();
  const demand = mergedDemand(system, demandBySystem?.[system.id]);
  const unlocked = dropUnlocked(system, demandBySystem?.[system.id]?.units ?? 0);

  return (
    <div className="group grid border border-white/12 bg-[#23211d] lg:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-[#dfbba4] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[#1b1917]">
            {unlocked ? "DROP CONFIRMED" : "RESERVATIONS OPEN"}
          </span>
          <SystemStatusBadge status={system.status} />
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          {system.jp} · primeiro flagship drop
        </p>
        <h3 className="mt-3 font-display text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl">
          {system.name}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">{system.taglinePt}</p>

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.13em] text-white/70">
          {system.capabilitiesPt.map((capability) => (
            <li key={capability} className="flex items-center gap-2">
              <span className="inline-block h-1 w-1 bg-[#dfbba4]" aria-hidden="true" />
              {capability}
            </li>
          ))}
        </ul>

        {system.targetMoq ? (
          <DemandProgress
            units={demand.units}
            moq={system.targetMoq}
            dark
            className="mt-7 max-w-md"
          />
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ReserveButton system={system} dark size="lg" />
          <LikeFavoriteButtons system={system} dark />
        </div>
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.13em] text-white/40">
          {demand.reservations} reservas registadas ·{" "}
          {targetPriceLabel(system) ? `target price ${targetPriceLabel(system)} · ` : ""}reservation
          is free
        </p>
      </div>

      <div className="relative border-t border-white/12 lg:border-l lg:border-t-0">
        <SystemPlate system={system} className="h-full min-h-72" />
        <p className="pointer-events-none absolute bottom-4 left-5 font-mono text-[9px] uppercase tracking-[0.14em] text-black/45">
          ANEX 397 · selected and configured by REJENDARI
        </p>
      </div>
    </div>
  );
}

/** Card de system (kind: system) — grade clara com 2–3 capacidades e CTA. */
export function SystemCard({ system }: { system: RejendariSystem }) {
  const { data: demandBySystem } = useSystemDemand();
  const demand = mergedDemand(system, demandBySystem?.[system.id]);

  return (
    <div className="group flex flex-col border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_50px_rgba(42,36,29,0.12)]">
      <Link to="/systems/$id" params={{ id: system.id }} className="relative block">
        <SystemPlate system={system} className="aspect-[16/9]" />
        <div className="absolute left-4 top-4">
          <SystemStatusBadge status={system.status} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-semibold tracking-[-0.03em]">
            <Link to="/systems/$id" params={{ id: system.id }} className="hover:text-primary">
              {system.name}
            </Link>
          </h3>
          <span className="jp-label shrink-0 text-muted-foreground">{system.jp}</span>
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
          {system.capabilitiesPt.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          {system.targetMoq ? (
            <DemandProgress units={demand.units} moq={system.targetMoq} className="mb-4" />
          ) : null}
          <div className="flex items-center justify-between gap-3">
            {targetPriceRow(system)}
            <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
              <Users className="h-3 w-3" />
              {demand.reservations} reservas
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <ReserveButton system={system} size="sm" />
            <Link
              to="/systems/$id"
              params={{ id: system.id }}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.13em] text-foreground transition-colors hover:text-primary"
            >
              Ver system
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <LikeFavoriteButtons system={system} className="ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Card de módulo (kind: module) — mais compacto, selo IMPACT READY quando aplicável. */
export function ModuleCard({ system }: { system: RejendariSystem }) {
  const { data: demandBySystem } = useSystemDemand();
  const demand = mergedDemand(system, demandBySystem?.[system.id]);
  const impactReady = system.modules.some((module) => module.impactReady);

  return (
    <div className="group flex flex-col border border-border bg-card transition-colors duration-300 hover:border-primary/50">
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <SystemStatusBadge status={system.status} />
        {impactReady ? (
          <span className="inline-flex items-center gap-1.5 border border-primary/35 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-primary">
            IMPACT READY
          </span>
        ) : null}
      </div>

      <Link to="/systems/$id" params={{ id: system.id }}>
        <SystemPlate system={system} className="aspect-[16/7]" />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold tracking-[-0.03em]">
          <Link to="/systems/$id" params={{ id: system.id }} className="hover:text-primary">
            {system.name}
          </Link>
          <span className="jp-label ml-2 text-muted-foreground">{system.jp}</span>
        </h3>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{system.taglinePt}</p>

        <div className="mt-auto pt-4">
          {system.targetMoq ? (
            <DemandProgress units={demand.units} moq={system.targetMoq} className="mb-3" />
          ) : null}
          <div className="flex items-center justify-between gap-2">
            {targetPriceRow(system)}
            <LikeFavoriteButtons system={system} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <ReserveButton system={system} size="sm" />
            <Link
              to="/systems/$id"
              params={{ id: system.id }}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.13em] text-foreground transition-colors hover:text-primary"
            >
              Detalhe
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Card LAB — combinação em estudo; o CTA é o ♡ ("Quero que isto exista"). */
export function LabCard({ system }: { system: RejendariSystem }) {
  return (
    <div className="group flex flex-col border border-dashed border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          <FlaskConical className="h-3.5 w-3.5" />
          REJENDARI LAB
        </span>
        <SystemStatusBadge status={system.status} />
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.03em]">
        <Link to="/systems/$id" params={{ id: system.id }} className="hover:text-primary">
          {system.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-xs leading-5 text-muted-foreground">{system.taglinePt}</p>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
        {system.capabilitiesPt.map((capability) => (
          <li key={capability}>{capability}</li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-dashed border-border pt-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
          Quero que isto exista
        </p>
        <LikeFavoriteButtons system={system} />
      </div>
    </div>
  );
}

/** Colunas de procura da comunidade (Most Wanted / Fastest Growing / Almost Unlocked). */
export function CommunityDemandList({
  title,
  jp,
  systems,
  realUnitsBySystem,
  metric,
}: {
  title: string;
  jp: string;
  systems: RejendariSystem[];
  realUnitsBySystem: Record<string, number>;
  metric: (system: RejendariSystem) => string;
}) {
  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-baseline justify-between gap-3 border-b border-border pb-3">
        <h3 className="font-display text-lg font-semibold tracking-[-0.03em]">{title}</h3>
        <span className="jp-label text-muted-foreground">{jp}</span>
      </div>
      <ol className="divide-y divide-border">
        {systems.map((system, index) => (
          <li key={system.id} className="flex items-center gap-3 py-3">
            <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
            <Link
              to="/systems/$id"
              params={{ id: system.id }}
              className="flex-1 text-sm font-medium leading-5 hover:text-primary"
            >
              {system.name}
            </Link>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
              {metric(system)}
            </span>
          </li>
        ))}
        {systems.length === 0 && (
          <li className="py-3 text-sm text-muted-foreground">Ainda sem procura registada.</li>
        )}
      </ol>
      <p className="sr-only">
        {Object.keys(realUnitsBySystem).length} interações reais consideradas
      </p>
    </div>
  );
}

/** Usado apenas onde se quer um CTA fantasma para a página do system. */
export function SystemGhostLink({
  system,
  dark = false,
}: {
  system: RejendariSystem;
  dark?: boolean;
}) {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "rounded-none",
        dark && "border-white/25 bg-transparent text-white hover:bg-white hover:text-[#1b1917]",
      )}
    >
      <Link to="/systems/$id" params={{ id: system.id }}>
        Ver {system.name}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}
