import { Capacitor } from "@capacitor/core";
import { checkPremium as rcCheckPremium, purchasePremium as rcPurchase, restorePurchases as rcRestore } from "./revenueCat";

const PREMIUM_KEY = "ftt_premium";

export const isPremium = () => localStorage.getItem(PREMIUM_KEY) === "true";
export const setPremium = (val) => localStorage.setItem(PREMIUM_KEY, val ? "true" : "false");
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
