// Premium feature gating - will wire to RevenueCat later
const PREMIUM_KEY = "ftt_premium";
export const isPremium = () => localStorage.getItem(PREMIUM_KEY) === "true";
export const setPremium = (val) => localStorage.setItem(PREMIUM_KEY, val ? "true" : "false");
export const FREE_PROJECT_LIMIT = 3;
export const PREMIUM_FEATURES = ["invoices", "csv_export", "unlimited_projects"];
