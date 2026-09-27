import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/conta")({
  head: () => ({
    meta: [
      { title: "A minha conta — Rejendarī" },
      { name: "description", content: "Pontos, histórico e inscrições no sorteio da tua conta Rejendarī." },
      { property: "og:title", content: "A minha conta — Rejendarī" },
      { property: "og:description", content: "Pontos, histórico e inscrições no sorteio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const t = useT();
  const { data } = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user!.id;
      const [profile, ledger, entries] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
        supabase.from("points_ledger").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(20),
        supabase.from("raffle_entries").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      ]);
      return { email: u.user!.email, profile: profile.data, ledger: ledger.data ?? [], entries: entries.data ?? [] };
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="tech-label text-primary">{data?.email}</p>
      <h1 className="mt-3 font-display text-4xl font-bold">{t("account.title")}</h1>
      <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
        <div className="bg-surface p-6">
          <p className="tech-label text-muted-foreground">{t("account.points")}</p>
          <p className="mt-2 font-display text-5xl font-bold text-primary">{data?.profile?.points ?? "—"}</p>
        </div>
        <div className="bg-surface p-6 md:col-span-2">
          <p className="tech-label text-muted-foreground">{t("account.history")}</p>
          <ul className="mt-3 space-y-2 font-mono text-sm">
            {data?.ledger.map((l) => (
              <li key={l.id} className="flex justify-between border-b border-border pb-2">
                <span>{l.reason}</span>
                <span className={l.delta >= 0 ? "text-success" : "text-destructive"}>{l.delta > 0 ? "+" : ""}{l.delta}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface p-6">
          <p className="tech-label text-muted-foreground">{t("account.entries")}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {data?.entries.length ? `${data.entries.length} ×` : t("account.noEntries")}
          </p>
        </div>
        <div className="bg-surface p-6 md:col-span-2">
          <p className="tech-label text-muted-foreground">{t("account.orders")}</p>
          <p className="mt-3 text-sm text-muted-foreground">{t("account.ordersHint")}</p>
        </div>
      </div>
    </div>
  );
}
