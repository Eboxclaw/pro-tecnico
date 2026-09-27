import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useT } from "@/lib/i18n";
import { getRememberedReferralCode } from "@/lib/referrals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import hero from "@/assets/hero-japanese-tools.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Account — REJENDARI" },
      { name: "description", content: "Sign in or create a REJENDARI account for orders, points and referrals." },
      { property: "og:title", content: "Account — REJENDARI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const t = useT();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const referralCode = getRememberedReferralCode();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);

    const { error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin + "/conta",
              data: { referred_by_code: referralCode || undefined },
            },
          });

    setBusy(false);

    if (error) {
      toast.error(t("auth.error"));
      return;
    }

    if (mode === "up") toast.success("Verifica o teu email para confirmar a conta.");
    else navigate({ to: "/conta" });
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error(t("auth.error"));
    else if (!result.redirected) navigate({ to: "/conta" });
  }

  return (
    <div className="mx-auto grid min-h-[720px] max-w-[1440px] border-x border-border lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden border-r border-border lg:block">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
        <div className="technical-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
          <p className="tech-label text-primary">REJENDARI / Account</p>
          <h1 className="mt-5 max-w-xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-white xl:text-6xl">
            One identity for the tools, points and referrals.
          </h1>
          <div className="mt-8 grid max-w-xl grid-cols-3 border-y border-white/20 py-4 font-mono text-[9px] uppercase tracking-[0.13em] text-white/60">
            <span>Orders</span>
            <span>Points ledger</span>
            <span>Referral attribution</span>
          </div>
        </div>
      </section>

      <section className="flex items-center px-4 py-12 sm:px-10 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <p className="tech-label text-primary">{mode === "in" ? "Sign in" : "Create account"}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">
            {mode === "in" ? t("auth.title") : t("auth.signUp")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("auth.subtitle")}</p>

          {referralCode && (
            <div className="mt-6 flex gap-3 border border-primary/30 bg-primary/[0.05] p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="tech-label text-primary">Referral captured</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Code {referralCode} stays attached through registration. Campaign rewards are credited after qualification.
                </p>
              </div>
            </div>
          )}

          <Button variant="secondary" className="mt-8 w-full rounded-none" onClick={google}>
            {t("auth.google")}
          </Button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{t("auth.or")}</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 rounded-none bg-background"
              />
            </div>
            <div>
              <Label htmlFor="pw">{t("auth.password")}</Label>
              <Input
                id="pw"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 rounded-none bg-background"
              />
            </div>
            <Button type="submit" className="w-full rounded-none" size="lg" disabled={busy}>
              {mode === "in" ? t("auth.signIn") : t("auth.signUp")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="mt-6 w-full text-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {mode === "in" ? t("auth.needAccount") : t("auth.haveAccount")}
          </button>
        </div>
      </section>
    </div>
  );
}
