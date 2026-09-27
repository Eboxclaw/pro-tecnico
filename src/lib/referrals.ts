export const REFERRAL_STORAGE_KEY = "rejendari_referral_code";

export function normalizeReferralCode(value: string | null | undefined) {
  return value?.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32) ?? "";
}

export function rememberReferralCode(value: string | null | undefined) {
  if (typeof window === "undefined") return "";
  const code = normalizeReferralCode(value);
  if (code) window.localStorage.setItem(REFERRAL_STORAGE_KEY, code);
  return code;
}

export function getRememberedReferralCode() {
  if (typeof window === "undefined") return "";
  return normalizeReferralCode(window.localStorage.getItem(REFERRAL_STORAGE_KEY));
}

export function clearRememberedReferralCode() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(REFERRAL_STORAGE_KEY);
}

export function buildReferralLink(code: string) {
  if (typeof window === "undefined") return "/?ref=" + encodeURIComponent(code);
  return window.location.origin + "/?ref=" + encodeURIComponent(code);
}
