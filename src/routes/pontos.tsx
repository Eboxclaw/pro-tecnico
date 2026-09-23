import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trophy, Users, ScrollText } from "lucide-react";
import { useT } from "@/lib/i18n";
import { getPublicRaffles, type PublicRaffle } from "@/lib/points.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/pontos")({
  head: () => ({
    meta: [
      { title: "Pontos e sorteios semanais — Rejendarī" },
      {
        name: "description",
        content: "Programa de fidelização Rejendarī: pontos por compras com valor garantido e sorteio semanal com entrada gratuita.",
      },
      { property: "og:title", content: "Pontos e sorteios semanais — Rejendarī" },
      {
        property: "og:description",
        content: "Pontos trocáveis por desconto garantido e sorteio semanal com entrada gratuita.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PointsPage,
});

function PointsPage() {
  const t = useT();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [entering, setEntering] = useState(false);
  const [myEntries, setMyEntries] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["public-raffles"],
    queryFn: getPublicRaffles,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: sessionData }) => {
      const uid = sessionData.session?.user.id ?? null;
      setUserId(uid);
      if (uid) {
        supabase
          .from("raffle_entries")
          .select("raffle_id")
          .eq("user_id", uid)
          .then(({ data: entries }) => setMyEntries((entries ?? []).map((e) => e.raffle_id)));
      }
    });
  }, []);

  const openRaffle: PublicRaffle | null = data?.open ?? null;
  const winners = data?.winners ?? [];
  const entered = openRaffle ? myEntries.includes(openRaffle.id) : false;

  const enter = async () => {
    if (!userId || !openRaffle) return;
    setEntering(true);
    const { error } = await supabase
      .from("raffle_entries")
      .insert({ raffle_id: openRaffle.id, user_id: userId });
    setEntering(false);
    if (error) {
      if (error.code === "23505") toast.info(t("points.raffleEntered"));
      else toast.error(error.message);
    } else {
      toast.success(t("points.raffleEntered"));
      setMyEntries((prev) => [...prev, openRaffle.id]);
      queryClient.invalidateQueries({ queryKey: ["public-raffles"] });
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t("points.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("points.subtitle")}</p>

      {/* Current draw */}
      <section className="mt-8 rounded-lg border border-border bg-card p-6 sm:p-8">
        <span className="tech-label flex items-center gap-2 text-primary">
          <Trophy className="h-3.5 w-3.5" />
          {t("points.raffleTitle")}
        </span>
        {isLoading ? (
          <div className="mt-4 space-y-3">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : !openRaffle ? (
          <p className="mt-4 text-sm text-muted-foreground">{t("points.noWinners")}</p>
        ) : (
          <>
            <h2 className="mt-3 font-display text-2xl font-bold">{openRaffle.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("points.rafflePrize")}:{" "}
              <span className="font-semibold text-foreground">{openRaffle.prize}</span>
              {openRaffle.prize_brand ? ` — ${openRaffle.prize_brand}` : ""}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {userId ? (
                <Button onClick={enter} disabled={entering || entered} size="lg">
                  <Users className="mr-2 h-4 w-4" />
                  {entered ? t("points.raffleEntered") : t("points.raffleEnter")}
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link to="/auth">{t("points.raffleSignIn")}</Link>
                </Button>
              )}
            </div>
          </>
        )}
        <p className="mt-4 text-xs text-muted-foreground">{t("points.raffleFree")}</p>
      </section>

      {/* How to earn */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="tech-label text-muted-foreground">{t("points.howTitle")}</p>
          <ul className="mt-4 space-y-3 font-mono text-sm">
            {[t("points.how1"), t("points.how2"), t("points.how3"), t("points.how4")].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 bg-primary" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="tech-label flex items-center gap-2 text-muted-foreground">
            <ScrollText className="h-3.5 w-3.5" />
            {t("points.rules")}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">{t("points.rulesText")}</p>
          <Link to="/legal" className="mt-3 inline-block text-sm text-primary hover:underline">
            {t("legal.raffle")} →
          </Link>
        </div>
      </section>

      {/* Past winners */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">{t("points.winners")}</h2>
        {winners.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">{t("points.noWinners")}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {winners.map((w) => (
              <li
                key={w.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-surface p-3 font-mono text-sm"
              >
                <span>
                  {w.title} — {w.prize}
                </span>
                <span className="text-muted-foreground">{w.winner_label ?? "—"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
