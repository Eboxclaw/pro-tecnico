import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Rejendarī" },
      { name: "description", content: "Entra ou cria conta na Rejendarī para acompanhar encomendas e pontos." },
      { property: "og:title", content: "Entrar — Rejendarī" },
      { property: "og:description", content: "Conta Rejendarī: encomendas, pontos e sorteio semanal." },
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin + "/conta" },
          });
    setBusy(false);
    if (error) return toast.error(t("auth.error"));
    if (mode === "up") toast.success("Verifica o teu email para confirmar a conta.");
    else navigate({ to: "/conta" });
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error(t("auth.error"));
    else if (!res.redirected) navigate({ to: "/conta" });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <p className="tech-label text-primary">Rejendarī</p>
      <h1 className="mt-3 font-display text-3xl font-bold">{mode === "in" ? t("auth.title") : t("auth.signUp")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("auth.subtitle")}</p>
      <Button variant="secondary" className="mt-8 w-full" onClick={google}>{t("auth.google")}</Button>
      <p className="my-6 text-center font-mono text-xs text-muted-foreground">— {t("auth.or")} —</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="pw">{t("auth.password")}</Label>
          <Input id="pw" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>{mode === "in" ? t("auth.signIn") : t("auth.signUp")}</Button>
      </form>
      <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-primary">
        {mode === "in" ? t("auth.needAccount") : t("auth.haveAccount")}
      </button>
    </div>
  );
}
