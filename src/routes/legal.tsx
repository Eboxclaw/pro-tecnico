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
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1100px] px-4 py-14 sm:px-6">
          <p className="tech-label text-primary">REJENDARI / Legal</p>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.055em]">{t("legal.title")}</h1>
        </div>
      </section>
      <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:py-14">
      <nav className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a key={s} href={`#${s}`} className="border border-border px-3 py-1.5 font-mono text-xs hover:border-primary">
            {t(`legal.${s}`)}
          </a>
        ))}
      </nav>
      <div className="mt-10 divide-y divide-border border-y border-border">
        {SECTIONS.map((s, i) => (
          <section key={s} id={s} className="scroll-mt-40 grid gap-4 py-7 sm:grid-cols-[90px_1fr]">
            <p className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</p>
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.035em]">{t(`legal.${s}`)}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{t("legal.pending")}</p>
            </div>
          </section>
        ))}
      </div>
      </div>
    </div>
  );
}
