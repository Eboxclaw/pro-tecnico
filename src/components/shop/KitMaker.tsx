import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, RefreshCw, Send, X } from "lucide-react";
import { referenceById, type CuratedToolReference } from "@/data/curated-tool-references";
import { KIT_MAKER_STEPS, type KitMakerStep } from "@/data/kit-maker";
import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import { ToolSymbols } from "@/components/shop/ToolSymbols";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Padrão partilhado das sub-tabs (ramos no KitMaker, grupos no KitBuilder):
 *  maiores (≥44px de toque), com régua por baixo e a ativa plenamente dourada —
 *  lê-se como "aba" ao primeiro olhar, nunca como card. Scroll horizontal
 *  quando não cabem (o contentor usa .tab-rail). */
const SUB_TAB_BASE =
  "-mb-px min-h-11 shrink-0 whitespace-nowrap border border-transparent border-b-2 px-4 py-2.5 mono-caps transition-all duration-200 sm:px-5";
const SUB_TAB_ACTIVE =
  "border-primary bg-primary font-semibold text-[#1b1917] shadow-[0_10px_28px_rgba(212,165,63,0.30)]";
const SUB_TAB_INACTIVE = "text-foreground/70 hover:border-primary/50 hover:text-foreground";

/** Mudanças de tab/passo nunca mexem no scroll: captura a posição, corre a
 *  mutação e repõe no frame seguinte — protege contra saltos quando o
 *  conteúdo acima encolhe ou o browser tenta reancorar. */
const preserveScroll = (fn: () => void) => {
  const y = window.scrollY;
  fn();
  requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "auto" }));
};

/** Estado de um passo: peças escolhidas, ou um dos dois skips. */
type StepState = { picked: string[]; mode: "picked" | "owned" | "notneeded" | null };

const EMPTY_STATE: StepState = { picked: [], mode: null };

