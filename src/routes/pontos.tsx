import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, ScrollText, Share2, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
import { useT, useLocale } from "@/lib/i18n";
import { getPublicRaffles, type PublicRaffle } from "@/lib/points.functions";
import { buildReferralLink } from "@/lib/referrals";
import { supabase } from "@/integrations/supabase/client";
import { ToolGlyph } from "@/components/brand/ToolGlyph";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/pontos")({
  head: () => ({
    meta: [
      { title: "Points & referrals — REJENDARI" },
      {
        name: "description",
        content: "REJENDARI loyalty: points, referral attribution and free-entry weekly draws.",
      },
      { property: "og:title", content: "Points & referrals — REJENDARI" },
      { property: "og:description", content: "One account ledger for loyalty points and referral rewards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PointsPage,
});

type ReferralRow = {
  id: string;
  status: string;
  referrer_points: number;
  referred_points: number;
  created_at: string;
};

function PointsPage() {
  const t = useT();
  const locale = useLocale((s) => s.locale);
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [entering, setEntering] = useState(false);
  const [myEntries, setMyEntries] = useState<string[]>([]);
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["public-raffles"],
    queryFn: getPublicRaffles,
  });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: sessionData }) => {
      const uid = sessionData.session?.user.id ?? null;
      setUserId(uid);
      if (!uid) return;

      const [entries, profile, referralRows] = await Promise.all([
        supabase.from("raffle_entries").select("raffle_id").eq("user_id", uid),
        supabase.from("profiles").select("referral_code").eq("id", uid).maybeSingle(),
        supabase
          .from("referrals")
          .select("id,status,referrer_points,referred_points,created_at")
          .eq("referrer_id", uid)
          .order("created_at", { ascending: false }),
      ]);

      setMyEntries((entries.data ?? []).map((entry) => entry.raffle_id));
      setReferralCode(profile.data?.referral_code ?? "");
      setReferrals((referralRows.data ?? []) as ReferralRow[]);
    });
  }, []);

  const openRaffle: PublicRaffle | null = data?.open ?? null;
  const winners = data?.winners ?? [];
  const entered = openRaffle ? myEntries.includes(openRaffle.id) : false;
  const referralLink = referralCode ? buildReferralLink(referralCode) : "";
  const earnedFromReferrals = useMemo(
    () => referrals.reduce((sum, referral) => sum + referral.referrer_points, 0),
    [referrals],
  );

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
      return;
    }

    toast.success(t("points.raffleEntered"));
    setMyEntries((previous) => [...previous, openRaffle.id]);
    queryClient.invalidateQueries({ queryKey: ["public-raffles"] });
  };

  const copyReferral = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const shareReferral = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      await navigator.share({
        title: "REJENDARI",
        text: locale === "pt" ? "Ferramenta profissional escolhida com critério." : "Professional tools selected with purpose.",
        url: referralLink,
      });
    } else {
      await copyReferral();
    }
  };

  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
          <p className="tech-label text-primary">REJENDARI / Loyalty infrastructure</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
            Points, referrals,
            <br />
            <span className="text-primary">one ledger.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">{t("points.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:py-16">
        <div className="grid gap-px border border-border bg-border lg:grid-cols-2">
          <article className="bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3 text-primary">
              <ToolGlyph name="reward" className="h-8 w-8" />
              <span className="tech-label">Points</span>
            </div>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.045em]">{t("points.howTitle")}</h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
              {[t("points.how1"), t("points.how2"), t("points.how3"), t("points.how4")].map((line, index) => (
                <li key={line} className="grid grid-cols-[28px_1fr] gap-3">
                  <span className="font-mono text-[10px] text-primary">0{index + 1}</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3 text-primary">
              <ToolGlyph name="referral" className="h-8 w-8" />
              <span className="tech-label">Referrals</span>
            </div>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.045em]">
              Share a link. Attribution survives sign-in.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
              The referral code is captured before registration and attached to the account afterwards. Reward amounts
              are deliberately not hard-coded into the website: the active campaign decides the qualification rule and
              point amount, then the reward lands in the same points ledger.
            </p>

            {userId && referralCode ? (
              <div className="mt-7 border border-border bg-background p-4">
                <p className="tech-label text-muted-foreground">Your referral link</p>
                <p className="mt-3 break-all font-mono text-xs text-foreground">{referralLink}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={copyReferral}>
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareReferral}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-px bg-border">
                  <div className="bg-surface p-4">
                    <p className="font-display text-2xl font-semibold">{referrals.length}</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Attributed</p>
                  </div>
                  <div className="bg-surface p-4">
                    <p className="font-display text-2xl font-semibold">{earnedFromReferrals}</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Points earned</p>
                  </div>
                </div>
              </div>
            ) : (
              <Button className="mt-7 rounded-none" asChild>
                <Link to="/auth">{userId ? "Open account" : t("nav.signIn")}</Link>
              </Button>
            )}
          </article>
        </div>

        <section className="mt-8 border border-border bg-card p-6 sm:p-8">
          <span className="tech-label flex items-center gap-2 text-primary">
            <Trophy className="h-3.5 w-3.5" />
            {t("points.raffleTitle")}
          </span>

          {isLoading ? (
            <div className="mt-5 space-y-3">
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ) : !openRaffle ? (
            <p className="mt-4 text-sm text-muted-foreground">{t("points.noWinners")}</p>
          ) : (
            <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">{openRaffle.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t("points.rafflePrize")}:{" "}
                  <span className="font-semibold text-foreground">{openRaffle.prize}</span>
                  {openRaffle.prize_brand ? ` — ${openRaffle.prize_brand}` : ""}
                </p>
                <p className="mt-4 max-w-xl text-xs leading-5 text-muted-foreground">{t("points.raffleFree")}</p>
              </div>
              {userId ? (
                <Button onClick={enter} disabled={entering || entered} size="lg" className="rounded-none">
                  <Users className="mr-2 h-4 w-4" />
                  {entered ? t("points.raffleEntered") : t("points.raffleEnter")}
                </Button>
              ) : (
                <Button asChild size="lg" className="rounded-none">
                  <Link to="/auth">{t("points.raffleSignIn")}</Link>
                </Button>
              )}
            </div>
          )}
        </section>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <section className="border border-border bg-surface p-6">
            <p className="tech-label flex items-center gap-2 text-muted-foreground">
              <ScrollText className="h-3.5 w-3.5" />
              {t("points.rules")}
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{t("points.rulesText")}</p>
            <Link to="/legal" className="mt-4 inline-block text-sm text-primary hover:underline">
              {t("legal.raffle")} →
            </Link>
          </section>

          <section className="border border-border bg-surface p-6">
            <p className="tech-label text-muted-foreground">{t("points.winners")}</p>
            {winners.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">{t("points.noWinners")}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {winners.map((winner) => (
                  <li key={winner.id} className="border-b border-border pb-3 font-mono text-xs last:border-b-0">
                    <div className="flex flex-wrap justify-between gap-3">
                      <span>{winner.title} — {winner.prize}</span>
                      <span className="text-muted-foreground">{winner.winner_label ?? "—"}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}
