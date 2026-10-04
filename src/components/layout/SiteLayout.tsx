import { Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WaitlistBanner } from "@/components/layout/WaitlistBanner";
import { IntroSplash } from "@/components/brand/IntroSplash";
import { SITE_OPEN } from "@/lib/site-config";
import { useCartSync } from "@/hooks/useCartSync";
import { ReferralCapture } from "@/components/layout/ReferralCapture";

export function SiteLayout() {
  useCartSync();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <IntroSplash />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-background focus:p-4 focus:text-foreground"
      >
        Saltar para o conteúdo
      </a>
      <Toaster position="top-center" richColors />
      <ReferralCapture />
      {!SITE_OPEN && <WaitlistBanner />}
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
