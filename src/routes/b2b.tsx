import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/b2b")({
  head: () => ({
    meta: [
      { title: "Conta profissional (B2B) — Rejendarī" },
      {
        name: "description",
        content: "Pedido de conta profissional Rejendarī: preços por volume, orçamentos e apoio técnico para empresas.",
      },
      { property: "og:title", content: "Conta profissional (B2B) — Rejendarī" },
      {
        property: "og:description",
        content: "Conta dedicada, preços por volume e apoio técnico para empresas e profissionais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: B2BPage,
});

function B2BPage() {
  const t = useT();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    company: "",
    contact_name: "",
    email: "",
    phone: "",
    vat_number: "",
    trade: "",
    message: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const { error } = await supabase.from("b2b_requests").insert({
      ...form,
      user_id: sessionData.session?.user.id ?? null,
    });
    setSubmitting(false);
    if (error) toast.error(t("b2b.error"));
    else {
      toast.success(t("b2b.success"));
      setSent(true);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <span className="tech-label flex items-center gap-2 text-primary">
        <Building2 className="h-3.5 w-3.5" />
        B2B
      </span>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{t("b2b.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("b2b.subtitle")}</p>

      {sent ? (
        <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
          <p className="font-display text-lg font-semibold">{t("b2b.success")}</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="company">{t("b2b.company")} *</Label>
              <Input id="company" required value={form.company} onChange={set("company")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact">{t("b2b.contactName")} *</Label>
              <Input id="contact" required value={form.contact_name} onChange={set("contact_name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("b2b.email")} *</Label>
              <Input id="email" type="email" required value={form.email} onChange={set("email")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">{t("b2b.phone")}</Label>
              <Input id="phone" value={form.phone} onChange={set("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vat">{t("b2b.vat")}</Label>
              <Input id="vat" value={form.vat_number} onChange={set("vat_number")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="trade">{t("b2b.trade")}</Label>
              <Input id="trade" value={form.trade} onChange={set("trade")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">{t("b2b.message")}</Label>
            <Textarea id="message" rows={4} value={form.message} onChange={set("message")} />
          </div>
          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {t("b2b.submit")}
          </Button>
        </form>
      )}
    </div>
  );
}
