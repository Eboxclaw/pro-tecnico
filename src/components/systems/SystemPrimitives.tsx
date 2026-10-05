import { useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Heart, Lock, Star } from "lucide-react";
import { toast } from "sonner";
import {
  SYSTEM_STATUS_LABEL,
  RESERVE_PROFESSIONS,
  isReservable,
  targetPriceLabel,
  type RejendariSystem,
} from "@/data/systems";
import {
  mergedDemand,
  useFavoriteToggle,
  useLikedSystems,
  useMyFavorites,
  useReserveSystem,
  useSystemDemand,
} from "@/lib/systems-demand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Estado do system, EN como marca (RESERVING, LAB…), estilo mono industrial. */
export function SystemStatusBadge({
  status,
  className,
}: {
  status: RejendariSystem["status"];
  className?: string;
}) {
  const styles: Record<RejendariSystem["status"], string> = {
    available: "bg-[#1b1917] text-white",
    reserving: "bg-primary text-white",
    negotiating: "bg-black/12 text-foreground",
    lab: "border border-dashed border-border text-muted-foreground",
    sold_through: "bg-black/12 text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em]",
        styles[status],
        className,
      )}
    >
      <span className="inline-block h-1.5 w-1.5 bg-current" aria-hidden="true" />
      {SYSTEM_STATUS_LABEL[status]}
    </span>
  );
}

/** Barra de procura (MOQ): procura registada vs. unidades necessárias. */
export function DemandProgress({
  units,
  moq,
  dark = false,
  className,
}: {
  units: number;
  moq: number;
  dark?: boolean;
  className?: string;
}) {
  const pct = Math.min(100, Math.round((units / Math.max(moq, 1)) * 100));
  const remaining = Math.max(0, moq - units);
  return (
    <div className={className}>
      <div className={cn("h-[3px] w-full", dark ? "bg-white/15" : "bg-border")}>
        <div
          className={cn(
            "h-full transition-[width] duration-700",
            dropUnlockedSafe(units, moq) ? "bg-[#dfbba4]" : "bg-primary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p
        className={cn(
          "mt-2 font-mono text-[9px] uppercase tracking-[0.14em]",
          dark ? "text-white/55" : "text-muted-foreground",
        )}
      >
        {units} / {moq} unidades
        {remaining > 0 ? ` · faltam ${remaining} para desbloquear` : " · procura atingida"}
      </p>
    </div>
  );
}

function dropUnlockedSafe(units: number, moq: number) {
  return moq > 0 && units >= moq;
}

/** Selo IMPACT READY, só usado quando a compatibilidade está documentada. */
export function ImpactReadySeal({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em]",
        dark ? "border-[#dfbba4]/50 text-[#dfbba4]" : "border-primary/35 text-primary",
      )}
    >
      IMPACT READY
    </span>
  );
}

function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  return () => {
    void navigate({ to: "/auth", search: { redirect: location.href } });
  };
}

/** ♡ like (anónimo, um por visitante) · ★ favorito (requer conta). */
export function LikeFavoriteButtons({
  system,
  dark = false,
  className,
}: {
  system: RejendariSystem;
  dark?: boolean;
  className?: string;
}) {
  const { likedIds, like } = useLikedSystems();
  const { data: favorites = [] } = useMyFavorites();
  const { data: demandBySystem } = useSystemDemand();
  const demand = mergedDemand(system, demandBySystem?.[system.id]);
  const favorite = useFavoriteToggle(system, { onAuthRequired: useAuthRedirect() });
  const liked = likedIds.includes(system.id);
  const favorited = favorites.includes(system.id);

  const base = dark
    ? "border-white/20 text-white/70 hover:border-white/45 hover:text-white"
    : "border-border text-muted-foreground hover:border-primary/45 hover:text-primary";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => (liked ? toast.info("Já mostraste interesse neste system.") : like(system))}
        aria-pressed={liked}
        className={cn(
          "inline-flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
          base,
          liked && (dark ? "border-[#dfbba4]/60 text-[#dfbba4]" : "border-primary/50 text-primary"),
        )}
        title="Gosto desta ideia"
      >
        <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
        {demand.likes}
      </button>
      <button
        type="button"
        onClick={() => favorite.mutate()}
        disabled={favorite.isPending}
        aria-pressed={favorited}
        className={cn(
          "inline-flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
          base,
          favorited &&
            (dark ? "border-[#dfbba4]/60 text-[#dfbba4]" : "border-primary/50 text-primary"),
        )}
        title="Guardar e acompanhar (requer conta)"
      >
        <Star className={cn("h-3.5 w-3.5", favorited && "fill-current")} />
        {demand.favorites}
      </button>
    </div>
  );
}

const QUANTITY_OPTIONS = [1, 2, 3, 5];

