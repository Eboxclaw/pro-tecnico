import { useState } from "react";
import { toast } from "sonner";
import { Lock, Loader2 } from "lucide-react";
import { useT, useLocale, type Locale } from "@/lib/i18n";
import { SITE_ACCESS_CODE } from "@/lib/site-config";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import hero from "@/assets/hero-tools.jpg";

const LANGS: { id: Locale; label: string }[] = [
  { id: "pt", label: "PT" },
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
];

export function SiteGate({ onUnlock }: { onUnlock: () => void }) {
  const t = useT();
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [notifying, setNotifying] = useState(false);

  const unlock = () => {
    if (code.trim() === SITE_ACCESS_CODE) {
      sessionStorage.setItem("protecnico-gate", "open");
      onUnlock();
    } else {
      setError(true);
    }
  };

  const notify = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error(t("gate.notifyError"));
      return;
    }
    setNotifying(true);
    const { error: err } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase(), locale });
    setNotifying(false);
    if (err) toast.error(t("gate.notifyError"));
    else {
      toast.success(t("gate.notifySuccess"));
      setEmail("");
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <img
        src={hero}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        width={1600}
        height={900}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <span className="tech-label flex items-center gap-2 text-primary">
          <Lock className="h-3.5 w-3.5" />
          {t("gate.badge")}
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          pro<span className="text-primary">'</span>tecnico
        </h1>
        <p className="mt-2 font-display text-lg font-semibold">{t("gate.title")}</p>
        <p className="mt-3 text-sm text-muted-foreground">{t("gate.subtitle")}</p>

        <div className="mt-8 w-full max-w-sm space-y-3 rounded-lg border border-border bg-surface/90 p-5 text-left backdrop-blur">
          <label className="tech-label text-muted-foreground" htmlFor="gate-email">
            Email
          </label>
          <div className="flex gap-2">
            <Input
              id="gate-email"
              type="email"
              placeholder={t("gate.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && notify()}
            />
            <Button onClick={notify} disabled={notifying}>
              {notifying ? <Loader2 className="h-4 w-4 animate-spin" /> : t("gate.notifyMe")}
            </Button>
          </div>

          <div className="pt-2">
            <label className="tech-label text-muted-foreground" htmlFor="gate-code">
              {t("gate.codeLabel")}
            </label>
            <div className="mt-2 flex gap-2">
              <Input
                id="gate-code"
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && unlock()}
              />
              <Button variant="secondary" onClick={unlock}>
                {t("gate.enter")}
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-destructive">{t("gate.wrongCode")}</p>}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <span className="tech-label text-muted-foreground">{t("gate.langLabel")}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="font-mono text-xs tracking-widest">
                {locale.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {LANGS.map((l) => (
                <DropdownMenuItem key={l.id} onClick={() => setLocale(l.id)}>
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
