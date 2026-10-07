import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Send } from "lucide-react";
import { referenceById, type CuratedToolReference } from "@/data/curated-tool-references";
import { MODULAR_PACKS, type ModularPack, type ModularSlot } from "@/data/modular-packs";
import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SlotSelections = Record<string, string | null>;
type SlotOwned = Record<string, boolean>;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Opção de um slot: prato 48px + marca/modelo. Botão real com aria-pressed. */
function SlotOptionChip({
  tool,
  selected,
  owned,
  onSelect,
}: {
  tool: CuratedToolReference;
  selected: boolean;
  owned: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      disabled={owned}
      className={cn(
        "group flex items-center gap-3 border py-2 pl-2 pr-4 text-left transition-all duration-200",
        FOCUS_RING,
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_12px_30px_rgba(42,36,29,0.35)]",
        owned && "cursor-not-allowed opacity-40",
      )}
    >
      <span className="product-plate block h-12 w-12 shrink-0 overflow-hidden border border-border">
        {tool.imageUrl ? (
          <ProductImage
            src={tool.imageUrl}
            alt={tool.imageAlt ?? tool.namePt}
            className="h-full w-full object-contain p-1"
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
        <span className="block truncate text-sm font-medium leading-tight">
          {tool.brand} {tool.model}
        </span>
        <span className="mt-0.5 block truncate font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
          {tool.namePt}
        </span>
      </span>
    </button>
  );
}

/** Card de opção: foto em prato + marca/modelo + nome — para slots com sub-tabs. */
function SlotOptionCard({
  tool,
  selected,
  owned,
  onSelect,
}: {
  tool: CuratedToolReference;
  selected: boolean;
  owned: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      disabled={owned}
      className={cn(
        "group flex min-w-40 flex-col border p-3 text-left transition-all duration-200",
        FOCUS_RING,
        selected
          ? "border-primary bg-primary/10 shadow-[0_12px_30px_rgba(212,165,63,0.14)]"
          : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_12px_30px_rgba(42,36,29,0.35)]",
        owned && "cursor-not-allowed opacity-40",
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
    </button>
  );
}

/** Um slot do pack: papel + jp + nota, toggle "já tenho" e as opções da casa.
 *  Slots com grupos (groupPt) renderizam sub-tabs; o grupo ativo mostra cards. */
function ModularSlotRow({
  slot,
  index,
  selectedRefId,
  owned,
  onSelect,
  onToggleOwned,
}: {
  slot: ModularSlot;
  index: number;
  selectedRefId: string | null;
  owned: boolean;
  onSelect: (refId: string) => void;
  onToggleOwned: () => void;
}) {
  const options = slot.options.flatMap((option) => {
    const tool = referenceById(option.refId);
    return tool ? [{ tool, groupPt: option.groupPt }] : [];
  });
  const groups = [...new Set(options.map(({ groupPt }) => groupPt ?? ""))].filter(Boolean);
  const [activeGroup, setActiveGroup] = useState<string>(groups[0] ?? "");
  const visible =
    groups.length > 0 ? options.filter(({ groupPt }) => groupPt === activeGroup) : options;

  return (
    <li
      className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both border border-border bg-card p-5 duration-500"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-[-0.03em]">
            {slot.rolePt}
          </h3>
          <p className="jp-label text-primary">{slot.jp}</p>
        </div>
        <button
          type="button"
          onClick={onToggleOwned}
          aria-pressed={owned}
          className={cn(
            "inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.13em] transition-colors duration-200",
            FOCUS_RING,
            owned
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground",
          )}
        >
          <Check aria-hidden className="h-3 w-3" />
          já tenho
        </button>
      </div>

      {slot.notePt && (
        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{slot.notePt}</p>
      )}

      {groups.length > 0 && (
        <div
          role="tablist"
          aria-label={`${slot.rolePt}: sub-tabs`}
          className="mt-4 flex flex-wrap gap-1.5"
        >
          {groups.map((group) => (
            <button
              key={group}
              type="button"
              role="tab"
              aria-selected={group === activeGroup}
              onClick={() => setActiveGroup(group)}
              className={cn(
                "border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.13em] transition-colors duration-200",
                FOCUS_RING,
                group === activeGroup
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {group}
            </button>
          ))}
        </div>
      )}

      {groups.length > 0 ? (
        <div
          role="tabpanel"
          aria-label={activeGroup}
          className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
        >
          {visible.map(({ tool }) => (
            <SlotOptionCard
              key={tool.id}
              tool={tool}
              selected={selectedRefId === tool.id}
              owned={owned}
              onSelect={() => onSelect(tool.id)}
            />
          ))}
        </div>
      ) : (
        <div
          role="group"
          aria-label={`${slot.rolePt}: opções`}
          className="mt-4 flex flex-wrap gap-2"
        >
          {visible.map(({ tool }) => (
            <SlotOptionChip
              key={tool.id}
              tool={tool}
              selected={selectedRefId === tool.id}
              owned={owned}
              onSelect={() => onSelect(tool.id)}
            />
          ))}
        </div>
      )}

      {owned && (
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-primary">
            Declarado ·{" "}
          </span>
          já tens esta peça: o slot conta como satisfeito e as opções ficam em pausa.
        </p>
      )}
    </li>
  );
}

/**
 * Packs modulares configuráveis: 1 opção por slot, da marca, ou "já tenho" declarado.
 * Sem preços — a fórmula termina em "?" e a composição segue para o B2B.
 */
export function KitBuilder() {
  const [activePackId, setActivePackId] = useState<string>(MODULAR_PACKS[0]?.id ?? "");
  const [selections, setSelections] = useState<SlotSelections>({});
  const [owned, setOwned] = useState<SlotOwned>({});

  const pack: ModularPack | undefined =
    MODULAR_PACKS.find((candidate) => candidate.id === activePackId) ?? MODULAR_PACKS[0];

  if (!pack) return null;

  const ownedCount = pack.slots.filter((slot) => owned[slot.id]).length;
  const pickedCount = pack.slots.filter((slot) => selections[slot.id] && !owned[slot.id]).length;
  const satisfied = pickedCount + ownedCount;
  const remaining = pack.slots.length - satisfied;

  const switchPack = (id: string) => {
    if (id === activePackId) return;
    setActivePackId(id);
    setSelections({});
    setOwned({});
  };

  return (
    <section className="border-b border-border bg-surface/45">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
        <div className="max-w-3xl">
          <p className="jp-label text-primary">モジュラー · packs modulares</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-5xl">
            Monta o teu:{" "}
            <span className="text-primary">escolhe a chave, o lock, as ponteiras.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            Um roquete com porta-bits e sockets chega ao canto onde era preciso uma chave de curto —
            e a chave de curto não existe aqui. Somos mais inteligentes que múltiplas ferramentas:
            cada bloco escolhe-se à marca, e o que já tens, declara-se.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Packs modulares">
          {MODULAR_PACKS.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              aria-pressed={candidate.id === pack.id}
              onClick={() => switchPack(candidate.id)}
              className={cn(
                "border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] transition-colors duration-200",
                FOCUS_RING,
                candidate.id === pack.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {candidate.trade}
            </button>
          ))}
        </div>

        <p className="mt-5 max-w-2xl border-l-2 border-primary/40 pl-4 text-sm leading-6 text-muted-foreground">
          {pack.conceptPt}
        </p>

        <ul key={pack.id} className="mt-6 grid gap-3 lg:grid-cols-2">
          {pack.slots.map((slot, index) => (
            <ModularSlotRow
              key={slot.id}
              slot={slot}
              index={index}
              selectedRefId={selections[slot.id] ?? null}
              owned={owned[slot.id] ?? false}
              onSelect={(refId) => setSelections((prev) => ({ ...prev, [slot.id]: refId }))}
              onToggleOwned={() => setOwned((prev) => ({ ...prev, [slot.id]: !prev[slot.id] }))}
            />
          ))}
        </ul>

        <div className="mt-8 border border-primary/30 bg-card">
          <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                A fórmula do pack
              </p>
              <p className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-0.04em] sm:text-4xl">
                {pack.formulaPartsPt.join(" + ")} ={" "}
                <span className="text-primary" role="img" aria-label="a definir no pedido B2B">
                  ?
                </span>
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
                <span className="text-foreground">
                  {satisfied}/{pack.slots.length}
                </span>{" "}
                escolhidos
                {ownedCount > 0 && (
                  <>
                    {" · "}
                    <span className="text-primary">{ownedCount} já tens</span>
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Button className="rounded-none" asChild>
                <Link
                  to="/b2b"
                  search={{
                    mod: pack.id,
                    sel:
                      Object.entries(selections)
                        .filter(([, refId]) => refId)
                        .map(([slotId, refId]) => `${slotId}:${refId}`)
                        .join(",") || undefined,
                    owned:
                      Object.keys(owned)
                        .filter((slotId) => owned[slotId])
                        .join(",") || undefined,
                  }}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Enviar composição ao B2B
                </Link>
              </Button>
              <p className="text-xs leading-5 text-muted-foreground">
                {remaining > 0
                  ? `${remaining} ${remaining === 1 ? "slot" : "slots"} por escolher ou declarar — envia na mesma, completamos no B2B.`
                  : "Composição completa — a mensagem chega ao B2B com estes blocos."}
              </p>
            </div>
          </div>

          <div className="space-y-3 border-t border-border px-6 py-4 lg:px-8">
            <p className="border-l-2 border-primary/40 pl-3 text-xs leading-5 text-muted-foreground">
              <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-foreground">
                Limitações:{" "}
              </span>
              {pack.limitationsPt}
            </p>
            {pack.pairsWithPt && (
              <p className="border-l-2 border-primary/40 pl-3 text-xs leading-5 text-muted-foreground">
                <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-foreground">
                  Pares com:{" "}
                </span>
                {pack.pairsWithPt}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
