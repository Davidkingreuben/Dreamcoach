# DREAMBLOCK Deployment Guide

## Prerequisites

- Node.js 18+
- Supabase account (create free at supabase.com)
- Vercel account (optional, for hosting)

## Step 1: Supabase Setup

1. Create a Supabase project at https://app.supabase.com
2. Go to SQL Editor and run these queries to create tables:

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

-- Checkins table
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

3. Go to Settings > API > Project URL and copy your `NEXT_PUBLIC_SUPABASE_URL`
4. Go to Settings > API > Project API keys and copy the Anon Public key (this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Step 2: Local Setup

1. Copy `.env.local.example` to `.env.local`
2. Paste your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Step 3: App Icons

Replace the placeholder icons:
- `public/icons/icon-192.png` (192x192 with transparent background)
- `public/icons/icon-512.png` (512x512 with transparent background)

Use PWA Builder or Favicon.io to generate these.

## Step 4: Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import the repository
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` = your Vercel domain

5. Click Deploy

## Step 5: Configure Email Auth (Optional)

For production, you may want to:
1. Configure Supabase email templates (Auth > Email Templates)
2. Set up SMTP in Supabase settings for custom emails

For testing, the default Supabase emails work fine.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anon public key |
| `NEXT_PUBLIC_APP_URL` | No | Base URL for magic links (optional) |

## Database Security

The app uses:
- Row Level Security (RLS) can be configured in Supabase
- Auth-based data isolation (user_id foreign key)
- Session tracking (session_id for anonymous users)

To enable RLS, run in SQL Editor:

```sql
-- Enable RLS
alter table dreams enable row level security;
alter table checkins enable row level security;

-- Users can see their own dreams (logged in)
create policy "Users can see their own dreams"
on dreams for select
using (auth.uid() = user_id);

-- Anyone can insert a dream (anon users have null user_id)
create policy "Anyone can insert dreams"
on dreams for insert
with check (true);

-- Users can see their own checkins
create policy "Users can see their own checkins"
on checkins for select
using (auth.uid() = user_id);

-- Anyone can insert a checkin
create policy "Anyone can insert checkins"
on checkins for insert
with check (true);

-- Allow public read of a single dream by ID (for results page)
create policy "Anyone can read a dream by id"
on dreams for select
using (true);
```

## Testing

- **Anonymous flow**: Dream Check → Results → Share
- **Auth flow**: Log in → Dashboard → Check another dream
- **Check-in**: From results page, use Daily Check-In feature
- **PWA**: Install from browser menu (works offline with cached pages)

## Troubleshooting

### "Cannot find module '@supabase/ssr'"
```bash
npm install @supabase/ssr
```

### "Supabase URL not defined"
Check `.env.local` has the correct `NEXT_PUBLIC_SUPABASE_URL`

### "Magic link not working"
Verify email is confirmed in Supabase Users table

### "Data not saving"
Check Supabase tables exist and RLS policies allow inserts

## Performance Tips

- Service worker caches static assets (see `public/sw.js`)
- Images: Consider optimizing app icons to <100KB
- API: Supabase auto-scales; watch usage in dashboard
- Browser: Works on all modern browsers + iOS 12+

## Support

For issues:
1. Check Supabase documentation: https://supabase.com/docs
2. Check Next.js docs: https://nextjs.org/docs
3. Review console errors in browser DevTools
