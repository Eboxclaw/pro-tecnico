import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  clearRememberedReferralCode,
  getRememberedReferralCode,
  rememberReferralCode,
} from "@/lib/referrals";

async function claimStoredReferral() {
  const code = getRememberedReferralCode();
  if (!code) return;

  const { data } = await supabase.auth.getSession();
  if (!data.session) return;

  const { data: claimed, error } = await supabase.rpc("claim_referral", { p_code: code });
  if (!error && claimed) clearRememberedReferralCode();
}

export function ReferralCapture() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("ref");

    if (code) {
      rememberReferralCode(code);
      url.searchParams.delete("ref");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }

    void claimStoredReferral();

    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") void claimStoredReferral();
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  return null;
}
