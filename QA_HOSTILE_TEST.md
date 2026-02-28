# Freelancer TT — Hostile User Test Report

**Date:** 2026-02-27  
**Tester:** Isaiah  
**Commit:** 0d6d575  

---

## 1. Timer Abuse

| Test | Result | Fix |
|------|--------|-----|
| Rapid start/stop (mashing button) | **P1 FIXED** | 500ms debounce via ref on start/stop |
| Multiple timers | **PASS** | Single timer state by design — no issue |
| Timer running 24+ hours | **P0 FIXED** | Duration capped at 24h, description appended with "(capped at 24h)" |

## 2. Garbage Input

| Test | Result | Fix |
|------|--------|-----|
| Empty project/client names | **PASS** | Already guarded (`.trim()` check) |
| Special chars (`<script>`, `"`, `'`) | **PASS** | React auto-escapes JSX. Store sanitizes control chars. |
| 500+ char names | **P1 FIXED** | `maxLength={200}` on inputs + `sanitizeString()` in store caps at 200 |
| Emojis (🔥🎯💰) | **PASS** | Preserved — sanitizeString strips control chars but keeps unicode |

## 3. Invoice Edge Cases

| Test | Result | Fix |
|------|--------|-----|
| 0-hour invoice | **PASS** | UI hides generate button when no entries match |
| Negative rates | **P1 FIXED** | Rate clamped to 0-9999 in saveProject |
| $0 rate | **PASS** | Valid use case (pro bono work) — shows $0.00 correctly |
| $99999 rate | **P1 FIXED** | Capped at $9999/hr |
| Invoice with no entries | **PASS** | Generate button doesn't render |
| Negative tax rate | **P1 FIXED** | Tax clamped to 0-100% in generatePDF |

## 4. Date Handling

| Test | Result | Fix |
|------|--------|-----|
| Future dates (manual entry) | **P1 FIXED** | `max` attr set to 1 year from today |
| Invalid dates | **PASS** | Browser `<input type="date">` rejects invalid dates natively |
| Timezone edge cases | **PASS** | Dates stored as `YYYY-MM-DD` strings, display uses `T12:00:00` noon anchor to avoid midnight rollover |

## 5. Export

| Test | Result | Fix |
|------|--------|-----|
| PDF with 0 entries | **PASS** | Button hidden when no entries |
| PDF with many entries | **PASS** | `buildPDF` handles page breaks at y>260 |
| CSV export | **N/A** | Premium-gated, not yet implemented as standalone export |

## 6. Premium Gate

| Test | Result | Fix |
|------|--------|-----|
| `localStorage.setItem('ftt_premium','true')` bypass | **P1 FIXED** | Key renamed to `ftt_ux_cfg`, value is base64-encoded token (`btoa("premium_active_" + timestamp)`). Old key no longer works. |
| Determined reverse-engineering | **ACCEPTABLE** | Client-side premium is inherently bypassable. RevenueCat server check on native platform is the real gate. Web is demo-only. |

## 7. Storage

| Test | Result | Fix |
|------|--------|-----|
| localStorage corruption (invalid JSON) | **PASS** | `get()` already has try/catch returning `[]` |
| Quota exceeded | **P0 FIXED** | `set()` wrapped in try/catch, logs error instead of crashing |
| Missing keys | **PASS** | All getters default to `[]` or `null` |

---

## Summary

| Severity | Found | Fixed |
|----------|-------|-------|
| **P0** | 2 | 2 |
| **P1** | 6 | 6 |
| **P2** | 0 | 0 |

**All P0/P1 issues fixed.** Build passes. Committed as `0d6d575`.
