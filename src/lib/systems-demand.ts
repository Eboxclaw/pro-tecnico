import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { RejendariSystem, ReserveProfession } from "@/data/systems";

/**
 * Motor de procura dos systems: likes, favoritos e reservas — todos exigem
 * conta. Os contadores mostram apenas procura real: se ainda não há dados,
 * o site diz "sê o primeiro" em vez de mostrar números inflados.
 * Tudo degrada gracefully quando o Supabase não está configurado.
 */

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

/** Contadores exibidos: só procura real de utilizadores. Nunca inflados. */
export function mergedDemand(system: RejendariSystem, real?: SystemDemand) {
  void system;
  return {
    likes: real?.likes ?? 0,
    favorites: real?.favorites ?? 0,
    reservations: real?.reservations ?? 0,
    units: real?.units ?? 0,
  };
}

export function useMyLikes() {
  return useQuery({
    queryKey: ["my-system-likes"],
    queryFn: async (): Promise<string[]> => {
      if (!isSupabaseConfigured()) return [];
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];
      const { data, error } = await supabase
        .from("system_likes")
        .select("system_id")
        .eq("user_id", userData.user.id);
      if (error) return [];
      return (data ?? []).map((row) => row.system_id);
    },
    staleTime: 10_000,
  });
}

/** Regista o like do utilizador autenticado (RPC com máx. diário por conta). */
export async function likeSystemAuthenticated(
  systemId: string,
): Promise<{ ok: boolean; needsAuth: boolean }> {
  if (!isSupabaseConfigured()) throw new Error("Serviço de conta indisponível.");
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, needsAuth: true };
  const { data, error } = await supabase.rpc("like_system", { p_system_id: systemId });
  if (error) throw error;
  return { ok: data === true, needsAuth: false };
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
  fair_price: number | null;
  reason: string | null;
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
        .select("system_id,quantity,fair_price,reason,profession,status,created_at")
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
  fairPrice?: number | null;
  reason?: string | null;
  profession?: ReserveProfession | null;
  region?: string | null;
  postalCode?: string | null;
};

/** Cria ou atualiza a reserva (uma por system por utilizador). €0, sem pagamento. */
export function useReserveSystem(
  system: RejendariSystem,
  opts: { onAuthRequired?: () => void } = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quantity,
      fairPrice,
      reason,
      profession,
      region,
      postalCode,
    }: ReserveInput): Promise<boolean> => {
      if (!isSupabaseConfigured()) throw new Error("Serviço de conta indisponível.");
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        opts.onAuthRequired?.();
        return false;
      }
      const uid = userData.user.id;

      // identificação opcional: região e código postal ficam no perfil
      if (region?.trim() || postalCode?.trim()) {
        await supabase
          .from("profiles")
          .update({
            region: region?.trim() || null,
            postal_code: postalCode?.trim() || null,
          })
          .eq("id", uid);
      }

      const { error } = await supabase.from("system_reservations").upsert(
        {
          system_id: system.id,
          user_id: uid,
          quantity,
          fair_price: fairPrice ?? null,
          reason: reason?.trim() || null,
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
      void queryClient.invalidateQueries({ queryKey: ["account"] });
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
