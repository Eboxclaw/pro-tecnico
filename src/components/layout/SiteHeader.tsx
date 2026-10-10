import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUp, ChevronDown, Gift, LogOut, Menu, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { useCartStore } from "@/stores/cartStore";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ToolGlyph, type ToolGlyphName } from "@/components/brand/ToolGlyph";
import { Button } from "@/components/ui/button";
import { RejendariLogo } from "@/components/brand/RejendariLogo";
import {
  CURATED_TOOL_REFERENCES,
  QUICK_BRANDS,
  QUICK_FOCUS,
  referencesForTask,
} from "@/data/curated-tool-references";
import { BRAND_STORY_MAP } from "@/data/brand-stories";

const CATEGORIES: Array<{
  label: string;
  jp: string;
  task:
    | "precision"
    | "fastening"
    | "sockets"
    | "grip"
    | "cutting"
    | "hvac"
    | "power"
    | "electronics"
    | "ev";
  icon: ToolGlyphName;
}> = [
  { label: "Precisão & slim", jp: "精密工具", task: "precision", icon: "precision" },
  { label: "Chaves, bits & aperto", jp: "締結工具", task: "fastening", icon: "driver" },
  { label: "Roquetes & sockets", jp: "ソケット", task: "sockets", icon: "socket" },
  { label: "Alicates & chaves", jp: "作業工具", task: "grip", icon: "grip" },
  { label: "Corte & lâminas", jp: "切削工具", task: "cutting", icon: "cut" },
  { label: "AVAC & instalação", jp: "設備工具", task: "hvac", icon: "hvac" },
  { label: "Máquinas 18V+", jp: "電動工具", task: "power", icon: "power" },
  { label: "Eletrónica & bancada", jp: "電子工具", task: "electronics", icon: "electronics" },
  { label: "Veículos elétricos", jp: "電気自動車", task: "ev", icon: "ev" },
];

const TOP_REFERENCE_IDS = [
  "anex-397-d",
  "anex-ryujin-artm5-01",
  "anex-adrs-2065",
  "anex-azm-2698",
  "olfa-xh-1",
  "makita-dtd173z",
];

/** Botão global "voltar ao topo": fixo em baixo à direita, aparece após 600px
 *  de scroll e sobe com âncora suave. Montado dentro do SiteHeader (presente
 *  em todas as páginas) — sem tocar em routes. */
function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
      aria-label="Voltar ao topo"
      className="scroll-top-btn animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <ArrowUp className="h-4.5 w-4.5" aria-hidden />
    </button>
  );
}

