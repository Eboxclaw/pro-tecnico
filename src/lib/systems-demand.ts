import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { RejendariSystem, ReserveProfession } from "@/data/systems";

/**
 * Motor de procura dos systems: likes (anónimo, um por visitante),
 * favoritos e reservas (com conta). Tudo degrada gracefully quando o
 * Supabase não está configurado — a loja continua navegável.
 */

const VISITOR_KEY = "rejendari:visitor-id";
const LIKED_KEY = "rejendari:liked-systems";

export function visitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function likedSystemIds(): string[] {
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function markLiked(systemId: string) {
  const ids = likedSystemIds();
  if (!ids.includes(systemId)) {
    localStorage.setItem(LIKED_KEY, JSON.stringify([...ids, systemId]));
  }
  window.dispatchEvent(new Event("rejendari:likes-changed"));
}

export type SystemDemand = {
  likes: number;
  favorites: number;
  reservations: number;
  units: number;
};

/** Contagens reais por system_id — vazias quando o serviço não está configurado. */
export function useSystemDemand() {
  return useQuery({
    queryKey: ["systems-demand"],
    queryFn: async (): Promise<Record<string, SystemDemand>> => {
      if (!isSupabaseConfigured()) return {};
      const { data, error } = await supabase.rpc("system_demand_counts");
      if (error || !data) return {};
      const map: Record<string, SystemDemand> = {};
      for (const row of data) {
        map[row.system_id] = {
          likes: Number(row.like_count ?? 0),
          favorites: Number(row.favorite_count ?? 0),
          reservations: Number(row.reservation_count ?? 0),
          units: Number(row.unit_count ?? 0),
        };
      }
      return map;
    },
    staleTime: 15_000,
  });
}

/** Procura combinada de um system: seed editorial + interações reais. */
export function mergedDemand(system: RejendariSystem, real?: SystemDemand) {
  return {
    likes: system.seedDemand.likes + (real?.likes ?? 0),
    favorites: system.seedDemand.favorites + (real?.favorites ?? 0),
    reservations: system.seedDemand.reservations + (real?.reservations ?? 0),
    units: system.seedDemand.units + (real?.units ?? 0),
  };
}

/** IDs de systems que este visitante já gostou — fonte do estado do ♡. */
export function useLikedSystems() {
  const [likedIds, setLikedIds] = useState<string[]>(() => likedSystemIds());

  useEffect(() => {
    const sync = () => setLikedIds(likedSystemIds());
    window.addEventListener("rejendari:likes-changed", sync);
    return () => window.removeEventListener("rejendari:likes-changed", sync);
  }, []);

  const like = useCallback(
    (system: RejendariSystem) => {
      if (likedIds.includes(system.id)) return;
      markLiked(system.id);
      setLikedIds(likedSystemIds());
      if (isSupabaseConfigured()) {
        void supabase
          .from("system_likes")
          .upsert({ system_id: system.id, visitor_id: visitorId() })
          .then(() => {
            // a contagem refresca na próxima visitas; otimista aqui é suficiente
          });
      }
    },
    [likedIds],
  );

  return { likedIds, like };
}

export function useMyFavorites() {
  return useQuery({
    queryKey: ["my-system-favorites"],
    queryFn: async (): Promise<string[]> => {
      if (!isSupabaseConfigured()) return [];
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];
      const { data, error } = await supabase
        .from("system_favorites")
        .select("system_id")
        .eq("user_id", userData.user.id);
      if (error) return [];
      return (data ?? []).map((row) => row.system_id);
    },
    staleTime: 10_000,
  });
}

/** Alterna ★. Visitante sem conta é convidado a entrar — o chamador trata do redirect. */
export function useFavoriteToggle(
  system: RejendariSystem,
  opts: { onAuthRequired?: () => void } = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<boolean> => {
      if (!isSupabaseConfigured()) throw new Error("Serviço de conta indisponível.");
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        opts.onAuthRequired?.();
        return false;
      }
      const uid = userData.user.id;
      const { data: existing } = await supabase
        .from("system_favorites")
        .select("id")
        .eq("system_id", system.id)
        .eq("user_id", uid)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase.from("system_favorites").delete().eq("id", existing.id);
        if (error) throw error;
        return false;
      }
      const { error } = await supabase
        .from("system_favorites")
        .insert({ system_id: system.id, user_id: uid });
      if (error) throw error;
      return true;
    },
    onSuccess: (added) => {
      void queryClient.invalidateQueries({ queryKey: ["my-system-favorites"] });
      void queryClient.invalidateQueries({ queryKey: ["systems-demand"] });
      toast.success(
        added
          ? `★ ${system.name} guardado. Acompanha o estado na tua conta.`
          : `★ ${system.name} removido dos favoritos.`,
      );
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível guardar o favorito."),
  });
}

export type MyReservation = {
  system_id: string;
  quantity: number;
  profession: string | null;
  status: string;
  created_at: string;
};

export function useMyReservations() {
  return useQuery({
    queryKey: ["my-system-reservations"],
    queryFn: async (): Promise<MyReservation[]> => {
      if (!isSupabaseConfigured()) return [];
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];
      const { data, error } = await supabase
        .from("system_reservations")
        .select("system_id,quantity,profession,status,created_at")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });
      if (error) return [];
      return data ?? [];
    },
    staleTime: 10_000,
  });
}

export type ReserveInput = {
  quantity: number;
  profession?: ReserveProfession | null;
};

/** Cria ou atualiza a reserva (uma por system por utilizador). €0, sem pagamento. */
export function useReserveSystem(
  system: RejendariSystem,
  opts: { onAuthRequired?: () => void } = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quantity, profession }: ReserveInput): Promise<boolean> => {
      if (!isSupabaseConfigured()) throw new Error("Serviço de conta indisponível.");
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        opts.onAuthRequired?.();
        return false;
      }
      const uid = userData.user.id;
      const { error } = await supabase.from("system_reservations").upsert(
        {
          system_id: system.id,
          user_id: uid,
          quantity,
          profession: profession ?? null,
          status: "active",
        },
        { onConflict: "system_id,user_id" },
      );
      if (error) throw error;
      return true;
    },
    onSuccess: (reserved) => {
      if (!reserved) return;
      void queryClient.invalidateQueries({ queryKey: ["my-system-reservations"] });
      void queryClient.invalidateQueries({ queryKey: ["systems-demand"] });
      toast.success(
        `Reserva registada — ${system.name}. €0 agora; preço final confirmado antes de qualquer pagamento.`,
      );
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível registar a reserva."),
  });
}

/** Utilizador autenticado (ou null) — para decidir entre ação e redirect para /auth. */
export async function currentUserOrNull() {
  if (!isSupabaseConfigured()) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
