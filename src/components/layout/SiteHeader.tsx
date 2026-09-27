import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Gift, LogOut, ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { useCartStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";
import { Button } from "@/components/ui/button";
import { RejendariLogo } from "@/components/brand/RejendariLogo";
import { JAPAN_TOOL_REFERENCES, QUICK_BRANDS, QUICK_FOCUS, referencesForTask } from "@/data/curated-tool-references";
import { BRAND_STORY_MAP } from "@/data/brand-stories";

const CATEGORIES: Array<{ label: string; jp: string; task: "precision" | "fastening" | "sockets" | "grip" | "cutting" | "hvac" | "power"; icon: ToolGlyphName }> = [
  { label: "Precisão & eletrónica", jp: "精密工具", task: "precision", icon: "precision" },
  { label: "Chaves, bits & aperto", jp: "締結工具", task: "fastening", icon: "driver" },
  { label: "Roquetes & sockets", jp: "ソケット", task: "sockets", icon: "socket" },
  { label: "Alicates & chaves", jp: "作業工具", task: "grip", icon: "grip" },
  { label: "Corte & lâminas", jp: "切削工具", task: "cutting", icon: "cut" },
  { label: "AVAC & instalação", jp: "設備工具", task: "hvac", icon: "hvac" },
  { label: "Máquinas 18V+", jp: "電動工具", task: "power", icon: "power" },
];

const TOP_REFERENCE_IDS = ["anex-397-d", "vessel-220usb-s1eb", "top-hm32", "tsunoda-wp250sc"];

export function SiteHeader() {
  const t = useT();
  const navigate = useNavigate();
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
  const allQuickRefs = CATEGORIES.flatMap((category) => referencesForTask(category.task));
  const topRefs = TOP_REFERENCE_IDS
    .map((id) => allQuickRefs.find((tool) => tool.id === id))
    .filter(Boolean);

  const mobileNav = [
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
          <span>JAPAN FIRST · PORTUGAL READY</span>
          <span className="hidden sm:inline">{JAPAN_TOOL_REFERENCES.length} referências · métrico primeiro · códigos oficiais</span>
        </div>
      </div>

      <div className="mx-auto flex h-[70px] max-w-[1440px] items-center gap-5 px-4 sm:px-6">
        <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="REJENDARI">
          <RejendariLogo compact className="sm:hidden" />
          <RejendariLogo className="hidden transition-transform duration-300 group-hover:scale-[1.015] sm:flex" />
          <span className="hidden border-l border-border pl-3 font-mono text-[8px] uppercase tracking-[0.17em] text-muted-foreground 2xl:block">
            selecionar × explicar
            <br />
            usar × confiar
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <div className="group/nav relative">
            <Link
              to="/shop"
              className="relative flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {t("nav.shop")}
              <ChevronDown className="h-3.5 w-3.5" />
              <span className="absolute inset-x-3 -bottom-[24px] h-px scale-x-0 bg-primary transition-transform [.active_&]:scale-x-100" />
            </Link>

            <div className="invisible absolute left-[-180px] top-full z-[80] w-[760px] pt-5 opacity-0 transition-all duration-150 group-hover/nav:visible group-hover/nav:opacity-100">
              <div className="grid grid-cols-[1.1fr_0.9fr] border border-border bg-background shadow-[0_24px_70px_rgba(35,30,25,0.2)]">
                <div className="p-5">
                  <p className="jp-label text-primary">仕事別 · filtros rápidos</p>
                  <div className="mt-4 flex flex-wrap gap-2 border-b border-border pb-4">
                    {QUICK_FOCUS.map((focus) => (
                      <Link
                        key={focus.id}
                        to="/shop"
                        search={{ focus: focus.id }}
                        className="border border-border bg-[#24211d] px-3 py-2 text-[10px] font-medium text-white/75 transition-colors hover:border-primary hover:text-white"
                      >
                        {focus.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.task}
                        to="/shop"
                        search={{ task: category.task }}
                        className="group flex items-center gap-3 border border-border bg-card p-3 transition-colors hover:border-primary/55 hover:bg-secondary"
                      >
                        <ToolGlyph name={category.icon} className="h-5 w-5 text-primary" />
                        <span>
                          <span className="block text-xs font-medium">{category.label}</span>
                          <span className="jp-label mt-0.5 block text-[8px] text-muted-foreground">{category.jp}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-l border-border bg-surface p-5">
                  <p className="jp-label text-primary">注目 · referências rápidas</p>
                  <div className="mt-4 space-y-2">
                    {topRefs.map((tool) => tool && (
                      <Link
                        key={tool.id}
                        to="/referencia/$id"
                        params={{ id: tool.id }}
                        className="flex items-start justify-between gap-3 border-b border-border py-2.5 text-xs last:border-0 hover:text-primary"
                      >
                        <span>
                          <span className="block font-medium">{tool.brand} · {tool.model}</span>
                          <span className="mt-0.5 block text-[10px] text-muted-foreground">{tool.namePt}</span>
                        </span>
                        <span className="font-mono text-[8px] text-muted-foreground">{tool.specPt ?? "→"}</span>
                      </Link>
                    ))}
                  </div>
                  <Link to="/shop" className="mt-4 inline-flex text-xs font-medium text-primary">
                    Ver catálogo completo →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="group/nav relative">
            <Link
              to="/marcas"
              className="relative flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {t("nav.brands")}
              <ChevronDown className="h-3.5 w-3.5" />
              <span className="absolute inset-x-3 -bottom-[24px] h-px scale-x-0 bg-primary transition-transform [.active_&]:scale-x-100" />
            </Link>

            <div className="invisible absolute left-[-120px] top-full z-[80] w-[680px] pt-5 opacity-0 transition-all duration-150 group-hover/nav:visible group-hover/nav:opacity-100">
              <div className="border border-border bg-background p-5 shadow-[0_24px_70px_rgba(35,30,25,0.2)]">
                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p className="jp-label text-primary">ブランド · escolher por marca</p>
                    <p className="mt-2 text-sm text-muted-foreground">Entra diretamente na história e nas referências de cada fabricante.</p>
                  </div>
                  <Link to="/marcas" className="text-xs font-medium text-primary">Todas →</Link>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {QUICK_BRANDS.slice(0, 12).map((brand) => {
                    const story = BRAND_STORY_MAP[brand];
                    return (
                      <Link
                        key={brand}
                        to="/marcas"
                        search={{ brand }}
                        className="border border-border bg-card p-3 transition-colors hover:border-primary/55 hover:bg-secondary"
                      >
                        <span className="block font-display text-sm font-semibold">{story?.name ?? brand}</span>
                        <span className="mt-1 block text-[9px] leading-4 text-muted-foreground">{story?.specialty ?? "Ferramenta profissional japonesa"}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <Link to="/packs" className="relative px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground">
            {t("nav.packs")}
          </Link>
          <Link to="/pontos" className="relative px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground">
            {t("nav.points")}
          </Link>
          <Link to="/b2b" className="relative px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground">
            {t("nav.b2b")}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            to="/pontos"
            className="hidden items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground md:flex"
          >
            <Gift className="h-3.5 w-3.5 text-primary" />
            Pontos & vantagens
          </Link>

          {signedIn ? (
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" aria-label={t("nav.account")} asChild>
                <Link to="/conta"><User className="h-4.5 w-4.5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" aria-label={t("nav.signOut")} onClick={() => supabase.auth.signOut()}>
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

      <div className="hidden border-t border-border/70 lg:block">
        <div className="mx-auto flex max-w-[1440px] items-stretch px-4">
          {CATEGORIES.map((category, index) => {
            const quickProducts = referencesForTask(category.task).slice(0, 4);
            const alignRight = index >= 5;
            return (
              <div key={category.task} className="group/cat relative flex-1">
                <Link
                  to="/shop"
                  search={{ task: category.task }}
                  className="flex h-full items-center justify-center gap-2.5 border-r border-border/60 px-3 py-2.5 text-[11px] text-muted-foreground transition-colors first:border-l hover:bg-secondary/70 hover:text-foreground"
                >
                  <ToolGlyph name={category.icon} className="h-4 w-4 text-muted-foreground transition-colors group-hover/cat:text-primary" />
                  <span>{category.label}</span>
                </Link>

                {quickProducts.length > 0 && (
                  <div className={`invisible absolute top-full z-[75] w-[360px] pt-1 opacity-0 transition-all duration-150 group-hover/cat:visible group-hover/cat:opacity-100 ${alignRight ? "right-0" : "left-0"}`}>
                    <div className="border border-border bg-background p-4 shadow-[0_18px_50px_rgba(35,30,25,0.18)]">
                      <div className="flex items-center justify-between">
                        <p className="jp-label text-primary">{category.jp} · rápido</p>
                        <Link to="/shop" search={{ task: category.task }} className="text-[10px] font-medium text-primary">Ver todos →</Link>
                      </div>
                      <div className="mt-3 divide-y divide-border">
                        {quickProducts.map((tool) => (
                          <Link
                            key={tool.id}
                            to="/referencia/$id"
                            params={{ id: tool.id }}
                            className="flex items-center justify-between gap-3 py-2.5 text-xs hover:text-primary"
                          >
                            <span>
                              <span className="block font-medium">{tool.brand} {tool.model}</span>
                              <span className="mt-0.5 block text-[10px] text-muted-foreground">{tool.namePt}</span>
                            </span>
                            <span className="font-mono text-[8px] text-muted-foreground">{tool.specPt ?? "→"}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-stretch overflow-x-auto border-t border-border/70 lg:hidden">
        {CATEGORIES.map((category) => (
          <Link
            key={category.task}
            to="/shop"
            search={{ task: category.task }}
            className="flex min-w-max items-center gap-2.5 border-r border-border/60 px-3 py-2.5 text-[11px] text-muted-foreground"
          >
            <ToolGlyph name={category.icon} className="h-4 w-4 text-primary" />
            <span>{category.label}</span>
          </Link>
        ))}
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border/60 px-4 py-2 lg:hidden">
        {mobileNav.map((item) => (
          <Link key={item.to} to={item.to} className="whitespace-nowrap px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground">
            {item.label}
          </Link>
        ))}
        {!signedIn && (
          <Link to="/auth" className="whitespace-nowrap px-2.5 py-1 text-xs text-primary">{t("nav.signIn")}</Link>
        )}
      </nav>
    </header>
  );
}
