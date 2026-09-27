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

  const { error } = await supabase.rpc("claim_referral", { p_code: code });
  if (!error) clearRememberedReferralCode();
}

export function ReferralCapture() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("ref");

    if (code) {
      rememberReferralCode(code);
      url.searchParams.delete("ref");
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    }

    const claim = () => { void claimStoredReferral().catch(() => { /* Keep the code for a later session when the network recovers. */ }); };
    claim();

    let timer: ReturnType<typeof setTimeout> | undefined;
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        clearTimeout(timer);
        timer = setTimeout(claim, 0);
      }
    });

    return () => { clearTimeout(timer); subscription.subscription.unsubscribe(); };
  }, []);

  return null;
}
