# DREAMBLOCK - Complete Project Structure

## File Organization

```
dreamblock/
├── public/                          # Static assets & PWA
│   ├── icons/
│   │   └── README.md               # Icon placeholder guide
│   ├── manifest.json               # PWA manifest
│   └── sw.js                       # Service worker
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── auth/
│   │   │   ├── callback/route.ts   # OAuth callback handler
│   │   │   └── error/page.tsx      # Auth error page
│   │   ├── check/page.tsx          # Dream survey (15-step flow)
│   │   ├── checkin/page.tsx        # Daily check-in
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # Dashboard server component
│   │   │   └── DashboardClient.tsx # Dashboard UI
│   │   ├── results/[id]/
│   │   │   ├── page.tsx            # Results server component
│   │   │   └── ResultsClient.tsx   # Results UI with tabs
│   │   ├── globals.css             # Global styles + animations
│   │   ├── layout.tsx              # Root layout + PWA setup
│   │   └── page.tsx                # Home page
│   │
│   ├── components/
│   │   ├── AuthModal.tsx           # Email login modal
│   │   ├── PWARegister.tsx         # Service worker registration
│   │   └── ShareButton.tsx         # Share/clipboard button
│   │
│   ├── lib/
│   │   ├── types.ts                # TypeScript interfaces & types
│   │   │
│   │   ├── logic/
│   │   │   ├── archetypes.ts       # Archetype detection logic
│   │   │   ├── classification.ts   # Dream classification logic
│   │   │   └── microsteps.ts       # Personalized step generation
│   │   │
│   │   └── supabase/
│   │       ├── client.ts           # Browser Supabase client
│   │       └── server.ts           # Server Supabase client
│   │
│   └── middleware.ts               # Auth session middleware
│
├── Configuration Files
│   ├── package.json                # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript config
│   ├── next.config.js              # Next.js config
│   ├── tailwind.config.ts          # Tailwind theme colors
│   ├── postcss.config.js           # CSS processing
│   ├── .eslintrc.json              # Linting rules
│   └── .gitignore                  # Git ignore patterns
│
└── Documentation
    ├── README.md                   # Quick start guide
    ├── DEPLOYMENT.md               # Complete deployment guide
    ├── PROJECT_STRUCTURE.md        # This file
    └── .env.local.example          # Environment template
```

## Key Components Explained

### Survey Flow (`src/app/check/page.tsx`)
- **Step 0**: Dream intake (title, category, timeline, urgency)
- **Steps 1-5**: Resistance interview (5 diagnostic questions)
- **Steps 6-13**: Reality check (8 feasibility questions)
- **Processing**: Calculates archetype, classification, and micro-steps

### Results Display (`src/app/results/[id]/ResultsClient.tsx`)
Three tabs:
1. **Assessment**: Classification, archetype, signal scores, essence test
2. **Next Steps**: Personalized micro-steps based on resistance archetype
3. **Profile**: Summary of answers and patterns

### Logic Engine

**Archetypes** (8 types):
- Fear of Visibility
- Perfectionist Freeze
- Overwhelm Fog
- Identity Conflict
- Fear of Success
- Shame Loop
- Consistency Collapse
- Misalignment

**Classifications** (4 outcomes):
- Viable & Aligned (pursue)
- Viable but Misaligned (defer)
- Symbolic / Transformable (reshape)
- Unrealistic in Current Form (release)

### Authentication
- Magic link via Supabase Auth
- OTP email to user
- Session stored in cookies (Server Session)
- Middleware validates on every request

### PWA Features
- Service worker caches static assets
- Manifest.json for app install
- Works offline for cached pages
- Mobile-friendly viewport & safe areas

## Database Schema

### `dreams` table
Stores complete assessment:
- User/session ID
- Dream metadata (title, category, years_delayed)
- Signal scores (importance, pain, fear)
- Responses (emotion, thoughts, stuck points, protections)
- Reality signals (constraints, time, sacrifices, willingness)
- Results (archetype, classification, micro_steps)

### `checkins` table
Daily tracking:
- dream_id (optional, for relating to assessments)
- user_id
- Qualitative data (what was avoided, where resistance showed)
- Emotion & stuck point tags
- Tiny step taken

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Supabase Auth (magic links)
- **Database**: Supabase PostgreSQL
- **PWA**: Service Workers
- **API**: RESTful via Supabase client

## Development Workflow

```bash
# Install
npm install

# Develop
npm run dev        # http://localhost:3000

# Build
npm run build      # Production build

# Lint
npm lint          # Check code quality

# Deploy
# Push to GitHub → Vercel auto-deploys
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
```

Only `NEXT_PUBLIC_*` are exposed to the browser. Sensitive keys go in `.env.local` only.

## Type Safety

All data flows through TypeScript interfaces:
- `DreamIntake`: Survey step 0
- `ResistanceAnswers`: Survey steps 1-5
- `RealityAnswers`: Survey steps 6-13
- `Dream`: Stored assessment
- `CheckIn`: Daily tracking
- `ResistanceArchetype`: 8 archetypes
- `DreamClassification`: 4 outcomes

## Color Scheme

Dark mode with accent colors:
- **Background**: `#080810`
- **Surface**: `#0F0F1A`, `#14141F`
- **Text**: `#E8E8F0` (primary), `#8888A0` (secondary), `#4A4A60` (muted)
- **Archetype colors**: 8 distinct hex codes for icons and badges

Defined in:
- `src/app/globals.css` (CSS variables)
- `tailwind.config.ts` (Tailwind theme)

## Responsive Design

- Mobile-first (430px max-width for main content)
- Safe area insets (iOS notch support)
- 100dvh for full viewport height
- Scrollable content with hidden scrollbars
- Touch-friendly buttons (min 44-48px)

## Performance Optimizations

- Service worker caches static routes
- CSS-in-JS for inline styles (minimal overhead)
- No image processing (Supabase APIs handle data)
- localStorage fallback for offline assessments
- Single-page transitions with animations

---

**Last Updated**: February 26, 2026
**Framework Version**: Next.js 14.2.15
**Status**: Production-ready
