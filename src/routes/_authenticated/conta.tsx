import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";
import { buildReferralLink } from "@/lib/referrals";
import { Button } from "@/components/ui/button";
import { ToolGlyph } from "@/components/brand/ToolGlyph";

export const Route = createFileRoute("/_authenticated/conta")({
  head: () => ({
    meta: [
      { title: "A minha conta — REJENDARI" },
      { name: "description", content: "Conta REJENDARI: pontos, convites, sorteios e encomendas." },
      { property: "og:title", content: "A minha conta — REJENDARI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Sessão indisponível");
      const uid = userData.user.id;

      const [profile, ledger, entries, referrals] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
        supabase
          .from("points_ledger")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(30),
        supabase
          .from("raffle_entries")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", { ascending: false }),
        supabase
          .from("referrals")
          .select("id,status,referrer_points,created_at")
          .eq("referrer_id", uid)
          .order("created_at", { ascending: false }),
      ]);

      const failure = [profile, ledger, entries, referrals].find(result => result.error)?.error;
      if (failure) throw failure;
      return {
        email: userData.user!.email,
        profile: profile.data,
        ledger: ledger.data ?? [],
        entries: entries.data ?? [],
        referrals: referrals.data ?? [],
      };
    },
  });

  const referralLink = data?.profile?.referral_code ? buildReferralLink(data.profile.referral_code) : "";
  const referralPoints = useMemo(
    () => (data?.referrals ?? []).reduce((sum, referral) => sum + referral.referrer_points, 0),
    [data?.referrals],
  );

  const copy = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const share = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      await navigator.share({ title: "REJENDARI", url: referralLink });
    } else {
      await copy();
    }
  };

  if (isLoading) return <div className="mx-auto max-w-3xl px-6 py-24" role="status">A carregar a tua conta…</div>;
  if (isError) return <div className="mx-auto max-w-3xl px-6 py-24" role="alert"><h1 className="font-display text-3xl">Não foi possível carregar a conta.</h1><p className="mt-4">Os teus dados não estão disponíveis neste momento.</p><Button className="mt-6" onClick={() => void refetch()}>Tentar novamente</Button></div>;

  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <p className="tech-label text-primary">{data?.email ?? "REJENDARI"}</p>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.055em]">{t("account.title")}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-px border border-border bg-border md:grid-cols-4">
          <div className="bg-card p-6">
            <div className="flex items-center gap-2 text-primary">
              <ToolGlyph name="reward" className="h-5 w-5" />
              <p className="tech-label">{t("account.points")}</p>
            </div>
            <p className="mt-5 font-display text-5xl font-semibold tracking-[-0.06em]">{data?.profile?.points ?? "—"}</p>
          </div>

          <div className="bg-card p-6">
            <div className="flex items-center gap-2 text-primary">
              <ToolGlyph name="referral" className="h-5 w-5" />
              <p className="jp-label">紹介 · Convites</p>
            </div>
            <p className="mt-5 font-display text-5xl font-semibold tracking-[-0.06em]">{data?.referrals.length ?? "—"}</p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              {referralPoints} pontos ganhos
            </p>
          </div>

          <div className="bg-card p-6">
            <p className="tech-label text-muted-foreground">{t("account.entries")}</p>
            <p className="mt-5 font-display text-5xl font-semibold tracking-[-0.06em]">{data?.entries.length ?? "—"}</p>
          </div>

          <div className="bg-card p-6">
            <p className="tech-label text-muted-foreground">{t("account.orders")}</p>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">{t("account.ordersHint")}</p>
          </div>
        </div>

        {referralLink && (
          <section className="mt-6 border border-border bg-card p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className="jp-label text-primary">紹介リンク · o teu link pessoal</p>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em]">
                  Partilha quando quiseres.
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Quando houver uma campanha de convites ativa, as condições e os pontos disponíveis aparecem na área de pontos.
                  Os pontos ganhos ficam reunidos no mesmo saldo.
                </p>
              </div>
              <div className="border border-border bg-background p-4">
                <p className="break-all font-mono text-xs">{referralLink}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={copy}>
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? "Copiado" : "Copiar"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={share}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Partilhar
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-6 border border-border bg-card">
          <div className="border-b border-border p-5">
            <p className="tech-label text-muted-foreground">{t("account.history")}</p>
          </div>
          <ul className="divide-y divide-border">
            {data?.ledger.length ? (
              data.ledger.map((entry) => (
                <li key={entry.id} className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 font-mono text-xs">
                  <div>
                    <p className="text-foreground">{entry.reason.replaceAll("_", " ")}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={entry.delta >= 0 ? "text-success" : "text-destructive"}>
                    {entry.delta > 0 ? "+" : ""}
                    {entry.delta}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-5 py-8 text-sm text-muted-foreground">Ainda não existe atividade de pontos.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
