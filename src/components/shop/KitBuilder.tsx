import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Send } from "lucide-react";
import { referenceById, type CuratedToolReference } from "@/data/curated-tool-references";
import { MODULAR_PACKS, type ModularPack, type ModularSlot } from "@/data/modular-packs";
import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import { ToolSymbols } from "@/components/shop/ToolSymbols";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SlotSelections = Record<string, string | null>;
type SlotOwned = Record<string, boolean>;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Padrão partilhado das sub-tabs (grupos groupPt e tabs de pack): maiores
 *  (≥44px de toque), com régua por baixo e a ativa plenamente dourada — lê-se
 *  como "aba" ao primeiro olhar, nunca como card. Mesmo padrão do KitMaker;
 *  o contentor usa .tab-rail para scroll horizontal em mobile. */
const SUB_TAB_BASE =
  "-mb-px min-h-11 shrink-0 whitespace-nowrap border border-transparent border-b-2 px-4 py-2.5 mono-caps transition-all duration-200 sm:px-5";
const SUB_TAB_ACTIVE =
  "border-primary bg-primary font-semibold text-[#1b1917] shadow-[0_10px_28px_rgba(212,165,63,0.30)]";
const SUB_TAB_INACTIVE = "text-foreground/70 hover:border-primary/50 hover:text-foreground";

/** Tabs de pack (nível acima das sub-tabs): ainda mais presença. */
const PACK_TAB_BASE =
  "-mb-px min-h-11 shrink-0 whitespace-nowrap border border-transparent border-b-2 px-4 py-3 mono-caps transition-all duration-200 sm:px-6";
const PACK_TAB_ACTIVE =
  "border-primary bg-primary font-semibold text-[#1b1917] shadow-[0_12px_32px_rgba(212,165,63,0.30)]";
const PACK_TAB_INACTIVE = "text-foreground/70 hover:border-primary/50 hover:text-foreground";

/** Mudanças de tab nunca mexem no scroll: captura a posição, corre a mutação
 *  e repõe no frame seguinte — sem salto para o topo nem reancoragem. */
const preserveScroll = (fn: () => void) => {
  const y = window.scrollY;
  fn();
  requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "auto" }));
};

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
          ? "border-primary bg-primary/10 shadow-[0_10px_28px_rgba(212,165,63,0.18)]"
          : "border-border bg-card enabled:hover:scale-[1.02] enabled:hover:border-primary enabled:hover:shadow-[0_12px_30px_rgba(212,165,63,0.14)]",
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
        <span className="mt-0.5 block truncate mono-caps text-muted-foreground">{tool.namePt}</span>
      </span>
      {selected && (
        <Check
          aria-hidden
          className="ml-auto h-4 w-4 shrink-0 animate-in zoom-in-50 fill-mode-both text-primary duration-200"
          strokeWidth={3}
        />
      )}
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
        "kit-option-card group relative flex min-w-40 flex-col border p-3 text-left transition-all duration-200",
        FOCUS_RING,
        selected
          ? "border-primary bg-primary/10 shadow-[0_14px_36px_rgba(212,165,63,0.22)]"
          : "border-border bg-card enabled:hover:scale-[1.02] enabled:hover:border-primary enabled:hover:shadow-[0_16px_40px_rgba(212,165,63,0.16)]",
        owned && "cursor-not-allowed opacity-40",
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
            "inline-flex min-h-11 items-center gap-2 border px-5 mono-caps transition-all duration-200",
            FOCUS_RING,
            owned
              ? "border-primary bg-primary/15 text-foreground shadow-[0_8px_24px_rgba(212,165,63,0.16)]"
              : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground",
          )}
        >
          <span
            className={cn(
              "flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-colors duration-200",
              owned ? "border-primary bg-primary text-[#1b1917]" : "border-current",
            )}
          >
            <Check aria-hidden className="h-2.5 w-2.5" strokeWidth={4} />
          </span>
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
          className="tab-rail -mx-1 mt-4 flex items-end gap-1.5 overflow-x-auto border-b border-border px-1"
        >
          {groups.map((group) => (
            <button
              key={group}
              type="button"
              role="tab"
              aria-selected={group === activeGroup}
              onClick={() => preserveScroll(() => setActiveGroup(group))}
              className={cn(
                SUB_TAB_BASE,
                FOCUS_RING,
                group === activeGroup ? SUB_TAB_ACTIVE : SUB_TAB_INACTIVE,
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
          className="mt-3 grid grid-cols-1 gap-2 min-[480px]:grid-cols-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4"
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
          <span className="mono-caps text-primary">Declarado · </span>
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
          <h2 className="mt-4 text-display-1">
            Monta o teu:{" "}
            <span className="text-primary">escolhe a chave, o lock, as ponteiras.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-body text-muted-foreground">
            Um roquete com porta-bits e sockets chega ao canto onde era preciso uma chave de curto —
            e a chave de curto não existe aqui. Somos mais inteligentes que múltiplas ferramentas:
            cada bloco escolhe-se à marca, e o que já tens, declara-se.
          </p>
        </div>

        <div
          className="tab-rail -mx-4 mt-8 flex items-end gap-1.5 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:px-0"
          role="group"
          aria-label="Packs modulares"
        >
          {MODULAR_PACKS.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              aria-pressed={candidate.id === pack.id}
              onClick={() => preserveScroll(() => switchPack(candidate.id))}
              className={cn(
                PACK_TAB_BASE,
                FOCUS_RING,
                candidate.id === pack.id ? PACK_TAB_ACTIVE : PACK_TAB_INACTIVE,
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
              onSelect={(refId) =>
                setSelections((prev) => ({
                  ...prev,
                  // clicar de novo na opção selecionada deseleciona
                  [slot.id]: prev[slot.id] === refId ? null : refId,
                }))
              }
              onToggleOwned={() => setOwned((prev) => ({ ...prev, [slot.id]: !prev[slot.id] }))}
            />
          ))}
        </ul>

        <div className="mt-8 border border-primary/30 bg-card shadow-[0_24px_64px_rgba(212,165,63,0.08)]">
          <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
            <div>
              <p className="mono-caps text-muted-foreground">A fórmula do pack</p>
              <p className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-0.04em] sm:text-4xl">
                {pack.formulaPartsPt.join(" + ")} ={" "}
                <span
                  className="text-6xl text-primary drop-shadow-[0_0_18px_rgba(212,165,63,0.35)] sm:text-7xl"
                  role="img"
                  aria-label="a definir no pedido B2B"
                >
                  ?
                </span>
              </p>
              <p className="mono-caps mt-3 text-muted-foreground">
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
              <Button
                className="rounded-none px-7 font-semibold shadow-[0_14px_36px_rgba(212,165,63,0.25)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(212,165,63,0.38)]"
                asChild
              >
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
                  Pedir no B2B · com a composição
                  <ArrowRight className="ml-2 h-4 w-4" />
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
              <span className="mono-caps text-foreground">Limitações: </span>
              {pack.limitationsPt}
            </p>
            {pack.pairsWithPt && (
              <p className="border-l-2 border-primary/40 pl-3 text-xs leading-5 text-muted-foreground">
                <span className="mono-caps text-foreground">Pares com: </span>
                {pack.pairsWithPt}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
