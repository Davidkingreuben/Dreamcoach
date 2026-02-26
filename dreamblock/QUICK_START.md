# DREAMBLOCK - Quick Start Guide

## What You Have

A complete, production-ready Next.js 14 web app that:
- Guides users through a 15-minute structured dream assessment
- Identifies resistance patterns (8 archetypes)
- Classifies dreams as viable, misaligned, symbolic, or unrealistic
- Provides personalized next steps (micro-steps)
- Tracks daily progress with check-ins
- Works as a PWA (installable, offline support)
- Uses Supabase for auth + database

## Quick Setup (5 minutes)

### 1. Get Supabase Credentials
1. Go to https://supabase.com/dashboard
2. Create a new project
3. Go to Settings > API > Get your:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Anon Public key)

### 2. Create Database Tables
Go to SQL Editor in Supabase and run:

```sql
-- Dreams table
create table dreams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  session_id uuid,
  title text not null,
  category text,
  years_delayed text,
  importance integer,
  pain integer,
  fear integer,
  emotion text,
  first_thought text,
  stuck_point text,
  protecting text,
  guaranteed_hesitate text,
  physical_constraint text,
  time_realistic text,
  sacrifice text[],
  responsibility_conflict boolean,
  realistic_years text,
  willing_to_commit boolean,
  true_want text,
  without_reward boolean,
  archetype text,
  stuck_phase text,
  classification text,
  micro_steps text[],
  created_at timestamp default now()
);

create index dreams_user_id on dreams(user_id);

-- Check-ins table
create table checkins (
  id uuid primary key default gen_random_uuid(),
  dream_id uuid references dreams(id),
  user_id uuid references auth.users(id),
  avoided text,
  resistance_showed text,
  emotion text,
  stuck_point text,
  tiny_step text,
  created_at timestamp default now()
);

create index checkins_user_id on checkins(user_id);
create index checkins_dream_id on checkins(dream_id);
```

### 3. Configure App
```bash
# Copy environment file
cp .env.local.example .env.local

# Edit .env.local and add your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Run Locally
```bash
npm install
npm run dev
```

Open http://localhost:3000

## User Flows

### Flow 1: Anonymous Assessment
1. Home page → "Start a Dream Check"
2. Fill in dream details (15 questions)
3. Get results → Share
4. Results cached in localStorage

### Flow 2: Authenticated User
1. Home → "Log in"
2. Enter email → Check inbox for magic link
3. Click link → Logged in
4. Dashboard shows all past assessments
5. Click assessment to view details
6. Track daily check-ins
7. Sign out via dashboard

### Flow 3: Daily Check-In
1. Results page → "Set a Check-In Reminder"
2. Daily Check-In page appears
3. Answer 5 questions about today's resistance
4. Submitted → Tracked in database

## File Highlights

### 🧠 The Logic
- `src/lib/logic/archetypes.ts` - 8 resistance patterns
- `src/lib/logic/classification.ts` - 4 dream outcomes
- `src/lib/logic/microsteps.ts` - Personalized next steps

### 📱 The Survey
- `src/app/check/page.tsx` - Complete 15-step survey (575 lines)

### 📊 Results Display
- `src/app/results/[id]/ResultsClient.tsx` - 3-tab assessment view

### 🔐 Authentication
- `src/middleware.ts` - Validates auth on every request
- `src/lib/supabase/client.ts` - Browser client
- `src/lib/supabase/server.ts` - Server client
- `src/components/AuthModal.tsx` - Magic link UI

### 🏠 Dashboard
- `src/app/dashboard/` - User's assessment history + patterns

### 📡 API
- All data flows through Supabase REST API
- No custom server routes (except OAuth callback)

## The 8 Resistance Archetypes

1. **Fear of Visibility** - Work exists, but sharing triggers primal fear
2. **Perfectionist Freeze** - Never ready enough (perfection as delay)
3. **Overwhelm Fog** - Sees mountain, not steps
4. **Identity Conflict** - Dream doesn't fit who I am
5. **Fear of Success** - Success would reorganize everything
6. **Shame Loop** - Past failures haunt this attempt
7. **Consistency Collapse** - Starts strong, breaks after 2 weeks
8. **Misalignment** - May be borrowed desire or symbol

## The 4 Dream Classifications

1. **Viable & Aligned** - Real dream, real block is psychological
   - Action: Pursue with micro-steps

2. **Viable but Misaligned** - Real & achievable, but wrong season
   - Action: Defer consciously with review date

3. **Symbolic / Transformable** - What it represents is real, form isn't
   - Action: Reshape into sustainable version

4. **Unrealistic in Current Form** - Can't reconcile with actual life
   - Action: Release and redirect energy

## Personalization

Each archetype gets 4 custom micro-steps based on:
- Dream title & category
- Specific resistance pattern
- Stuck phase (where they get stuck)

Example: "Fear of Visibility" person working on "Release an Album"
gets steps like:
1. Write about it privately (no audience)
2. Share with one trusted person only
3. Make something deliberately imperfect
4. Write down the specific fear that appears

## Styling

- **Dark mode**: All dark with bright text
- **No external images**: Uses Unicode symbols + colors
- **Mobile-first**: Optimized for 430px viewport
- **Tailwind**: Utility classes for spacing
- **CSS-in-JS**: Inline styles for critical UI
- **Colors**: Brand colors defined in `globals.css`

## Storage

**Supabase Database**: Authenticated user assessments + check-ins
**localStorage**: Anonymous session assessments (fallback)

One user can have multiple dreams assessed over time.
Each dream can have many check-ins tracking daily resistance.

## Going Live

### On Vercel (Recommended)
1. Push code to GitHub
2. Go to vercel.com/new
3. Import repository
4. Add environment variables
5. Deploy (takes 2 minutes)

### On Your Server
```bash
npm run build
npm run start
```

Then use PM2, Docker, or systemd to keep it running.

## Customization

### Brand Colors
Edit `src/app/globals.css` and `tailwind.config.ts`

### Survey Questions
Edit `src/app/check/page.tsx` (search for `resistanceQs` and `realityQs`)

### Archetype Text
Edit `src/lib/logic/archetypes.ts` (ARCHETYPE_INFO object)

### Classification Text
Edit `src/lib/logic/classification.ts` (CLASSIFICATION_INFO object)

### Micro-Steps
Edit `src/lib/logic/microsteps.ts` (getMicroSteps function)

## Troubleshooting

**App not starting?**
```bash
npm install
npm run dev
```

**Database errors?**
- Check tables created in Supabase
- Check environment variables in .env.local
- Check network connection to Supabase

**Auth not working?**
- Check Supabase project has Auth enabled (default: yes)
- Check magic link URL points to your app domain
- Check email reaches inbox (check spam!)

**Icons missing?**
- Add PNG files to `public/icons/`
- See `public/icons/README.md` for details

## Next Steps

1. Customize brand colors & archetype text
2. Add app icons to `public/icons/`
3. Deploy to Vercel
4. Share the link
5. Monitor user patterns in Supabase dashboard

---

**Questions?** Review the detailed docs:
- `README.md` - Overview
- `DEPLOYMENT.md` - Full deployment guide
- `PROJECT_STRUCTURE.md` - Architecture details
