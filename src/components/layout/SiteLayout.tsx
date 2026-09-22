import { useEffect, useState } from "react";
import { Link, useLocation, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteGate } from "@/components/layout/SiteGate";
import { SITE_OPEN } from "@/lib/site-config";
import { useCartSync } from "@/hooks/useCartSync";

export function SiteLayout() {
  useCartSync();
  const location = useLocation();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem("protecnico-gate") === "open");
  }, []);

  const gateVisible = !SITE_OPEN && !unlocked;
  useEffect(() => {
    if (gateVisible) window.scrollTo(0, 0);
  }, [gateVisible, location.pathname]);

  if (gateVisible) return <SiteGate onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Toaster position="top-center" richColors />
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
