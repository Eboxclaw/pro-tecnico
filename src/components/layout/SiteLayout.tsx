import { Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WaitlistBanner } from "@/components/layout/WaitlistBanner";
import { SITE_OPEN } from "@/lib/site-config";
import { useCartSync } from "@/hooks/useCartSync";

export function SiteLayout() {
  useCartSync();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Toaster position="top-center" richColors />
      {!SITE_OPEN && <WaitlistBanner />}
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
