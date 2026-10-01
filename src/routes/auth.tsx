import { ProductImage } from "@/components/shop/ProductImage";
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useT } from "@/lib/i18n";
import { getRememberedReferralCode } from "@/lib/referrals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RejendariLogo } from "@/components/brand/RejendariLogo";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Conta — REJENDARI" },
      { name: "description", content: "Entra ou cria uma conta REJENDARI para encomendas, pontos e convites." },
      { property: "og:title", content: "Conta — REJENDARI" },
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
    if (!isSupabaseConfigured()) {
      toast.error("Serviço de conta indisponível. Tenta mais tarde.");
      return;
    }
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
      <section className="relative hidden overflow-hidden border-r border-border bg-[#24211d] lg:flex lg:flex-col lg:justify-between">
        <div className="washi-noise absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative p-10 xl:p-14">
          <RejendariLogo inverted className="max-w-[320px]" />
          <p className="jp-label mt-12 text-primary">会員 · conta REJENDARI</p>
          <h1 className="mt-5 max-w-xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-white xl:text-6xl">
            Uma conta para compras, pontos e vantagens.
          </h1>
          <div className="mt-8 grid max-w-xl grid-cols-3 border-y border-white/20 py-4 font-mono text-[9px] uppercase tracking-[0.13em] text-white/60">
            <span>Encomendas</span>
            <span>Saldo de pontos</span>
            <span>Convites e vantagens</span>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-px border-t border-white/10 bg-white/10">
          {CURATED_TOOL_REFERENCES.filter((tool) => tool.imageUrl).slice(0, 4).map((tool) => (
            <div key={tool.id} className="relative aspect-[4/3] overflow-hidden bg-[#eee9de]">
              <ProductImage src={tool.imageUrl!} alt={tool.imageAlt ?? `${tool.brand} ${tool.model}` } className="h-full w-full object-contain p-5" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-3 pt-8">
                <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-white/70">{tool.brand} · {tool.model}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center px-4 py-12 sm:px-10 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <p className="jp-label text-primary">{mode === "in" ? "ログイン · entrar" : "新規登録 · criar conta"}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">
            {mode === "in" ? t("auth.title") : t("auth.signUp")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("auth.subtitle")}</p>

          {referralCode && (
            <div className="mt-6 flex gap-3 border border-primary/30 bg-primary/[0.05] p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="jp-label text-primary">紹介 · convite reconhecido</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  O convite {referralCode} fica associado à tua conta. Se existir uma campanha elegível, as condições e vantagens aparecem depois do registo.
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
