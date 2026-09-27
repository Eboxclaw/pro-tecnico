import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

const JAPANESE_BRANDS = [
  "VESSEL",
  "ANEX",
  "KO-KEN",
  "OLFA",
  "LOBSTER / LOBTEX",
  "MAKITA",
  "ENGINEER",
  "FUJIYA",
  "TSUNODA",
  "TONE",
  "KTC",
  "TAJIMA",
  "SILKY",
];

export function SiteFooter() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-[#0d0f12]">
      <div className="brand-marquee border-b border-border/70 py-4">
        <div className="brand-marquee-track gap-10 pr-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/38">
          {[...JAPANESE_BRANDS, ...JAPANESE_BRANDS].map((brand, index) => (
            <span key={brand + index} className="flex items-center gap-10">
              {brand}
              <span className="h-1 w-1 rounded-full bg-primary/70" />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_0.7fr_0.7fr_0.9fr]">
        <div>
          <p className="font-display text-2xl font-semibold tracking-[-0.04em]">REJENDARI</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{t("footer.tagline")}</p>
          <p className="mt-7 max-w-md border-l border-primary/70 pl-4 font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-muted-foreground">
            A origem japonesa da marca e o país de fabrico são dados diferentes. Confirmamos o país de
            fabrico por SKU antes de fazer essa afirmação.
          </p>
        </div>

        <div>
          <p className="tech-label text-white/45">{t("footer.shopLinks")}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/shop" className="text-muted-foreground hover:text-foreground">{t("nav.shop")}</Link></li>
            <li><Link to="/marcas" className="text-muted-foreground hover:text-foreground">{t("nav.brands")}</Link></li>
            <li><Link to="/packs" className="text-muted-foreground hover:text-foreground">{t("nav.packs")}</Link></li>
            <li><Link to="/pontos" className="text-muted-foreground hover:text-foreground">{t("nav.points")}</Link></li>
            <li><Link to="/b2b" className="text-muted-foreground hover:text-foreground">{t("nav.b2b")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="tech-label text-white/45">{t("footer.legal")}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/legal" className="text-muted-foreground hover:text-foreground">{t("legal.terms")}</Link></li>
            <li><Link to="/legal" className="text-muted-foreground hover:text-foreground">{t("legal.privacy")}</Link></li>
            <li><Link to="/legal" className="text-muted-foreground hover:text-foreground">{t("legal.returns")}</Link></li>
            <li><Link to="/legal" className="text-muted-foreground hover:text-foreground">{t("legal.raffle")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="tech-label text-white/45">Nota de curadoria · 選定</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Catálogo curto, especificações reais, bom pós-venda e ferramentas escolhidas pelo trabalho que resolvem,
            não pela categoria de marketing.
          </p>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} REJENDARI · {t("footer.rights")}</p>
          <p>Portugal / UE · {t("footer.contactNote")}</p>
        </div>
      </div>
    </footer>
  );
}
