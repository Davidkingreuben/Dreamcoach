# DREAMBLOCK — localStorage Edition

## Zero Backend. Zero Config. Zero Accounts.

All data saved locally in your browser. Period.

---

## Quick Start

### Run Locally
```bash
cd /sessions/eager-optimistic-ride/mnt/outputs/dreamblock
npm install
npm run dev
# Open http://localhost:3000
```

### Deploy to Vercel (Free)
```bash
1. Push to GitHub
2. Connect to Vercel
3. Auto-deploys
4. Live in 60 seconds
```

**Full deployment guide:** See `DEPLOY.md`

---

## The 5-File Architecture

### 1. Data Layer: `src/lib/storage.ts` (54 lines)
```typescript
// The entire persistence layer
export function saveDream(dream): Dream { ... }
export function getDream(id): Dream | null { ... }
export function getDreams(): Dream[] { ... }
export function deleteDream(id): void { ... }
export function saveCheckin(checkin): CheckIn { ... }
export function getCheckins(): CheckIn[] { ... }
```

**That's it.** Everything else uses these 6 functions.

### 2. Types: `src/lib/types.ts` (102 lines)
```typescript
export interface Dream {
  id: string;
  title: string;
  category: string;
  // ... 20+ fields ...
  created_at: string;
}

export interface CheckIn {
  id: string;
  avoided: string;
  // ... fields ...
  created_at: string;
}
```

### 3. Assessment Flow: `src/app/check/page.tsx` (576 lines)
```typescript
// 15-step assessment form
// Step 0: Dream intake (title, category, timeline, scores)
// Steps 1-5: Resistance interview
// Steps 6-13: Reality check
// Step 14: Processing screen
// → saveDream() → redirect to /results/[id]
```

### 4. Results Display: `src/app/results/[id]/ResultsClient.tsx` (300 lines)
```typescript
// 3 tabs:
// - Assessment (archetype, classification, signals)
// - Next Steps (calibrated actions)
// - Profile (detailed breakdown)
// → Fetches dream from localStorage on mount
```

### 5. Dashboard: `src/app/dashboard/DashboardClient.tsx` (138 lines)
```typescript
// Lists all saved dreams
// Stats: total dreams, check-ins, archetypes
// Filter: sort, delete, view individual assessments
// → Calls getDreams() on mount
```

---

## How Data Flows

```
User fills assessment
        ↓
saveDream() in storage.ts
        ↓
Generates UUID + timestamp
        ↓
JSON.stringify() → localStorage["dreamblock_dreams"]
        ↓
Redirect to /results/[id]
        ↓
getDream(id) in storage.ts
        ↓
JSON.parse() from localStorage
        ↓
Display results
```

---

## Storage Format Example

```javascript
// localStorage["dreamblock_dreams"]
[
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Release an album",
    category: "Music",
    years_delayed: "3–7 years",
    importance: 9,
    pain: 8,
    fear: 7,
    emotion: "fear",
    first_thought: "not_enough",
    stuck_point: "starting",
    protecting: "identity",
    guaranteed_hesitate: "yes",
    physical_constraint: "none",
    time_realistic: "some",
    sacrifice: ["sleep", "social"],
    responsibility_conflict: false,
    realistic_years: "5–10 years",
    willing_to_commit: true,
    true_want: "identity",
    without_reward: false,
    archetype: "Fear of Visibility",
    stuck_phase: "Spark",
    classification: "Viable & Aligned",
    micro_steps: ["Create 30-second voice memo...", "Pick 3 songs..."],
    created_at: "2026-02-26T01:15:30.000Z"
  }
]
```

---

## File Structure

```
dreamblock/
├── src/
│   ├── app/
│   │   ├── page.tsx                    (home, no auth)
│   │   ├── layout.tsx                  (PWA, no auth)
│   │   ├── check/
│   │   │   └── page.tsx                (15-step assessment)
│   │   ├── results/[id]/
│   │   │   ├── page.tsx                (route wrapper)
│   │   │   └── ResultsClient.tsx       (3 tabs display)
│   │   ├── dashboard/
│   │   │   ├── page.tsx                (route wrapper)
│   │   │   └── DashboardClient.tsx     (dream history)
│   │   ├── checkin/
│   │   │   └── page.tsx                (daily check-in)
│   │   └── globals.css
│   ├── lib/
│   │   ├── storage.ts                  (localStorage API)
│   │   ├── types.ts                    (Dream, CheckIn)
│   │   └── logic/
│   │       ├── archetypes.ts           (resistance patterns)
│   │       ├── classification.ts       (dream assessment)
│   │       └── microsteps.ts           (actionable steps)
│   └── components/
│       ├── ShareButton.tsx
│       └── PWARegister.tsx
├── public/
│   ├── manifest.json
│   └── icons/
├── package.json                        (no Supabase!)
├── DEPLOY.md                           (deployment guide)
├── LOCALSTORAGE_MIGRATION.md           (technical details)
└── README_LOCALSTORAGE.md              (this file)
```

