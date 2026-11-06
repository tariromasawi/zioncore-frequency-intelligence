# ZionCore Accounts & Admin

**Admin Google email:** `tariromasawi19@gmail.com`  
**MWARI NDI MWARI**

## User accounts

- Marketing home at `/`
- Sign in at `/login` (Google via Supabase)
- User area `/account`
- Admin `/admin` — only `tariromasawi19@gmail.com`
- OAuth callback `/auth/callback`

## Supabase Google setup

1. Create Supabase project  
2. Authentication → Providers → **Google** → enable  
3. Add Google Cloud OAuth client; set redirect to Supabase callback URL  
4. Site URL + redirect: `https://zioncore-frequency-intelligence.vercel.app/auth/callback`  
5. Vercel env:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Founder unlock

Until Google is live, `/login` accepts the founder email only for admin dashboard access (local session).

## Lab

Frequency Lab remains usable without an account.
