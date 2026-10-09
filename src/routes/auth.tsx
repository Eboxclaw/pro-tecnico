import { useEffect, useRef, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useT } from "@/lib/i18n";
import { getRememberedReferralCode } from "@/lib/referrals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RejendariLogo } from "@/components/brand/RejendariLogo";
import { ProductImage } from "@/components/shop/ProductImage";
import { CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";

/** Só caminhos internos — evita redirects abertos para o exterior. */
function safeRedirect(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: safeRedirect(search.redirect),
  }),
  head: () => ({
    meta: [
      { title: "Conta — REJENDARI" },
      {
        name: "description",
        content: "Entra ou cria uma conta REJENDARI para encomendas, pontos e convites.",
      },
      { property: "og:title", content: "Conta — REJENDARI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const CODE_LENGTH = 6;
const CODE_RESEND_SECONDS = 45;

function AuthPage() {
  const t = useT();
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const destination = redirect ?? "/conta";
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const boxes = useRef<Array<HTMLInputElement | null>>([]);
  const [busy, setBusy] = useState(false);
  const [resentIn, setResentIn] = useState(0);
  const resendTimer = useRef<number | undefined>(undefined);
  const supabaseReady = isSupabaseConfigured();
  const referralCode = getRememberedReferralCode();
  const code = digits.join("");

  useEffect(() => {
    return () => window.clearInterval(resendTimer.current);
  }, []);

  const startResendCooldown = () => {
    setResentIn(CODE_RESEND_SECONDS);
    window.clearInterval(resendTimer.current);
    resendTimer.current = window.setInterval(() => {
      setResentIn((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(resendTimer.current);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
  };

  const errorText = (message: string) => {
    const m = message.toLowerCase();
    if (m.includes("rate limit") || m.includes("too many")) return t("auth.errorRateLimited");
    if (m.includes("confirm")) return t("auth.errorEmailNotConfirmed");
    if (m.includes("token") || m.includes("code") || m.includes("otp")) {
      return "Código inválido ou expirado. Confirma o email mais recente ou pede um novo.";
    }
    return t("auth.error");
  };

  /** Passo 1: pede o código — cria conta nova se o email ainda não existir. */
  async function requestCode(event?: React.FormEvent) {
    event?.preventDefault();
    if (!supabaseReady) {
      toast.error("Serviço de conta indisponível. Tenta mais tarde.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: { referred_by_code: referralCode || undefined },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(errorText(error.message));
      return;
    }
    setDigits(Array(CODE_LENGTH).fill(""));
    setStep("code");
    startResendCooldown();
    toast.success(`Código enviado para ${email}.`);
  }

  /** Passo 2: confirma o código de 6 dígitos. */
  async function confirmCode(event?: React.FormEvent) {
    event?.preventDefault();
    if (!supabaseReady || code.length < CODE_LENGTH) return;
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setBusy(false);
    if (error) {
      toast.error(errorText(error.message));
      return;
    }
    toast.success(t("auth.accountReady"));
    router.history.push(destination);
  }

  /** Escreve/cola nos separadores: só dígitos, auto-avanço e auto-confirmação. */
  const setDigit = (index: number, raw: string) => {
    const clean = raw.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => prev.map((d, i) => (i === index ? "" : d)));
      return;
    }
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < clean.length && index + i < CODE_LENGTH; i++) {
        next[index + i] = clean[i];
      }
      const filled = next.join("");
      if (filled.length === CODE_LENGTH && !filled.includes("")) {
        void confirmCode();
      }
      return next;
    });
    const nextBox = boxes.current[Math.min(index + clean.length, CODE_LENGTH - 1)];
    nextBox?.focus();
  };

  async function google() {
    if (!supabaseReady) {
      toast.error(t("auth.googleUnavailable"));
      return;
    }
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error(t("auth.error"));
    else if (!result.redirected) router.history.push(destination);
  }

  return (
    <div className="mx-auto grid min-h-[100svh] max-w-[1440px] border-x border-border lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden border-r border-border bg-[#1b1917] lg:flex lg:flex-col lg:justify-between">
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
          <p className="mt-8 max-w-md text-xs leading-6 text-white/45">
            Sem passwords para gerir: entras com Google ou com um código de seis dígitos enviado
            para o teu email. NIF e dados de faturação ficam para a altura do pagamento, tratados
            pelo provider.
          </p>
        </div>

        <div className="relative grid grid-cols-2 gap-px border-t border-white/10 bg-white/10">
          {CURATED_TOOL_REFERENCES.filter((tool) => tool.imageUrl)
            .slice(0, 4)
            .map((tool) => (
              <div key={tool.id} className="relative aspect-[4/3] overflow-hidden bg-[#eee9de]">
                <ProductImage
                  src={tool.imageUrl!}
                  alt={tool.imageAlt ?? `${tool.brand} ${tool.model}`}
                  className="h-full w-full object-contain p-5"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-3 pt-8">
                  <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-white/70">
                    {tool.brand} · {tool.model}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="flex items-center px-4 py-12 sm:px-10 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <p className="jp-label text-primary">
            {step === "email" ? "ログイン · entrar" : "確認 · código de acesso"}
          </p>
          {step === "code" && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              passo 2 de 2
            </p>
          )}
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">
            {step === "email" ? t("auth.title") : "Escreve o código"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {step === "email"
              ? "Entra com Google ou recebe um código de seis dígitos no email — sem password."
              : `Enviámos um código de seis dígitos para ${email}.`}
          </p>

          {referralCode && step === "email" && (
            <div className="mt-6 flex gap-3 border border-primary/30 bg-primary/[0.05] p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="jp-label text-primary">紹介 · convite reconhecido</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  O convite {referralCode} fica associado à tua conta. Se existir uma campanha
                  elegível, as condições e vantagens aparecem depois do registo.
                </p>
              </div>
            </div>
          )}

          {step === "email" ? (
            <>
              <Button
                variant="secondary"
                className="mt-8 w-full rounded-none"
                onClick={google}
                disabled={!supabaseReady}
              >
                {t("auth.google")}
              </Button>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  {t("auth.or")}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={requestCode} className="space-y-5">
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
                <Button type="submit" className="w-full rounded-none" size="lg" disabled={busy}>
                  {busy ? "A enviar…" : "Receber código"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <>
              <form onSubmit={confirmCode} className="mt-8 space-y-5">
                <div>
                  <Label htmlFor="otp-0">Código de 6 dígitos</Label>
                  <div className="mt-2 flex gap-2">
                    {digits.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => {
                          boxes.current[index] = el;
                        }}
                        id={index === 0 ? "otp-0" : `otp-${index}`}
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        autoFocus={index === 0}
                        maxLength={1}
                        required
                        value={digit}
                        onChange={(event) => setDigit(index, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Backspace" && !digits[index] && index > 0) {
                            boxes.current[index - 1]?.focus();
                          }
                        }}
                        onPaste={(event) => {
                          event.preventDefault();
                          setDigit(0, event.clipboardData.getData("text"));
                        }}
                        aria-label={`Dígito ${index + 1}`}
                        className="h-14 rounded-none bg-background text-center font-mono text-2xl"
                      />
                    ))}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-none"
                  size="lg"
                  disabled={busy || code.length < CODE_LENGTH}
                >
                  {busy ? "A confirmar…" : "Entrar"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setDigits(Array(CODE_LENGTH).fill(""));
                  }}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Usar outro email
                </button>
                <button
                  type="button"
                  onClick={() => requestCode()}
                  disabled={resentIn > 0 || busy}
                  className="font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
                >
                  {resentIn > 0 ? `Reenviar em ${resentIn}s` : "Reenviar código"}
                </button>
              </div>

              <p className="mt-6 text-xs text-muted-foreground">Não chegou? Reenvia.</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
