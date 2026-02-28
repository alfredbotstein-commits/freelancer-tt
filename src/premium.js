import { Capacitor } from "@capacitor/core";
import { checkPremium as rcCheckPremium, purchasePremium as rcPurchase, restorePurchases as rcRestore } from "./revenueCat";

const PREMIUM_KEY = "ftt_ux_cfg";
const PREMIUM_PREFIX = "premium_active_";

export const isPremium = () => {
  const val = localStorage.getItem(PREMIUM_KEY);
  if (!val) return false;
  try {
    return atob(val).startsWith(PREMIUM_PREFIX);
  } catch { return false; }
};
export const setPremium = (val) => {
  if (val) {
    localStorage.setItem(PREMIUM_KEY, btoa(PREMIUM_PREFIX + Date.now()));
  } else {
    localStorage.removeItem(PREMIUM_KEY);
  }
};
export const FREE_PROJECT_LIMIT = 3;
export const PREMIUM_FEATURES = ["invoices", "csv_export", "unlimited_projects"];

export async function syncPremiumStatus() {
  if (!Capacitor.isNativePlatform()) return isPremium();
  const active = await rcCheckPremium();
  setPremium(active);
  return active;
}

export async function buyPremium() {
  const success = await rcPurchase();
  if (success) setPremium(true);
  return success;
}

export async function restorePremium() {
  const success = await rcRestore();
  if (success) setPremium(true);
  return success;
}
