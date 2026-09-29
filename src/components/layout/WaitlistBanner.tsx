import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { useT, useLocale } from "@/lib/i18n";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DISMISS_KEY = "rejendari-waitlist-dismissed";

/**
 * Non-blocking launch banner: the site stays fully browsable while we
 * collect waitlist emails. Dismissal is remembered in localStorage.
 */
export function WaitlistBanner() {
  const t = useT();
  const locale = useLocale((s) => s.locale);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  // Start hidden-safe on the server; read browser storage only after mount.
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
  }, []);

  if (dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const notify = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error(t("gate.notifyError"));
      return;
    }
    if (!isSupabaseConfigured()) {
      toast.error(t("gate.notifyError"));
      return;
    }
    setSending(true);
    const { error: err } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase(), locale });
    setSending(false);
    if (err) {
      toast.error(t("gate.notifyError"));
    } else {
      toast.success(t("gate.notifySuccess"));
      setDone(true);
      setEmail("");
    }
  };

  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2.5 text-sm">
        <span className="tech-label text-primary">{t("gate.badge")}</span>
        <span className="text-muted-foreground">{t("gate.title")}</span>
        {done ? (
          <span className="text-sm font-medium text-primary">{t("gate.notifySuccess")}</span>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder={t("gate.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && notify()}
              className="h-8 w-52"
              aria-label="Email"
            />
            <Button size="sm" className="h-8" onClick={notify} disabled={sending}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("gate.notifyMe")}
            </Button>
          </div>
        )}
        <button
          onClick={dismiss}
          aria-label="Fechar"
          className="ml-auto text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
