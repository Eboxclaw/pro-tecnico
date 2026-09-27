export const REFERRAL_STORAGE_KEY = "rejendari_referral_code";

export function normalizeReferralCode(value: string | null | undefined) {
  return value?.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32) ?? "";
}

let sessionCode = "";

export function rememberReferralCode(value: string | null | undefined) {
  if (typeof window === "undefined") return "";
  const code = normalizeReferralCode(value);
  if (code) {
    sessionCode = code;
    try { window.localStorage.setItem(REFERRAL_STORAGE_KEY, code); } catch { /* Storage can be disabled. Keep the code in this session. */ }
  }
  return code;
}

export function getRememberedReferralCode() {
  if (typeof window === "undefined") return "";
  try { return normalizeReferralCode(window.localStorage.getItem(REFERRAL_STORAGE_KEY)) || sessionCode; } catch { return sessionCode; }
}

export function clearRememberedReferralCode() {
  if (typeof window === "undefined") return;
  sessionCode = "";
  try { window.localStorage.removeItem(REFERRAL_STORAGE_KEY); } catch { /* Storage is unavailable. */ }
}

export function buildReferralLink(code: string) {
  if (typeof window === "undefined") return "/?ref=" + encodeURIComponent(code);
  return window.location.origin + "/?ref=" + encodeURIComponent(code);
}
