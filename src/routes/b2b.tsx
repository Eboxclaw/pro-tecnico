import { referenceById, CURATED_TOOL_REFERENCES } from "@/data/curated-tool-references";
import { ProductImage } from "@/components/shop/ProductImage";
import { createFileRoute, Link } from "@tanstack/react-router";
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
  validateSearch: (search: Record<string, unknown>): { reference?: string | undefined } => ({
    reference: typeof search["reference"] === "string" && referenceById(search["reference"]) ? search["reference"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Conta profissional (B2B) — REJENDARI" },
      {
        name: "description",
        content: "Pedido de conta profissional REJENDARI: preços por volume, orçamentos e apoio técnico para empresas.",
      },
      { property: "og:title", content: "Conta profissional (B2B) — REJENDARI" },
      {
        property: "og:description",
        content: "Conta dedicada, preços por volume e apoio técnico para empresas e profissionais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: B2BRoute,
});

function B2BRoute() {
  const { reference } = Route.useSearch();
  return <B2BPage key={reference ?? "general"} reference={reference} />;
}

function B2BPage({ reference }: { reference?: string | undefined }) {
  const tool = reference ? referenceById(reference) : undefined;
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
    message: tool ? `Gostaria de confirmar disponibilidade de ${tool.brand} ${tool.model} — ${tool.namePt}.\nQuantidade: \nAplicação: ` : "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const { error } = await supabase.from("b2b_requests").insert({
        ...form,
        user_id: sessionData.session?.user.id ?? null,
      });
      if (error) throw error;
      toast.success(t("b2b.success"));
      setSent(true);
    } catch {
      toast.error(t("b2b.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:py-20">
          <span className="jp-label flex items-center gap-2 text-primary">
            <Building2 className="h-3.5 w-3.5" />
            法人 · profissionais & empresas
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.06em] sm:text-6xl">{t("b2b.title")}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{t("b2b.subtitle")}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.65fr_1.35fr] lg:py-14">
        <aside className="h-fit border border-border bg-card p-6 lg:sticky lg:top-40">
          <div className="mb-6 grid grid-cols-2 gap-2" aria-label="Referências para profissionais">
            {["vessel-td6816mg", "koken-3725z", "olfa-l5", "lobster-um30xg"].map((id) => {
              const item = CURATED_TOOL_REFERENCES.find((entry) => entry.id === id)!;
              return <Link key={id} to="/referencia/$id" params={{ id }} className="bg-[#eee8dc] p-2"><ProductImage src={item.imageUrl} alt={`${item.brand} ${item.model}`} className="aspect-square w-full object-contain" /><p className="mt-2 text-center font-mono text-[9px] text-[#625c53]">{item.brand}</p></Link>;
            })}
          </div>
          <p className="jp-label text-primary">法人向け · vantagens profissionais</p>
          <ul className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
            <li>Condições para volume, compras recorrentes e equipas.</li>
            <li>Ajuda a encontrar referências, compatibilidades e alternativas.</li>
            <li>Kits e seleções por profissão, tarefa ou orçamento.</li>
            <li>Condições comerciais definidas conforme volume e disponibilidade.</li>
          </ul>
        </aside>

        {sent ? (
          <div className="border border-border bg-card p-10 text-center">
            <p className="font-display text-2xl font-semibold">{t("b2b.success")}</p>
            <p className="mt-4 text-sm text-muted-foreground">O pedido foi registado. A confirmação de disponibilidade e condições será feita através dos contactos indicados.</p>
            <Link to="/shop" className="mt-6 inline-block text-primary underline">Continuar a explorar ferramentas</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5 border border-border bg-card p-6 sm:p-8">
          <div>
            <h2 className="font-display text-2xl font-semibold">O teu pedido, com contexto.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Indica as referências, quantidades e o trabalho a realizar. Confirmamos as condições antes de qualquer compromisso de compra.</p>
            {tool && <p className="mt-3 border-l-2 border-primary pl-3 text-sm">Referência selecionada: <strong>{tool.brand} {tool.model}</strong></p>}
          </div>
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
            <Textarea id="message" placeholder="Ex.: 3 unidades, utilização em manutenção e entrega pretendida em Portugal." maxLength={4000} rows={6} value={form.message} onChange={set("message")} />
          </div>
          <p className="text-xs leading-5 text-muted-foreground">Usamos estes dados para analisar e responder ao pedido. Consulta a <Link to="/legal" hash="privacy" className="underline">informação de privacidade</Link>. O pedido não cria uma conta profissional aprovada nem uma encomenda.</p>
          <Button type="submit" size="lg" disabled={submitting} className="w-full rounded-none sm:w-auto">
            {submitting ? "A enviar…" : t("b2b.submit")}
          </Button>
        </form>
        )}
      </div>
    </div>
  );
}
