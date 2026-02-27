# Freelance Timer — Play Store Submission Checklist

## Build
- [x] Capacitor initialized (com.loopspur.freelancetimer)
- [x] Android platform added
- [x] Vite base set to "./"
- [x] Release APK built (`android/app/build/outputs/apk/release/app-release-unsigned.apk`)
- [ ] APK signed with release keystore
- [ ] AAB (App Bundle) built for Play Store upload

## Features & Gating
- [x] Premium gating on Invoices (upsell card for free users)
- [x] Premium gating on Projects (3 free, unlimited premium)
- [x] localStorage-based premium flag (ready for RevenueCat wiring)
- [ ] RevenueCat SDK integrated with real API key
- [ ] One-time IAP ($3.99) tested end-to-end

## Crash Reporting
- [x] Sentry initialized in main.jsx
- [x] ErrorBoundary wrapping App
- [ ] Replace placeholder DSN with real Sentry DSN

## Store Listing
- [x] STORE_LISTING.md created (title, short desc, full desc, keywords)
- [ ] Screenshots captured (min 5 key screens)
- [ ] Screenshots framed for store
- [ ] Feature graphic (1024x500) created

## Legal
- [x] Privacy policy (docs/privacy-policy.html)
- [x] Terms of service (docs/terms.html)
- [ ] Deploy legal pages to freelancer-tt-legal.netlify.app

## Play Console
- [ ] App created in Google Play Console
- [ ] Content rating questionnaire completed
- [ ] Data safety declaration completed
- [ ] Target audience and content declared
- [ ] Store listing filled in
- [ ] Signed AAB uploaded
- [ ] Internal testing track configured
- [ ] Production release submitted for review
