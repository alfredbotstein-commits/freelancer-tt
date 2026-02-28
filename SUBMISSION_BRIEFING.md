# 📋 Submission Briefing — freelancer-tt
Generated: 2026-02-28
Bundle ID: NOT SET

---

## 1. App Store Connect Metadata

### Basic Info
| Field | Value |
|-------|-------|
| App Name | freelancer-tt |
| Bundle ID | ⚠️ NOT SET |
| Version | 0.0.0 |
| Build Number | 1 |
| SKU | freelancer-tt |
| Primary Category | Utilities |
| Secondary Category | Lifestyle |
| Price | Free (with IAP) |
| Age Rating | 4+ (with in-app purchases) |

### Description (from store listing)
**The simple, powerful time tracker designed specifically for freelancers and independent contractors.**

Stop losing billable hours. Freelance Timer helps you accurately track every minute of client work, organize projects, and generate professional invoices—all from your phone....

### Keywords (100 chars max for iOS)
freelancer, time tracker, invoice, billable hours, project management, hourly rate, time tracking, invoice generator, freelance, contractor, consultant, billing, work hours, productivity

### What's New
Initial release.

---

## 2. Screenshot Spec Sheet

### iOS Required Sizes
| Device | Size (px) | Count Needed |
|--------|-----------|-------------|
| iPhone 6.7" (15 Pro Max) | 1290 × 2796 | 4-10 |
| iPhone 6.5" (11 Pro Max) | 1242 × 2688 | 4-10 |
| iPhone 5.5" (8 Plus) | 1242 × 2208 | 4-10 |
| iPad 12.9" (6th gen) | 2048 × 2732 | 4-10 |
| iPad 12.9" (2nd gen) | 2048 × 2732 | 4-10 |

### Android Required Sizes  
| Type | Size (px) | Count |
|------|-----------|-------|
| Phone | 1080 × 1920 (min) | 4-8 |
| 7" Tablet | 1200 × 1920 | 1-8 |
| 10" Tablet | 1920 × 1200 | 1-8 |
| Feature Graphic | 1024 × 500 | 1 |

### Screenshot Scenes to Capture
1. **Hero/Splash** — App logo + tagline, clean gradient background
2. **Core Feature** — Main screen showing primary functionality in use
3. **Key Differentiator** — The feature that makes this better than competitors
4. **Data/Progress** — Charts, history, or progress tracking
5. **Settings** — Customization options
6. **Achievement** — Completion or success state

---

## 3. Privacy Questionnaire (Pre-Answered)

### Data Collection
| Question | Answer |
|----------|--------|
| Do you collect data? | No — all data stored locally on device |
| Data linked to identity? | No |
| Data used for tracking? | No |
| Analytics collected? | Yes (anonymous usage) |

### Permissions Used
- None detected

### Privacy Policy URL
⚠️ Required: https://freelancer-tt.app/privacy
(Must be live before submission)

---

## 4. Content Rating Questionnaire

### Apple
| Question | Answer |
|----------|--------|
| Made for Kids? | No |
| Cartoon/Fantasy Violence | None |
| Realistic Violence | None |
| Sexual Content | None |
| Profanity | None |
| Drug/Alcohol Reference | None |
| Gambling | None |
| Horror/Fear | None |
| Medical/Treatment | None |
| Unrestricted Web Access | No |

### Google Play
- Content Rating: Everyone
- Interactive Elements: Digital Purchases

---

## 5. In-App Purchases (RevenueCat)


| Platform | Product ID | Type | Price |
|----------|-----------|------|-------|
| iOS | ⚠️ Create in App Store Connect | Auto-renewable sub | $X.XX/mo |
| Android | ⚠️ Create in Google Play Console | Subscription | $X.XX/mo |

### RevenueCat Setup
- [ ] Create products in App Store Connect
- [ ] Create products in Google Play Console  
- [ ] Configure offerings in RevenueCat dashboard
- [ ] Set API keys (currently: NOT SET)
- [ ] Test sandbox purchases


---

## 6. Pre-Submission Checklist

### Apple App Store
- [ ] App Store Connect account active
- [ ] Bundle ID registered in Apple Developer Portal
- [ ] Provisioning profile created (distribution)
- [ ] App icon (1024×1024, no alpha, no rounded corners)
- [ ] Screenshots for all required device sizes
- [ ] App description (min 10 chars, max 4000)
- [ ] Keywords (max 100 chars, comma-separated)
- [ ] Privacy policy URL (LIVE and accessible)
- [ ] Support URL
- [ ] Age rating questionnaire completed
- [ ] [ ] IAP products created and approved
- [ ] [ ] Subscription terms in app description
- [ ] Build uploaded via Xcode or Transporter
- [ ] Build processed (wait ~15 min after upload)
- [ ] Export compliance (uses encryption? Most apps: NO)

### Google Play Store
- [ ] Google Play Developer account ($25 one-time)
- [ ] App signing key enrolled in Google Play App Signing
- [ ] Feature graphic (1024×500)
- [ ] Screenshots for phone + tablet
- [ ] Short description (max 80 chars)
- [ ] Full description (max 4000 chars)
- [ ] Privacy policy URL
- [ ] Content rating questionnaire
- [ ] Target audience declaration
- [ ] [ ] Subscription products created
- [ ] AAB uploaded (Android App Bundle, not APK)
- [ ] Internal testing → Closed testing → Production

---

## 7. Build Commands

```bash
# Build web assets
cd /Users/albert/clawd/freelancer-tt
npm run build

# Sync to native projects
npx cap sync

# iOS: Open in Xcode, archive, upload
npx cap open ios

# Android: Build release AAB
cd android && ./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

*Generated by Submission Briefing v1.0 — Loopspur Factory Tools*
