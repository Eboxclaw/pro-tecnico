import { Link, useNavigate } from "@tanstack/react-router";
import { Gift, LogOut, ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useT, useLocale, type Locale } from "@/lib/i18n";
import { useCartStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";

const LANGS: { id: Locale; label: string }[] = [
  { id: "pt", label: "PT" },
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
];

const CATEGORIES: Array<{ label: string; jp: string; task: string; icon: ToolGlyphName }> = [
  { label: "Precisão & eletrónica", jp: "精密工具", task: "precision", icon: "precision" },
  { label: "Chaves, bits & aperto", jp: "締結工具", task: "fastening", icon: "driver" },
  { label: "Roquetes & sockets", jp: "ソケット", task: "sockets", icon: "socket" },
  { label: "Alicates & chaves", jp: "作業工具", task: "grip", icon: "grip" },
  { label: "Corte & lâminas", jp: "切削工具", task: "cutting", icon: "cut" },
  { label: "AVAC & instalação", jp: "設備工具", task: "hvac", icon: "hvac" },
  { label: "Máquinas 18V+", jp: "電動工具", task: "power", icon: "power" },
];

export function SiteHeader() {
  const t = useT();
  const navigate = useNavigate();
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  const items = useCartStore((s) => s.items);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") setSignedIn(true);
      if (event === "SIGNED_OUT") {
        setSignedIn(false);
        navigate({ to: "/" });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const nav = [
    { to: "/shop", label: t("nav.shop") },
    { to: "/marcas", label: t("nav.brands") },
    { to: "/packs", label: t("nav.packs") },
    { to: "/pontos", label: t("nav.points") },
    { to: "/b2b", label: t("nav.b2b") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/94 backdrop-blur-xl supports-[backdrop-filter]:bg-background/82">
      <div className="border-b border-border/70 bg-black/20">
        <div className="mx-auto flex h-7 max-w-[1440px] items-center justify-between px-4 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground sm:px-6">
          <span>Curadoria em Portugal · Ferramenta profissional japonesa</span>
          <span className="hidden sm:inline">Origem da marca ≠ país de fabrico · verificado por SKU</span>
        </div>
      </div>

      <div className="mx-auto flex h-[70px] max-w-[1440px] items-center gap-5 px-4 sm:px-6">
        <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="REJENDARI">
          <img
            src={logo}
            alt="REJENDARI"
            className="h-10 w-auto rounded-sm transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <span className="hidden border-l border-border pl-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground xl:block">
            ferramentas
            <br />
            escolhidas
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
              <span className="absolute inset-x-3 -bottom-[24px] h-px scale-x-0 bg-primary transition-transform [.active_&]:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            to="/pontos"
            className="hidden items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground md:flex"
          >
            <Gift className="h-3.5 w-3.5 text-primary" />
            Pontos / convites
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="font-mono text-[10px] tracking-[0.16em]">
                {locale.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGS.map((lang) => (
                <DropdownMenuItem
                  key={lang.id}
                  onClick={() => setLocale(lang.id)}
                  className={lang.id === locale ? "bg-secondary" : ""}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {signedIn ? (
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" aria-label={t("nav.account")} asChild>
                <Link to="/conta">
                  <User className="h-4.5 w-4.5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("nav.signOut")}
                onClick={() => supabase.auth.signOut()}
              >
                <LogOut className="h-4.5 w-4.5" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <Link to="/auth">{t("nav.signIn")}</Link>
            </Button>
          )}

          <CartDrawer
            trigger={
              <Button variant="outline" size="sm" className="relative gap-2 border-border bg-transparent">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden xl:inline">{t("common.cart")}</span>
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
            }
          />
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-[1440px] items-stretch overflow-x-auto px-2 sm:px-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.task}
              to="/shop"
              search={{ task: category.task }}
              className="group flex min-w-max items-center gap-2.5 border-r border-border/60 px-3 py-2.5 text-[11px] text-muted-foreground transition-colors first:border-l hover:bg-secondary/70 hover:text-foreground xl:flex-1 xl:justify-center"
            >
              <ToolGlyph
                name={category.icon}
                className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary"
              />
              <span className="flex items-baseline gap-2">
                <span>{category.label}</span>
                <span className="hidden font-display text-[9px] tracking-[0.04em] text-muted-foreground/55 2xl:inline">{category.jp}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border/60 px-4 py-2 lg:hidden">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="whitespace-nowrap px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
        {!signedIn && (
          <Link to="/auth" className="whitespace-nowrap px-2.5 py-1 text-xs text-primary">
            {t("nav.signIn")}
          </Link>
        )}
      </nav>
    </header>
  );
}
