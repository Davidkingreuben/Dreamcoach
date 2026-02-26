# Deploy DREAMBLOCK to Vercel — Zero Config

No environment variables. No database. No accounts needed.
This is as simple as a deploy gets.

---

## Option A — GitHub + Vercel (Recommended, ~5 minutes)

### 1. Create a free GitHub account
Go to https://github.com and sign up if you don't have one.

### 2. Create a new repository
- Click the **+** icon → "New repository"
- Name it `dreamblock`
- Keep it **Public**
- Click **Create repository**

### 3. Upload the project files
On the repository page, click **"uploading an existing file"**

Drag the entire **`dreamblock`** folder contents into the upload area.
(Upload everything: src/, public/, package.json, etc.)

Click **"Commit changes"**

### 4. Deploy to Vercel
- Go to https://vercel.com and sign up (free)
- Click **"Add New → Project"**
- Click **"Import"** next to your `dreamblock` repository
- Vercel detects Next.js automatically
- Click **"Deploy"** — no settings to change

### 5. Get your URL
In ~60 seconds, Vercel gives you a URL like:
`https://dreamblock-abc123.vercel.app`

That's it. Share it.

---

## Option B — Drag & Drop to Vercel (No GitHub, ~3 minutes)

### 1. Create the project zip
On your computer, zip the entire `dreamblock` folder.

### 2. Deploy via Vercel CLI (terminal required)
```bash
cd dreamblock
npx vercel
# Follow prompts: Yes to all defaults
# Copy the URL it gives you
```

Or if you don't want to use terminal:

### 2b. Use Vercel's web upload
- Go to https://vercel.com/new
- Drag your zip file onto the page
- Click Deploy

---

## Option C — Run Locally First (test before deploying)

```bash
# In the dreamblock folder:
npm install
npm run dev
# Open http://localhost:3000
```

---

## After Deploy — Custom Domain (Optional)

1. In Vercel dashboard, go to your project → **Settings → Domains**
2. Add your domain (e.g. `dreamblock.app`)
3. Point your DNS to Vercel's nameservers

---

## What Vercel Gives You For Free

- HTTPS (SSL certificate)
- Global CDN (fast everywhere)
- Automatic deploys when you push to GitHub
- Preview URLs for every branch
- Custom domain support

---

## Notes

- **No environment variables needed** — the app works with zero config
- **Data stays local** — all assessments are saved in the user's browser (localStorage)
- **PWA ready** — users can "Add to Home Screen" on iPhone/Android
- **Free tier** — Vercel's free tier is more than enough for this app

---

## Share the App

Once deployed, share the Vercel URL with your friends.

The Share button inside the app uses the Web Share API on mobile
(native share sheet on iPhone/Android) or copies the URL on desktop.
