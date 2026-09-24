import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export function SiteFooter() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">Rejendarī</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>
        <div>
          <p className="tech-label text-muted-foreground">{t("footer.shopLinks")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/shop" className="text-muted-foreground hover:text-foreground">{t("nav.shop")}</Link></li>
            <li><Link to="/packs" className="text-muted-foreground hover:text-foreground">{t("nav.packs")}</Link></li>
            <li><Link to="/pontos" className="text-muted-foreground hover:text-foreground">{t("nav.points")}</Link></li>
            <li><Link to="/marcas" className="text-muted-foreground hover:text-foreground">{t("nav.brands")}</Link></li>
            <li><Link to="/b2b" className="text-muted-foreground hover:text-foreground">{t("nav.b2b")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="tech-label text-muted-foreground">{t("footer.legal")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/legal" className="text-muted-foreground hover:text-foreground">{t("legal.terms")}</Link></li>
            <li><Link to="/legal" className="text-muted-foreground hover:text-foreground">{t("legal.privacy")}</Link></li>
            <li><Link to="/legal" className="text-muted-foreground hover:text-foreground">{t("legal.returns")}</Link></li>
            <li><Link to="/legal" className="text-muted-foreground hover:text-foreground">{t("legal.raffle")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} Rejendarī. {t("footer.rights")}</p>
          <p>{t("footer.contactNote")}</p>
        </div>
      </div>
    </footer>
  );
}
