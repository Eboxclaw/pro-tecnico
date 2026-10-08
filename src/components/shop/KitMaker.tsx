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
        "group flex flex-col border p-3 text-left transition-all duration-200",
        FOCUS_RING,
        selected
          ? "border-primary bg-primary/10 shadow-[0_12px_30px_rgba(212,165,63,0.14)]"
          : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_12px_30px_rgba(42,36,29,0.35)]",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
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
      <span className="mt-2 block truncate font-mono text-[9px] uppercase tracking-[0.13em] text-primary">
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

  const activeRefIds = (s: KitMakerStep): string[] =>
    s.branches ? (activeBranch(s)?.refIds ?? []) : (s.refIds ?? []);

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
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
              Diz-nos o teu nome.
              <br />
              <span className="text-primary">O kit constrói-se ao teu ritmo.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
              O nosso conceito é <span className="text-foreground">light weight, high reach</span> —
              low effort, high outcome. Pensamos em ferramentas como{" "}
              <span className="text-foreground">sinergias</span> e não como objectos individuais:
              cada cartão pergunta um gesto do teu dia, cada escolha completa a anterior. Sem preços
              — a fórmula termina em "?" e o pedido segue para o B2B.
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
                className="shrink-0 rounded-none"
                onClick={() => setStarted(true)}
                disabled={!name.trim()}
              >
                Começar o meu kit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {KIT_MAKER_STEPS.length} passos, cada um com "já tenho" e "não preciso" — ninguém fica
              preso a um cartão.
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
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
              O teu kit, {name.trim()}.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
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
                        <span className="border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                          ✓ já tenho
                        </span>
                      )}
                      {st.mode === "notneeded" && (
                        <span className="border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                          ✕ não preciso
                        </span>
                      )}
                      {st.mode === "picked" && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-primary">
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
                                className="border border-border px-2 py-1 text-xs text-foreground/85"
                              >
                                {tool.brand} {tool.model}
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
              <Button size="lg" className="rounded-none" asChild>
                {/* maker/mksel são aceites no validateSearch da rota /b2b; o
                    routeTree.gen ainda não refletem os novos params */}
                <Link to="/b2b" search={b2bSearch as never}>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar o meu kit ao B2B
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-none" onClick={reset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Recomeçar
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
        {/* progresso */}
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              passo {progress}/{KIT_MAKER_STEPS.length} · {name.trim()}
            </p>
            <div className="flex flex-wrap gap-1.5" aria-hidden>
              {KIT_MAKER_STEPS.map((s, i) => (
                <span
                  key={s.id}
                  className={cn(
                    "h-1.5 w-8",
                    i < stepIndex ? "bg-primary" : i === stepIndex ? "bg-primary/50" : "bg-border",
                  )}
                />
              ))}
            </div>
          </div>
          <div
            className="mt-3 h-0.5 w-full bg-border"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={KIT_MAKER_STEPS.length}
          >
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(progress / KIT_MAKER_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* cartão do passo */}
        <div key={step.id} className="mx-auto mt-8 max-w-4xl border border-border bg-card">
          <div className="border-b border-border p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">
                {step.topicPt}
              </h3>
              <p className="jp-label text-primary">{step.jp}</p>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.questionPt}</p>
            {step.notePt && (
              <p className="mt-2 text-xs leading-5 text-muted-foreground/80">{step.notePt}</p>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {step.branches && (
              <div
                role="tablist"
                aria-label={`${step.topicPt}: escolhe o ramo`}
                className="flex flex-wrap gap-1.5"
              >
                {step.branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    role="tab"
                    aria-selected={branch?.id === b.id}
                    onClick={() => setBranchByStep((prev) => ({ ...prev, [step.id]: b.id }))}
                    className={cn(
                      "border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] transition-colors duration-200",
                      FOCUS_RING,
                      branch?.id === b.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    {b.labelPt}
                  </button>
                ))}
              </div>
            )}

            <div
              className={cn(
                "grid gap-2",
                step.branches
                  ? "mt-4 grid-cols-2 sm:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
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

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => markSkip(step.id, "owned")}
                aria-pressed={st.mode === "owned"}
                className={cn(
                  "inline-flex items-center gap-1.5 border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] transition-colors duration-200",
                  FOCUS_RING,
                  st.mode === "owned"
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                <Check className="h-3.5 w-3.5" aria-hidden />
                já tenho
              </button>
              <button
                type="button"
                onClick={() => markSkip(step.id, "notneeded")}
                aria-pressed={st.mode === "notneeded"}
                className={cn(
                  "inline-flex items-center gap-1.5 border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] transition-colors duration-200",
                  FOCUS_RING,
                  st.mode === "notneeded"
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                não preciso
              </button>
            </div>
          </div>
        </div>

        {/* navegação */}
        <div className="mx-auto mt-6 flex max-w-4xl items-center justify-between">
          <Button
            variant="outline"
            className="rounded-none"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button
            className="rounded-none"
            onClick={() => setStepIndex((i) => Math.min(KIT_MAKER_STEPS.length, i + 1))}
          >
            {stepIndex === KIT_MAKER_STEPS.length - 1 ? "Ver o meu kit" : "Próximo"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
