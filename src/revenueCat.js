import { Purchases } from "@revenuecat/purchases-capacitor";
import { Capacitor } from "@capacitor/core";

const API_KEY = "NEEDS_KEY"; // Replace with real RevenueCat API key

let initialized = false;

export async function initRevenueCat() {
  if (!Capacitor.isNativePlatform() || initialized) return;
  try {
    await Purchases.configure({ apiKey: API_KEY });
    initialized = true;
    console.log("RevenueCat initialized");
  } catch (e) {
    console.warn("RevenueCat init failed:", e);
  }
}

export async function checkPremium() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active["premium"] !== undefined;
  } catch (e) {
    console.warn("RevenueCat check failed:", e);
    return false;
  }
}

export async function purchasePremium() {
  if (!Capacitor.isNativePlatform()) throw new Error("Not on native");
  const { offerings } = await Purchases.getOfferings();
  const pkg = offerings.current?.availablePackages?.[0];
  if (!pkg) throw new Error("No packages available");
  const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
  return customerInfo.entitlements.active["premium"] !== undefined;
}

export async function restorePurchases() {
  if (!Capacitor.isNativePlatform()) return false;
  const { customerInfo } = await Purchases.restorePurchases();
  return customerInfo.entitlements.active["premium"] !== undefined;
}
