import { useEffect, useRef, useState } from "react";
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
 * Kit Maker — bloco de entrada compacto + wizard guiado dentro de uma modal
 * popup: nome, sequência de cartões multi-escolha com "já tenho" / "não
 * preciso" e o resumo final com pedido B2B — tudo no mesmo card centrado.
 * Fechar na cruz (ou Escape) preserva o progresso; o bloco de entrada passa a
 * mostrar "Continuar o meu kit" até o pedido seguir para o B2B ou Recomeçar.
 */
export function KitMaker() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [branchByStep, setBranchByStep] = useState<Record<string, string>>({});
  const [groupByStep, setGroupByStep] = useState<Record<string, string>>({});
  const [states, setStates] = useState<Record<string, StepState>>({});

  const cardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(false);

  const step: KitMakerStep | undefined = KIT_MAKER_STEPS[stepIndex];
  const isSummary = stepIndex >= KIT_MAKER_STEPS.length;
  const progress = Math.min(stepIndex + 1, KIT_MAKER_STEPS.length);
  const hasProgress = stepIndex > 0 || Object.keys(states).length > 0;

  // ── acessibilidade da modal: foco no card ao abrir e fechar com Escape ──
  useEffect(() => {
    if (!open) return;
    cardRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // ao fechar, o foco regressa ao CTA do bloco de entrada
  useEffect(() => {
    if (prevOpen.current && !open) triggerRef.current?.focus();
    prevOpen.current = open;
  }, [open]);

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

  /** Mudanças de tab/skip nunca mexem no scroll: captura o scrollTop da área
   *  scrollável do card e repõe no frame seguinte. */
  const preserveScroll = (fn: () => void) => {
    const el = scrollRef.current;
    const top = el?.scrollTop ?? 0;
    fn();
    requestAnimationFrame(() => el?.scrollTo({ top, behavior: "auto" }));
  };

  /** Mudança de passo/resumo: o conteúdo novo começa no topo do card. */
  const goToStep = (next: number) => {
    setStepIndex(next);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0, behavior: "auto" }));
  };

  const reset = () => {
    setOpen(false);
    setName("");
    setStepIndex(0);
    setBranchByStep({});
    setGroupByStep({});
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

  const pickedSteps = KIT_MAKER_STEPS.map((s) => ({ step: s, st: stateOf(s.id) }));
  const totalPicked = pickedSteps.reduce((sum, { st }) => sum + st.picked.length, 0);

  return (
    <>
      {/* ── BLOCO DE ENTRADA (compacto) ── */}
      <section className="border-b border-border bg-surface/45">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:py-10">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="jp-label text-primary">キットメーカー · kit maker</p>
              <h2 className="mt-2 text-display-1">Faz o teu kit.</h2>
              <p className="mt-3 border-l-2 border-primary pl-3 font-display text-base italic leading-relaxed text-foreground/90 sm:text-lg">
                light weight, high reach <span className="not-italic text-primary">·</span> low
                effort, high outcome
              </p>
            </div>

            <div className="w-full shrink-0 sm:w-80">
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
                ref={triggerRef}
                size="lg"
                className="mt-3 w-full rounded-none px-7 text-sm font-semibold shadow-[0_14px_36px_rgba(212,165,63,0.25)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(212,165,63,0.38)]"
                onClick={() => setOpen(true)}
                disabled={!name.trim()}
              >
                {hasProgress ? "Continuar o meu kit" : "Quero o meu kit à medida"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                <span className="font-display text-sm font-semibold text-foreground">
                  {KIT_MAKER_STEPS.length} passos.
                </span>{" "}
                Zero pressa, sem preços — a fórmula termina em{" "}
                <span className="font-display font-semibold text-primary">?</span> e o pedido segue
                para o B2B.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL DO WIZARD ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm sm:items-center sm:p-6">
          <div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-label={
              isSummary
                ? "O teu kit — resumo final"
                : step
                  ? `Faz o teu kit — passo ${progress} de ${KIT_MAKER_STEPS.length}: ${step.topicPt}`
                  : "Faz o teu kit"
            }
            tabIndex={-1}
            className="absolute inset-x-3 bottom-6 top-6 flex min-h-0 flex-col overflow-hidden rounded-none border border-border bg-card shadow-[0_40px_120px_rgba(0,0,0,0.55)] outline-none sm:relative sm:max-h-[85vh] sm:w-full sm:max-w-2xl"
          >
            {/* header do card */}
            <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
              {isSummary ? (
                <div className="min-w-0">
                  <p className="jp-label text-primary">完成 · o teu kit</p>
                  <h3 className="mt-1 text-display-2">
                    O teu kit, <span className="text-primary">{name.trim()}</span>.
                  </h3>
                </div>
              ) : (
                step && (
                  <div className="min-w-0">
                    <p className="jp-label text-primary">{step.jp}</p>
                    <h3 className="mt-1 text-display-2">{step.topicPt}</h3>
                  </div>
                )
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar o kit maker"
                className={cn(
                  "inline-flex h-10 w-10 shrink-0 items-center justify-center border border-border text-muted-foreground transition-all duration-200 hover:border-primary hover:text-foreground",
                  FOCUS_RING,
                )}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            {/* conteúdo scrollável do card */}
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
              {isSummary ? (
                /* ── RESUMO (dentro da modal) ── */
                <div className="kit-card-enter">
                  <p className="text-body text-muted-foreground">
                    {totalPicked} peças pensadas como sinergia — light weight, high reach; low
                    effort, high outcome. A fórmula:{" "}
                    <span className="font-display text-foreground">tudo isto = </span>
                    <span className="font-display text-3xl text-primary">?</span>
                  </p>

                  <div className="mt-5 space-y-4">
                    {pickedSteps.map(({ step: s, st }) => {
                      const tools = st.picked.map(resolve).filter(Boolean);
                      return (
                        <div key={s.id} className="border border-border bg-background/40 p-4">
                          <div className="flex flex-wrap items-baseline justify-between gap-3">
                            <h4 className="font-display text-lg font-semibold tracking-[-0.03em]">
                              {s.topicPt}{" "}
                              <span className="jp-label ml-2 text-muted-foreground">{s.jp}</span>
                            </h4>
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
                </div>
              ) : (
                step && (
                  <div key={step.id} className="kit-card-enter">
                    {/* progresso compacto: contagem + segmentos + barra fina */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="mono-caps text-muted-foreground">
                        passo{" "}
                        <span className="font-display text-lg font-semibold leading-none text-primary">
                          {progress}
                        </span>
                        <span className="text-muted-foreground/70">/{KIT_MAKER_STEPS.length}</span>{" "}
                        · {name.trim()}
                      </p>
                      <div className="flex flex-wrap gap-1" aria-hidden>
                        {KIT_MAKER_STEPS.map((s, i) => (
                          <span
                            key={s.id}
                            className={cn(
                              "h-1.5 w-5 transition-all duration-500 sm:w-6",
                              i < stepIndex && "bg-primary",
                              i === stepIndex &&
                                "kit-step-dot scale-y-110 bg-primary shadow-[0_0_10px_rgba(212,165,63,0.6)]",
                              i > stepIndex && "bg-border",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div
                      className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={KIT_MAKER_STEPS.length}
                      aria-label={`passo ${progress} de ${KIT_MAKER_STEPS.length}`}
                    >
                      <div
                        className="kit-progress-fill h-full rounded-full bg-gradient-to-r from-[#a87c1f] via-primary to-[#e3c27c] shadow-[0_0_12px_rgba(212,165,63,0.55)] transition-[width] duration-500 ease-out"
                        style={{ width: `${(progress / KIT_MAKER_STEPS.length) * 100}%` }}
                      />
                    </div>

                    {/* pergunta */}
                    <p className="mt-4 text-lg font-medium leading-snug tracking-[-0.01em] text-foreground sm:text-xl">
                      {step.questionPt}
                    </p>
                    {step.notePt && (
                      <p className="mt-1.5 text-xs leading-5 text-muted-foreground/80">
                        {step.notePt}
                      </p>
                    )}

                    {/* sub-tabs temáticas (ramos / grupos) */}
                    {step.branches && (
                      <div
                        role="tablist"
                        aria-label={`${step.topicPt}: escolhe o ramo`}
                        className="tab-rail -mx-1 mt-4 flex items-end gap-1.5 overflow-x-auto border-b border-border px-1"
                      >
                        {step.branches.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            role="tab"
                            aria-selected={activeBranch(step)?.id === b.id}
                            onClick={() =>
                              preserveScroll(() =>
                                setBranchByStep((prev) => ({ ...prev, [step.id]: b.id })),
                              )
                            }
                            className={cn(
                              SUB_TAB_BASE,
                              FOCUS_RING,
                              activeBranch(step)?.id === b.id ? SUB_TAB_ACTIVE : SUB_TAB_INACTIVE,
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
                        className="tab-rail -mx-1 mt-4 flex items-end gap-1.5 overflow-x-auto border-b border-border px-1"
                      >
                        {step.groups.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            role="tab"
                            aria-selected={activeGroup(step)?.id === g.id}
                            onClick={() =>
                              preserveScroll(() =>
                                setGroupByStep((prev) => ({ ...prev, [step.id]: g.id })),
                              )
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

                    {/* cards de opção — 2 colunas em mobile, 3 dentro da modal */}
                    <div
                      className={cn(
                        "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3",
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
                            selected={
                              stateOf(step.id).mode === "picked" &&
                              stateOf(step.id).picked.includes(refId)
                            }
                            disabled={
                              stateOf(step.id).mode !== null && stateOf(step.id).mode !== "picked"
                            }
                            onToggle={() => togglePick(step.id, refId)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* footer do card */}
            <div className="border-t border-border p-4 sm:px-6 sm:py-4">
              {isSummary ? (
                /* ── RESUMO: pedido B2B + recomeçar ── */
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    className="min-h-11 flex-1 rounded-none px-5 font-semibold shadow-[0_14px_36px_rgba(212,165,63,0.25)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(212,165,63,0.38)] sm:flex-none"
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
                  <Button variant="outline" className="min-h-11 rounded-none px-5" onClick={reset}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Recomeçar do zero
                  </Button>
                </div>
              ) : (
                step && (
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <p className="mono-caps text-muted-foreground/70">ou:</p>
                      <button
                        type="button"
                        onClick={() => preserveScroll(() => markSkip(step.id, "owned"))}
                        aria-pressed={stateOf(step.id).mode === "owned"}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-2 border px-4 mono-caps transition-all duration-200 sm:px-5",
                          FOCUS_RING,
                          stateOf(step.id).mode === "owned"
                            ? "border-primary bg-primary/15 text-foreground shadow-[0_8px_24px_rgba(212,165,63,0.16)]"
                            : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-colors duration-200",
                            stateOf(step.id).mode === "owned"
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
                        aria-pressed={stateOf(step.id).mode === "notneeded"}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-2 border px-4 mono-caps transition-all duration-200 sm:px-5",
                          FOCUS_RING,
                          stateOf(step.id).mode === "notneeded"
                            ? "border-primary bg-primary/15 text-foreground shadow-[0_8px_24px_rgba(212,165,63,0.16)]"
                            : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-colors duration-200",
                            stateOf(step.id).mode === "notneeded"
                              ? "border-primary bg-primary text-[#1b1917]"
                              : "border-current",
                          )}
                        >
                          <X className="h-2.5 w-2.5" strokeWidth={4} aria-hidden />
                        </span>
                        não preciso
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Button
                        variant="outline"
                        className="min-h-11 rounded-none px-4 sm:px-5"
                        onClick={() => goToStep(Math.max(0, stepIndex - 1))}
                        disabled={stepIndex === 0}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Anterior
                      </Button>
                      <Button
                        className="min-h-11 rounded-none px-4 font-semibold shadow-[0_14px_36px_rgba(212,165,63,0.22)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(212,165,63,0.35)] sm:px-5"
                        onClick={() => goToStep(Math.min(KIT_MAKER_STEPS.length, stepIndex + 1))}
                      >
                        {stepIndex === KIT_MAKER_STEPS.length - 1 ? "Ver o meu kit" : "Seguinte"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