export function SiteHeader() {
  const t = useT();
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const [signedIn, setSignedIn] = useState(false);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Menu hambúrguer fecha com Escape (acessibilidade de teclado).
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Colapso ao descer com histerese de 24 px: um só sentido conta de cada vez,
  // nada de oscilar com o bounce do scroll. Nunca colapsa perto do topo nem
  // com foco interno (menus, pesquisa, navegação por teclado).
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let compacted = false;
    let anchor = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const active = document.activeElement;
      if (active && active !== document.body && el.contains(active)) {
        anchor = y;
        return;
      }
      if (compacted) {
        anchor = Math.max(anchor, y);
        if (anchor - y > 24) {
          compacted = false;
          setCompact(false);
        }
      } else if (y > 120) {
        anchor = Math.min(anchor, y);
        if (y - anchor > 24) {
          compacted = true;
          setCompact(true);
        }
      } else {
        anchor = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Altura real publicada como --header-h para offsets sticky de outras páginas.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--header-h");
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
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
  const topRefs = TOP_REFERENCE_IDS.map((id) => allQuickRefs.find((tool) => tool.id === id)).filter(
    Boolean,
  );

  // Ordem do cliente: Kits primeiro, Loja em último.
  const mobileNav = [
    { to: "/packs", label: t("nav.packs") },
    { to: "/marcas", label: t("nav.brands") },
    { to: "/anex", label: "ANEX" },
    { to: "/b2b", label: t("nav.b2b") },
    { to: "/pontos", label: t("nav.points") },
    { to: "/shop", label: t("nav.shop") },
  ] as const;

  return (
    <>
      <header
        ref={headerRef}
        data-compact={compact ? true : undefined}
        className="site-header sticky top-0 z-50 border-b border-border bg-background/94 backdrop-blur-xl supports-[backdrop-filter]:bg-background/82"
      >
        <div className="site-topstrip border-b border-border/70 bg-black/20">
          <div className="mono-caps mx-auto flex h-6 max-w-[1440px] items-center justify-between px-4 text-muted-foreground sm:h-7 sm:px-6">
            <span>JAPAN FIRST · PORTUGAL READY</span>
            <span>{CURATED_TOOL_REFERENCES.length} referências</span>
          </div>
        </div>

        <div className="mx-auto flex h-12 max-w-[1440px] items-center gap-5 px-4 sm:h-[70px] sm:px-6">
          <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="REJENDARI">
            <RejendariLogo compact className="sm:hidden" />
            <RejendariLogo className="site-logo hidden transition-transform duration-300 group-hover:scale-[1.015] sm:flex" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              to="/packs"
              className="relative px-3 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {t("nav.packs")}
            </Link>

            <div className="group/nav relative">
              <Link
                to="/marcas"
                className="relative flex items-center gap-1 px-3 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {t("nav.brands")}
                <ChevronDown className="h-3.5 w-3.5" />
                <span className="absolute inset-x-3 -bottom-[24px] h-px scale-x-0 bg-primary transition-transform [.active_&]:scale-x-100" />
              </Link>

              <div className="invisible absolute left-[-120px] top-full z-[80] w-[680px] pt-5 opacity-0 transition-all duration-150 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100">
                <div className="border border-border bg-background p-5 shadow-[0_24px_70px_rgba(35,30,25,0.2)]">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <p className="jp-label text-primary">ブランド · escolher por marca</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Entra diretamente na história e nas referências de cada fabricante.
                      </p>
                    </div>
                    <Link to="/marcas" className="mono-caps text-primary">
                      Todas →
                    </Link>
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
                          <span className="block font-display text-sm font-semibold">
                            {story?.name ?? brand}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                            {story?.specialty ?? "Ferramenta profissional por regime de trabalho"}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/anex"
              className="px-3 py-2 text-[15px] font-semibold text-primary underline-offset-4 hover:underline"
            >
              ANEX
            </Link>
            <Link
              to="/b2b"
              className="relative px-3 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {t("nav.b2b")}
            </Link>

            {/* Loja em último, mantendo o mega-menu funcional. */}
            <div className="group/nav relative">
              <Link
                to="/shop"
                className="relative flex items-center gap-1 px-3 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {t("nav.shop")}
                <ChevronDown className="h-3.5 w-3.5" />
                <span className="absolute inset-x-3 -bottom-[24px] h-px scale-x-0 bg-primary transition-transform [.active_&]:scale-x-100" />
              </Link>

              <div className="invisible absolute left-[-180px] top-full z-[80] w-[760px] pt-5 opacity-0 transition-all duration-150 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100">
                <div className="grid grid-cols-[1.1fr_0.9fr] border border-border bg-background shadow-[0_24px_70px_rgba(35,30,25,0.2)]">
                  <div className="p-5">
                    <p className="jp-label text-primary">仕事別 · filtros rápidos</p>
                    <div className="mt-4 flex flex-wrap gap-2 border-b border-border pb-4">
                      {QUICK_FOCUS.map((focus) => (
                        <Link
                          key={focus.id}
                          to="/shop"
                          search={{ focus: focus.id }}
                          className="border border-border bg-[#1b1917] px-3 py-2 text-xs font-medium text-white/75 transition-colors hover:border-primary hover:text-white"
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
                            <span className="jp-label mt-0.5 block text-muted-foreground">
                              {category.jp}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="border-l border-border bg-surface p-5">
                    <p className="jp-label text-primary">注目 · referências rápidas</p>
                    <div className="mt-4 space-y-2">
                      {topRefs.map(
                        (tool) =>
                          tool && (
                            <Link
                              key={tool.id}
                              to="/referencia/$id"
                              params={{ id: tool.id }}
                              className="flex items-start justify-between gap-3 border-b border-border py-2.5 text-xs last:border-0 hover:text-primary"
                            >
                              <span>
                                <span className="block font-medium">
                                  {tool.brand} · {tool.model}
                                </span>
                                <span className="mt-0.5 block text-xs text-muted-foreground">
                                  {tool.namePt}
                                </span>
                              </span>
                              <span className="mono-caps text-muted-foreground">
                                {tool.specPt ?? "→"}
                              </span>
                            </Link>
                          ),
                      )}
                    </div>
                    <Link to="/shop" className="mono-caps mt-4 inline-flex text-primary">
                      Ver catálogo completo →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 lg:hidden"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X className="h-4.5 w-4.5" aria-hidden />
              ) : (
                <Menu className="h-4.5 w-4.5" aria-hidden />
              )}
            </Button>

            <Link
              to="/pontos"
              className="mono-caps hidden items-center gap-2 rounded-md border border-border px-3 py-2 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground md:flex"
            >
              <Gift className="h-3.5 w-3.5 text-primary" />
              Pontos &amp; vantagens
            </Link>

            {signedIn ? (
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("nav.account")}
                  className="h-11 w-11"
                  asChild
                >
                  <Link to="/conta">
                    <User className="h-4.5 w-4.5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Sair da conta"
                  className="h-11 w-11"
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
                <Button
                  variant="outline"
                  size="sm"
                  className="relative h-11 gap-2 border-border bg-transparent sm:h-10"
                  aria-label={`${t("common.cart")}: ${totalItems} artigos`}
                >
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

        {/* Menu hambúrguer (mobile/tablet): nav de links fora do rail único. */}
        {menuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Menu principal"
            className="border-t border-border/70 bg-background lg:hidden"
          >
            <div className="mx-auto flex max-w-[1440px] flex-col px-4 py-2 sm:px-6">
              {mobileNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center border-b border-border/40 text-[15px] text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                >
                  {item.label}
                </Link>
              ))}
              {signedIn ? (
                <>
                  <Link
                    to="/conta"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-11 items-center border-b border-border/40 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t("nav.account")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      supabase.auth.signOut();
                    }}
                    className="flex min-h-11 items-center text-[15px] text-primary"
                  >
                    Sair da conta
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center text-[15px] text-primary"
                >
                  {t("nav.signIn")}
                </Link>
              )}
            </div>
          </nav>
        )}

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
                    className="flex h-11 items-center justify-center gap-2.5 border-r border-border/60 px-3 text-muted-foreground transition-colors first:border-l hover:bg-secondary/70 hover:text-foreground"
                  >
                    <ToolGlyph
                      name={category.icon}
                      className="h-4 w-4 text-muted-foreground transition-colors group-hover/cat:text-primary"
                    />
                    <span className="mono-caps">{category.label}</span>
                  </Link>

                  {quickProducts.length > 0 && (
                    <div
                      className={`invisible absolute top-full z-[75] w-[360px] pt-1 opacity-0 transition-all duration-150 group-hover/cat:visible group-hover/cat:opacity-100 group-focus-within/cat:visible group-focus-within/cat:opacity-100 ${alignRight ? "right-0" : "left-0"}`}
                    >
                      <div className="border border-border bg-background p-4 shadow-[0_18px_50px_rgba(35,30,25,0.18)]">
                        <div className="flex items-center justify-between">
                          <p className="jp-label text-primary">{category.jp} · rápido</p>
                          <Link
                            to="/shop"
                            search={{ task: category.task }}
                            className="mono-caps font-medium text-primary"
                          >
                            Ver todos →
                          </Link>
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
                                <span className="block font-medium">
                                  {tool.brand} {tool.model}
                                </span>
                                <span className="mt-0.5 block text-xs text-muted-foreground">
                                  {tool.namePt}
                                </span>
                              </span>
                              <span className="mono-caps text-muted-foreground">
                                {tool.specPt ?? "→"}
                              </span>
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

        {/* Mobile/tablet: um só rail de categorias com scroll horizontal e
            indicador visual (degradê na borda direita). Os links de navegação
            vivem no menu hambúrguer. */}
        <nav aria-label="Categorias" className="relative lg:hidden">
          <div className="site-scrollrows flex snap-x snap-mandatory items-stretch overflow-x-auto border-t border-border/70">
            {CATEGORIES.map((category) => (
              <Link
                key={category.task}
                to="/shop"
                search={{ task: category.task }}
                className="flex h-11 min-w-max snap-start items-center gap-2.5 border-r border-border/60 px-3 text-muted-foreground"
              >
                <ToolGlyph name={category.icon} className="h-4 w-4 shrink-0 text-primary" />
                <span className="mono-caps">{category.label}</span>
              </Link>
            ))}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 top-0 w-10 bg-gradient-to-l from-background to-transparent"
          />
        </nav>
      </header>
      {/* Botão global "voltar ao topo" — presente em todas as páginas. */}
      <ScrollTop />
    </>
  );
}