/** Diálogo de reserva: quantidade pretendida + profissão opcional. €0, sem pagamento. */
export function ReserveDialog({
  system,
  open,
  onOpenChange,
}: {
  system: RejendariSystem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [quantity, setQuantity] = useState<number>(1);
  const [customQuantity, setCustomQuantity] = useState("");
  const [profession, setProfession] = useState<ReserveProfessionLogic>("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const reserve = useReserveSystem(system, { onAuthRequired: useAuthRedirect() });
  const price = targetPriceLabel(system);

  const resolvedQuantity = () => {
    const parsed = Number.parseInt(customQuantity, 10);
    if (!Number.isNaN(parsed) && parsed > 5) return Math.min(parsed, 50);
    return quantity;
  };

  const submit = () => {
    reserve.mutate(
      {
        quantity: resolvedQuantity(),
        profession: profession || null,
        region: region.trim() || null,
        postalCode: postalCode.trim() || null,
      },
      {
        onSuccess: (reserved) => {
          if (reserved) onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-none border-border bg-card p-0">
        <div className="border-b border-border p-6">
          <p className="jp-label text-primary">予約 · reservar sem pagar</p>
          <DialogHeader className="mt-3 space-y-0 text-left">
            <DialogTitle className="font-display text-2xl font-semibold tracking-[-0.04em]">
              {system.name}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
              Reserva gratuita, €0 agora, sem cartão. Preço final confirmado antes de qualquer
              pagamento. Quando o drop atingir a procura necessária, tens prioridade durante 48
              horas.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
              Quantas unidades comprarias?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUANTITY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setQuantity(option);
                    setCustomQuantity("");
                  }}
                  className={cn(
                    "border px-4 py-2 font-mono text-sm transition-colors",
                    !customQuantity && quantity === option
                      ? "border-primary bg-primary text-white"
                      : "border-border text-foreground hover:border-primary/50",
                  )}
                >
                  {option}
                </button>
              ))}
              <input
                type="number"
                inputMode="numeric"
                min={5}
                max={50}
                value={customQuantity}
                onChange={(event) => setCustomQuantity(event.target.value)}
                placeholder="5+"
                aria-label="Quantidade superior a 5"
                className="w-24 rounded-none border border-border bg-background px-3 py-2 font-mono text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              Unidades por reserva: 1-50. Este número vale mais do que um clique, orienta a
              negociação com o fabricante.
            </p>
          </div>

          <div>
            <label
              htmlFor="reserve-profession"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground"
            >
              Profissão <span className="text-muted-foreground">(opcional)</span>
            </label>
            <select
              id="reserve-profession"
              value={profession}
              onChange={(event) => setProfession(event.target.value as ReserveProfessionLogic)}
              className="mt-2 w-full rounded-none border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Prefiro não dizer</option>
              {RESERVE_PROFESSIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label
                htmlFor="reserve-region"
                className="font-mono text-[10px] uppercase tracking-[0.14em]"
              >
                Região <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="reserve-region"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                maxLength={60}
                placeholder="ex.: Porto"
                className="mt-2 rounded-none bg-background"
              />
            </div>
            <div>
              <Label
                htmlFor="reserve-postal"
                className="font-mono text-[10px] uppercase tracking-[0.14em]"
              >
                Código postal <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="reserve-postal"
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                maxLength={12}
                placeholder="0000-000"
                className="mt-2 rounded-none bg-background"
              />
            </div>
          </div>
          <p className="font-mono text-[9px] uppercase leading-4 tracking-[0.12em] text-muted-foreground">
            Região e código postal servem só para estimar procura por zona. NIF e dados de faturação
            ficam para o pagamento, tratados pelo provider.
          </p>

          {price && (
            <p className="border border-border bg-background px-4 py-3 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">
              Target price {price} · final price confirmed before payment
            </p>
          )}

          <Button
            type="button"
            onClick={submit}
            disabled={reserve.isPending}
            className="w-full rounded-none bg-black text-white hover:bg-black/85"
            size="lg"
          >
            <Lock className="mr-2 h-4 w-4" />
            {reserve.isPending ? "A registar…" : "Confirmar reserva, €0"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ReserveProfessionLogic = (typeof RESERVE_PROFESSIONS)[number] | "";

/** CTA de reserva, abre o diálogo; desativado com explicação fora dos estados reserváveis. */
export function ReserveButton({
  system,
  dark = false,
  className,
  size = "default",
}: {
  system: RejendariSystem;
  dark?: boolean;
  className?: string;
  size?: "default" | "lg" | "sm";
}) {
  const [open, setOpen] = useState(false);

  if (!isReservable(system)) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={cn(
          "rounded-none",
          dark && "border-white/25 bg-transparent text-white/60 hover:bg-transparent",
          className,
        )}
      >
        {system.status === "lab" ? "Em estudo, sem reserva" : "Reservas fechadas"}
      </Button>
    );
  }

  return (
    <>
      <Button
        size={size}
        onClick={() => setOpen(true)}
        className={cn(
          "rounded-none",
          dark
            ? "bg-white text-[#1b1917] hover:bg-[#dfbba4]"
            : "bg-black text-white hover:bg-black/85",
          className,
        )}
      >
        Reservar sem pagar
      </Button>
      <ReserveDialog system={system} open={open} onOpenChange={setOpen} />
    </>
  );
}