---

## What Was Removed

### Supabase
- All auth libraries (`@supabase/ssr`, `@supabase/auth-helpers`)
- Server-side auth middleware
- Auth routes (`/auth/callback`, `/auth/error`)
- Auth components (SignIn modal)
- Environment variables

### Why?
localStorage is already local → no auth needed.

---

## Deployment Checklist

- [x] All Supabase references removed
- [x] localStorage API complete
- [x] All pages converted to client components
- [x] Types updated (no user_id, session_id)
- [x] Assessment saves dreams
- [x] Dashboard displays dreams
- [x] Daily check-in works
- [x] Results page loads from localStorage
- [x] PWA manifest included
- [x] Package.json cleaned up
- [x] Zero environment variables needed

**Ready to deploy.**

---

## Local Testing

### View Stored Data
```javascript
// In browser DevTools Console:
localStorage.getItem("dreamblock_dreams") |> JSON.parse()
// or
JSON.parse(localStorage.getItem("dreamblock_checkins"))
```

### Clear All Data
```javascript
localStorage.clear()
```

### Clear Specific Key
```javascript
localStorage.removeItem("dreamblock_dreams")
```

---

## Size Limits

- **localStorage capacity:** ~5–10MB per domain
- **Average dream size:** ~3–5KB
- **Capacity:** 1000–2000 assessments per domain
- **Check-ins:** Essentially unlimited

**You won't hit limits.**

---

## FAQ

### Can data sync across devices?
No. That's intentional — localStorage is browser-local only. Different browsers, different devices = separate data stores.

### What if user clears cache?
Data is lost. No backup. We mitigate by confirming before delete. Future: add export/import.

### Is this production-ready?
Yes. All code complete, tested, ready to deploy.

### Can I add cloud sync later?
Yes. Optional feature, not required. Users choose.

### What about offline?
Works offline. All data already in browser. Share button won't work offline but that's OK.

---

## Code Examples

### Save a Dream
```typescript
const dreamData = {
  title: "Release an album",
  category: "Music",
  years_delayed: "3–7 years",
  importance: 9,
  pain: 8,
  fear: 7,
  // ... 20+ more fields ...
  archetype: "Fear of Visibility",
  stuck_phase: "Spark",
  classification: "Viable & Aligned",
  micro_steps: ["Record 30 sec...", "Pick 3 songs..."],
};

const saved = saveDream(dreamData);
// Saved dream now has:
// - id: "uuid-here"
// - created_at: "2026-02-26T01:15:30.000Z"
// - saved to localStorage["dreamblock_dreams"]
```

### Load All Dreams
```typescript
const dreams = getDreams();
// Returns array of Dream objects from localStorage
// Empty array [] if none exist

dreams.forEach(dream => {
  console.log(dream.title, dream.archetype);
});
```

### Delete a Dream
```typescript
deleteDream("uuid-here");
// Removes from localStorage["dreamblock_dreams"]
```

### Save a Check-In
```typescript
const checkin = {
  avoided: "Started writing the song",
  resistance_showed: "Perfectionist freeze",
  emotion: "Overwhelm",
  stuck_point: "Starting",
  tiny_step: "Record 30-second voice memo",
};

const saved = saveCheckin(checkin);
// Saved to localStorage["dreamblock_checkins"]
```

---

## Next Steps

### To Deploy
1. Read `DEPLOY.md` for 3 options
2. Fastest: GitHub + Vercel (5 minutes)

### To Understand
1. Read `LOCALSTORAGE_MIGRATION.md` for full technical details
2. Start with `src/lib/storage.ts` (54 lines)
3. Then `src/app/check/page.tsx` (576 lines)

### To Extend
- Add export (JSON download)
- Add import (JSON upload)
- Add optional cloud sync
- Add sharing
- Add analytics

All opt-in, never forced.

---

## Support

**MDN localStorage:** https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

**DevTools:** Chrome/Firefox → Application/Storage → Local Storage

**Deployment:** See `DEPLOY.md`

---

## License

MIT. Use, modify, deploy freely.

---

## That's It.

No backend. No database. No accounts. No complexity.

Just a Next.js app that saves dreams to localStorage.

**Ready to deploy. Ready to understand resistance.**

DREAMBLOCK.
