import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export interface PublicRaffle {
  id: string;
  title: string;
  prize: string;
  prize_brand: string | null;
  status: string;
  week_start: string;
  winner_label: string | null;
  drawn_at: string | null;
}

const supabasePublic = createClient(
  process.env["SUPABASE_URL"]!,
  process.env["SUPABASE_PUBLISHABLE_KEY"]!,
  { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
);

export const getPublicRaffles = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ open: PublicRaffle | null; winners: PublicRaffle[] }> => {
    const { data: open } = await supabasePublic
      .from("raffles")
      .select("id,title,prize,prize_brand,status,week_start,winner_label,drawn_at")
      .eq("status", "open")
      .order("week_start", { ascending: false })
      .limit(1);

    const { data: winners } = await supabasePublic
      .from("raffles")
      .select("id,title,prize,prize_brand,status,week_start,winner_label,drawn_at")
      .eq("status", "drawn")
      .order("week_start", { ascending: false })
      .limit(8);

    return { open: (open?.[0] as PublicRaffle) ?? null, winners: (winners as PublicRaffle[]) ?? [] };
  },
);
