# AWS SAA-C03 Quiz App

A full-featured flashcard quiz app with **516 verified SAA-C03 questions**, Google login, access control, and cross-device progress sync.

---

## What's included

- **516 questions** across 8 practice sets + curated set
- Full explanations for every question (answer, why, trap, rule, keywords)
- Google OAuth login with email allowlist (you control who has access)
- Progress sync across devices via Supabase
- Dark mode UI, set/category filtering, browse mode, exam tips

---

## Setup (~15 minutes)

### Step 1 — Supabase (free)

1. Go to [supabase.com](https://supabase.com) → **New project** (free tier is fine)
2. After the project is created, go to **Settings → API**
3. Copy your **Project URL** and **anon public key** — you'll need these in Step 4

### Step 2 — Create the database tables

In your Supabase project → **SQL Editor** → paste and run this:

```sql
-- User progress table
create table user_data (
  id uuid primary key references auth.users(id) on delete cascade,
  cards jsonb,
  prog  jsonb,
  updated_at timestamptz default now()
);

alter table user_data enable row level security;

create policy "Users manage own data" on user_data
  for all using (auth.uid() = id);

-- Access allowlist
create table allowed_emails (
  email text primary key
);

alter table allowed_emails enable row level security;

create policy "Anyone can read allowlist" on allowed_emails
  for select using (true);
```

### Step 3 — Add people to the allowlist

In Supabase → **Table Editor → allowed_emails → Insert row**

Add one Gmail address per row. To remove access, delete their row.
**No redeployment needed — takes effect immediately.**

### Step 4 — Enable Google OAuth

1. Supabase → **Authentication → Providers → Google → Enable**
2. Go to [console.cloud.google.com](https://console.cloud.google.com)
3. Create a new project (or use an existing one)
4. **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URI: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
5. Copy the **Client ID** and **Client Secret** back into Supabase → Google provider settings

### Step 5 — Deploy to Vercel (free)

1. Push this folder to a **GitHub repo** (public or private both work)
2. Go to [vercel.com](https://vercel.com) → **New Project → Import** your repo
3. In Vercel project settings → **Environment Variables**, add:
   ```
   VITE_SUPABASE_URL       = https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY  = your-anon-key-here
   ```
4. Deploy — Vercel will give you a URL like `https://your-app.vercel.app`
5. Go back to **Supabase → Authentication → URL Configuration**
   - **Site URL**: set to your Vercel URL
   - **Redirect URLs**: add your Vercel URL
6. Also add your Vercel URL to your Google OAuth client's **Authorized JavaScript origins**
7. Redeploy once (trigger from Vercel dashboard)

---

## Run locally

```bash
cp .env.example .env
# Fill in .env with your Supabase URL and anon key

npm install
npm run dev
```

App opens at `http://localhost:5173`

---

## Managing access

| Action | How |
|--------|-----|
| Add a user | Supabase → Table Editor → allowed_emails → Insert row → enter their Gmail |
| Remove a user | Find their row → delete it |
| Check who has access | Browse the allowed_emails table |

Access control is server-side. Anyone not on the list sees an error and is signed out automatically.

---

## Question sets

| Set | Questions |
|-----|-----------|
| Curated | 61 |
| Practice Set 1 | 65 |
| Practice Set 2 | 65 |
| Practice Set 3 | 65 |
| Practice Set 4 | 65 |
| Practice Set 5 | 65 |
| Practice Set 6 | 65 |
| Real Test 1 | 65 |
| **Total** | **516** |

All questions cover the official SAA-C03 exam domains:
- Domain 1: Design Secure Architectures (30%)
- Domain 2: Design Resilient Architectures (26%)
- Domain 3: Design High-Performing Architectures (24%)
- Domain 4: Design Cost-Optimized Architectures (20%)
