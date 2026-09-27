import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Informação legal — Rejendarī" },
      { name: "description", content: "Termos, privacidade, devoluções, garantia e regulamento do sorteio da Rejendarī." },
      { property: "og:title", content: "Informação legal — Rejendarī" },
      { property: "og:description", content: "Termos, privacidade, devoluções, garantia e regulamento do sorteio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LegalPage,
});

const SECTIONS = ["terms", "privacy", "returns", "warranty", "raffle"] as const;

function LegalPage() {
  const t = useT();
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="tech-label text-primary">Legal</p>
      <h1 className="mt-3 font-display text-4xl font-bold">{t("legal.title")}</h1>
      <nav className="mt-8 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a key={s} href={`#${s}`} className="border border-border px-3 py-1.5 font-mono text-xs hover:border-primary">
            {t(`legal.${s}`)}
          </a>
        ))}
      </nav>
      <div className="mt-10 space-y-6">
        {SECTIONS.map((s, i) => (
          <section key={s} id={s} className="scroll-mt-24 border-l-2 border-border pl-5">
            <p className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-1 font-display text-xl font-semibold">{t(`legal.${s}`)}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("legal.pending")}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