/** Card de opção do wizard: foto + marca/modelo + bolinhas. Toggle multi-escolha. */
function MakerOptionCard({
  tool,
  selected,
  disabled,
  onToggle,
}: {
  tool: CuratedToolReference;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      disabled={disabled}
      className={cn(
        "kit-option-card group relative flex flex-col border p-3 text-left transition-all duration-200",
        FOCUS_RING,
        selected
          ? "border-primary bg-primary/10 shadow-[0_14px_36px_rgba(212,165,63,0.22)]"
          : "border-border bg-card enabled:hover:scale-[1.02] enabled:hover:border-primary enabled:hover:shadow-[0_16px_40px_rgba(212,165,63,0.16)]",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {selected && (
        <span className="absolute right-2 top-2 z-10 flex h-6 w-6 animate-in zoom-in-50 fill-mode-both items-center justify-center rounded-full bg-primary text-[#1b1917] shadow-[0_4px_14px_rgba(212,165,63,0.5)] duration-200">
          <Check className="h-3.5 w-3.5" strokeWidth={3.5} aria-hidden />
        </span>
      )}
      <span className="product-plate block h-24 w-full overflow-hidden border border-border">
        {tool.imageUrl ? (
          <ProductImage
            src={tool.imageUrl}
            alt={tool.imageAlt ?? tool.namePt}
            className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <ProductMonogram
            brand={tool.brand}
            label={tool.namePt}
            className="flex h-full w-full items-center justify-center"
          />
        )}
      </span>
      <span className="mt-2 block truncate mono-caps text-primary">
        {tool.brand} {tool.model}
      </span>
      <span className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
        {tool.namePt}
      </span>
      <ToolSymbols tool={tool} compact className="mt-1.5" />
    </button>
  );
}

/**
 * Kit Maker — wizard guiado: nome, sequência de cartões multi-escolha com
 * "já tenho" / "não preciso", e o resumo final com pedido B2B.
 */
export function KitMaker() {
  const [started, setStarted] = useState(false);
  const [name, setName] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [branchByStep, setBranchByStep] = useState<Record<string, string>>({});
  const [states, setStates] = useState<Record<string, StepState>>({});

  const step: KitMakerStep | undefined = KIT_MAKER_STEPS[stepIndex];
  const isSummary = started && !step;
  const progress = started ? Math.min(stepIndex + 1, KIT_MAKER_STEPS.length) : 0;

  const stateOf = (id: string): StepState => states[id] ?? EMPTY_STATE;

  const setState = (id: string, next: StepState) => setStates((prev) => ({ ...prev, [id]: next }));

  const togglePick = (id: string, refId: string) => {
    const current = stateOf(id);
    if (current.mode === "picked" && current.picked.includes(refId)) {
      setState(id, {
        picked: current.picked.filter((p) => p !== refId),
        mode: current.picked.length > 1 ? "picked" : null,
      });
    } else {
      setState(id, {
        picked: current.picked.includes(refId) ? current.picked : [...current.picked, refId],
        mode: "picked",
      });
    }
  };

  const markSkip = (id: string, mode: "owned" | "notneeded") => {
    const current = stateOf(id);
    setState(id, current.mode === mode ? EMPTY_STATE : { picked: [], mode });
  };

  const activeBranch = (s: KitMakerStep) => {
    const wanted = branchByStep[s.id] ?? s.branches?.[0]?.id;
    return s.branches?.find((b) => b.id === wanted) ?? s.branches?.[0];
  };

  // sub-tabs temáticas (groups) por passo — ex.: roquetes na ordem de batalha
  const [groupByStep, setGroupByStep] = useState<Record<string, string>>({});

  const activeGroup = (s: KitMakerStep) => {
    const wanted = groupByStep[s.id] ?? s.groups?.[0]?.id;
    return s.groups?.find((g) => g.id === wanted) ?? s.groups?.[0];
  };

  const activeRefIds = (s: KitMakerStep): string[] => {
    if (s.branches) return activeBranch(s)?.refIds ?? [];
    if (s.groups) return activeGroup(s)?.refIds ?? [];
    return s.refIds ?? [];
  };

  const resolve = (refId: string) => referenceById(refId);

  const reset = () => {
    setStarted(false);
    setName("");
    setStepIndex(0);
    setBranchByStep({});
    setStates({});
  };

  // ── codificação para o B2B ──
  const encodeSelection = () =>
    KIT_MAKER_STEPS.map((s) => {
      const st = stateOf(s.id);
      if (st.mode === "owned") return `${s.id}:@owned`;
      if (st.mode === "notneeded") return `${s.id}:@skip`;
      return st.picked.map((refId) => `${s.id}:${refId}`).join(",");
    })
      .filter(Boolean)
      .join(",");

  const b2bSearch = {
    maker: name.trim() || "cliente",
    mksel: encodeSelection() || undefined,
  };

  // ── INTRO ──
  if (!started) {
    return (
      <section className="border-b border-border bg-surface/45">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="jp-label text-primary">キットメーカー · kit maker</p>
            <h2 className="mt-4 text-display-1">
              Diz-nos o teu nome.
              <br />
              <span className="text-primary">O kit constrói-se ao teu ritmo.</span>
            </h2>

            <p className="mt-6 border-l-2 border-primary pl-4 font-display text-lg italic leading-relaxed text-foreground/90 sm:text-xl">
              light weight, high reach <span className="not-italic text-primary">·</span> low
              effort, high outcome
            </p>

            <p className="mt-5 max-w-2xl text-body text-muted-foreground">
              Pensamos em ferramentas como <span className="text-foreground">sinergias</span> e não
              como objectos individuais: cada cartão pergunta um gesto do teu dia, cada escolha
              completa a anterior. Sem preços — a fórmula termina em{" "}
              <span className="font-display text-base font-semibold text-primary">?</span> e o
              pedido segue para o B2B.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="o teu nome ou o nome da equipa"
                aria-label="o teu nome ou o nome da equipa"
                className={cn(
                  "w-full border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground",
                  FOCUS_RING,
                )}
              />
              <Button
                size="lg"
                className="shrink-0 rounded-none px-7 text-sm font-semibold shadow-[0_14px_36px_rgba(212,165,63,0.25)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(212,165,63,0.38)]"
                onClick={() => setStarted(true)}
                disabled={!name.trim()}
              >
                Quero o meu kit à medida
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              <span className="font-display text-sm font-semibold text-foreground">
                {KIT_MAKER_STEPS.length} passos.
              </span>{" "}
              Zero pressa. O kit sai à tua medida.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ── RESUMO ──
  if (isSummary) {
    const picked = KIT_MAKER_STEPS.map((s) => ({
      step: s,
      st: stateOf(s.id),
    }));
    const totalPicked = picked.reduce((sum, { st }) => sum + st.picked.length, 0);
    return (
      <section className="border-b border-border bg-surface/45">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="jp-label text-primary">完成 · o teu kit</p>
            <h2 className="mt-4 text-display-1">
              O teu kit, <span className="text-primary">{name.trim()}</span>.
            </h2>
            <p className="mt-4 max-w-2xl text-body text-muted-foreground">
              {totalPicked} peças pensadas como sinergia — light weight, high reach; low effort,
              high outcome. A fórmula:{" "}
              <span className="font-display text-foreground">tudo isto = </span>
              <span className="font-display text-3xl text-primary">?</span>
            </p>

            <div className="mt-8 space-y-5">
              {picked.map(({ step: s, st }) => {
                const tools = st.picked.map(resolve).filter(Boolean);
                return (
                  <div key={s.id} className="border border-border bg-card p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold tracking-[-0.03em]">
                        {s.topicPt}{" "}
                        <span className="jp-label ml-2 text-muted-foreground">{s.jp}</span>
                      </h3>
                      {st.mode === "owned" && (
                        <span className="inline-flex items-center gap-1.5 border border-primary/40 bg-primary/10 px-2 py-0.5 mono-caps text-primary">
                          <Check className="h-3 w-3" aria-hidden /> já tenho
                        </span>
                      )}
                      {st.mode === "notneeded" && (
                        <span className="inline-flex items-center gap-1.5 border border-border px-2 py-0.5 mono-caps text-muted-foreground">
                          <X className="h-3 w-3" aria-hidden /> não preciso
                        </span>
                      )}
                      {st.mode === "picked" && (
                        <span className="mono-caps text-primary">
                          {st.picked.length} escolhida{st.picked.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    {tools.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {tools.map(
                          (tool) =>
                            tool && (
                              <li
                                key={tool.id}
                                className="flex items-center gap-2.5 border border-border bg-background/50 py-1 pl-1 pr-3 transition-colors duration-200 hover:border-primary/50"
                              >
                                <span className="product-plate block h-8 w-8 shrink-0 overflow-hidden border border-border">
                                  {tool.imageUrl ? (
                                    <ProductImage
                                      src={tool.imageUrl}
                                      alt={tool.imageAlt ?? tool.namePt}
                                      className="h-full w-full object-contain p-0.5"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <ProductMonogram
                                      brand={tool.brand}
                                      label={tool.namePt}
                                      className="flex h-full w-full items-center justify-center"
                                    />
                                  )}
                                </span>
                                <span className="min-w-0">
                                  <span className="block truncate text-xs font-medium text-foreground/90">
                                    {tool.brand} {tool.model}
                                  </span>
                                  <span className="mono-caps block truncate text-muted-foreground">
                                    {tool.namePt}
                                  </span>
                                </span>
                              </li>
                            ),
                        )}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="rounded-none px-7 font-semibold shadow-[0_14px_36px_rgba(212,165,63,0.25)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(212,165,63,0.38)]"
                asChild
              >
                {/* maker/mksel são aceites no validateSearch da rota /b2b; o
                    routeTree.gen ainda não refletem os novos params */}
                <Link to="/b2b" search={b2bSearch as never}>
                  <Send className="mr-2 h-4 w-4" />
                  Pedir no B2B · o meu kit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-none px-5" onClick={reset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Recomeçar do zero
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── PASSO CORRENTE ──
  if (!step) return null;
  const st = stateOf(step.id);
  const branch = activeBranch(step);

  return (
    <section className="border-b border-border bg-surface/45">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
        {/* progresso — barra expressiva: mais alta, com contagem e marcas visíveis */}
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="mono-caps text-muted-foreground">
              passo{" "}
              <span className="font-display text-xl font-semibold leading-none text-primary">
                {progress}
              </span>
              <span className="text-muted-foreground/70">/{KIT_MAKER_STEPS.length}</span> ·{" "}
              {name.trim()}
            </p>
            <div className="flex flex-wrap gap-1.5" aria-hidden>
              {KIT_MAKER_STEPS.map((s, i) => (
                <span
                  key={s.id}
                  className={cn(
                    "h-2.5 w-8 transition-all duration-500",
                    i < stepIndex && "bg-primary",
                    i === stepIndex &&
                      "kit-step-dot scale-y-110 bg-primary shadow-[0_0_14px_rgba(212,165,63,0.6)]",
                    i > stepIndex && "bg-border",
                  )}
                />
              ))}
            </div>
          </div>
          <div
            className="mt-3 h-3 w-full overflow-hidden rounded-full bg-border shadow-[inset_0_1px_3px_rgba(0,0,0,0.35)]"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={KIT_MAKER_STEPS.length}
            aria-label={`passo ${progress} de ${KIT_MAKER_STEPS.length}`}
          >
            <div
              className="kit-progress-fill h-full rounded-full bg-gradient-to-r from-[#a87c1f] via-primary to-[#e3c27c] shadow-[0_0_18px_rgba(212,165,63,0.55)] transition-[width] duration-500 ease-out"
              style={{ width: `${(progress / KIT_MAKER_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* cartão do passo */}
        <div
          key={step.id}
          className="kit-card-enter mx-auto mt-8 max-w-4xl border border-border bg-card shadow-[0_24px_60px_rgba(20,17,14,0.35)]"
        >
          <div className="relative overflow-hidden border-b border-border p-6 sm:p-8">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-3 right-4 select-none font-display text-6xl font-semibold leading-none text-primary/10 sm:-top-4 sm:right-8 sm:text-7xl"
            >
              {step.jp}
            </span>
            <div className="relative flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-display-2">{step.topicPt}</h3>
              <p className="jp-label text-primary">{step.jp}</p>
            </div>
            <p className="relative mt-2 text-xl font-medium leading-snug tracking-[-0.01em] text-foreground">
              {step.questionPt}
            </p>
            {step.notePt && (
              <p className="relative mt-2 text-xs leading-5 text-muted-foreground/80">
                {step.notePt}
              </p>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {step.branches && (
              <div
                role="tablist"
                aria-label={`${step.topicPt}: escolhe o ramo`}
                className="tab-rail -mx-1 flex items-end gap-1.5 overflow-x-auto border-b border-border px-1"
              >
                {step.branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    role="tab"
                    aria-selected={branch?.id === b.id}
                    onClick={() =>
                      preserveScroll(() =>
                        setBranchByStep((prev) => ({ ...prev, [step.id]: b.id })),
                      )
                    }
                    className={cn(
                      SUB_TAB_BASE,
                      FOCUS_RING,
                      branch?.id === b.id ? SUB_TAB_ACTIVE : SUB_TAB_INACTIVE,
                    )}
                  >
                    {b.labelPt}
                  </button>
                ))}
              </div>
            )}

            {!step.branches && step.groups && (
              <div
                role="tablist"
                aria-label={`${step.topicPt}: sub-tabs`}
                className="tab-rail -mx-1 flex items-end gap-1.5 overflow-x-auto border-b border-border px-1"
              >
                {step.groups.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    role="tab"
                    aria-selected={activeGroup(step)?.id === g.id}
                    onClick={() =>
                      preserveScroll(() => setGroupByStep((prev) => ({ ...prev, [step.id]: g.id })))
                    }
                    className={cn(
                      SUB_TAB_BASE,
                      FOCUS_RING,
                      activeGroup(step)?.id === g.id ? SUB_TAB_ACTIVE : SUB_TAB_INACTIVE,
                    )}
                  >
                    {g.labelPt}
                  </button>
                ))}
              </div>
            )}

            <div
              className={cn(
                "mt-4 grid grid-cols-1 gap-2 min-[480px]:grid-cols-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4",
                (step.branches || step.groups) && "border-t border-border/60 pt-4",
              )}
            >
              {activeRefIds(step).map((refId) => {
                const tool = resolve(refId);
                if (!tool) return null;
                return (
                  <MakerOptionCard
                    key={refId}
                    tool={tool}
                    selected={st.mode === "picked" && st.picked.includes(refId)}
                    disabled={st.mode !== null && st.mode !== "picked"}
                    onToggle={() => togglePick(step.id, refId)}
                  />
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <p className="mono-caps text-muted-foreground/70">ou:</p>
              <button
                type="button"
                onClick={() => preserveScroll(() => markSkip(step.id, "owned"))}
                aria-pressed={st.mode === "owned"}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 border px-5 mono-caps transition-all duration-200",
                  FOCUS_RING,
                  st.mode === "owned"
                    ? "border-primary bg-primary/15 text-foreground shadow-[0_8px_24px_rgba(212,165,63,0.16)]"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-colors duration-200",
                    st.mode === "owned"
                      ? "border-primary bg-primary text-[#1b1917]"
                      : "border-current",
                  )}
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={4} aria-hidden />
                </span>
                já tenho
              </button>
              <button
                type="button"
                onClick={() => preserveScroll(() => markSkip(step.id, "notneeded"))}
                aria-pressed={st.mode === "notneeded"}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 border px-5 mono-caps transition-all duration-200",
                  FOCUS_RING,
                  st.mode === "notneeded"
                    ? "border-primary bg-primary/15 text-foreground shadow-[0_8px_24px_rgba(212,165,63,0.16)]"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-colors duration-200",
                    st.mode === "notneeded"
                      ? "border-primary bg-primary text-[#1b1917]"
                      : "border-current",
                  )}
                >
                  <X className="h-2.5 w-2.5" strokeWidth={4} aria-hidden />
                </span>
                não preciso
              </button>
            </div>
          </div>
        </div>

        {/* navegação — mantém o contexto de scroll entre passos */}
        <div className="mx-auto mt-6 flex max-w-4xl items-center justify-between gap-3">
          <Button
            variant="outline"
            className="min-h-11 rounded-none px-5 py-3"
            onClick={() => preserveScroll(() => setStepIndex((i) => Math.max(0, i - 1)))}
            disabled={stepIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button
            className="min-h-11 rounded-none px-5 py-3 font-semibold shadow-[0_14px_36px_rgba(212,165,63,0.22)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(212,165,63,0.35)]"
            onClick={() =>
              preserveScroll(() => setStepIndex((i) => Math.min(KIT_MAKER_STEPS.length, i + 1)))
            }
          >
            {stepIndex === KIT_MAKER_STEPS.length - 1 ? "Ver o meu kit" : "Seguinte"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
