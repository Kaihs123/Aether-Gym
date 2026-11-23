# AETHER Gym

A phone-friendly gym log. People sign up with an email and password, and their sessions, plan and progress photos are saved to their own account (Supabase) and follow them to any device. Hosted free on GitHub Pages.

## Set up (about 10 minutes)

### 1. Supabase
1. Create a project at supabase.com.
2. SQL Editor > New query > paste all of `schema.sql` > Run. This creates the table, locks each person to their own rows, and creates the private photo storage.
3. Project Settings > API: copy the **Project URL** and the **publishable (anon) key**. Do not use the secret / service_role key.
4. Authentication > URL Configuration: set **Site URL** to your Pages address (step 2 below), e.g. `https://YOURNAME.github.io/aether-gym/`. Add the same address under Redirect URLs.
5. Authentication > Sign In / Providers > Email: leave "Confirm email" on if you want people to verify their address (recommended). Supabase's built-in email sender is limited to a few emails an hour; add your own SMTP under Authentication > Emails when you have more than a handful of users.

### 2. GitHub
1. Create a new public repository, e.g. `aether-gym`.
2. Upload every file in this folder to it (keep the `icons` folder).
3. Open `config.js` in the repo, paste your Project URL and publishable key, and commit.
4. Settings > Pages > Build from branch > `main` / root > Save. The site appears at `https://YOURNAME.github.io/aether-gym/` after a minute.

### 3. Share it
Send people the link. On a phone: iPhone Safari > Share > Add to Home Screen. Android Chrome > menu > Install app.

## Notes
- Each person only ever sees their own data (row-level security in `schema.sql`).
- The publishable key in `config.js` is meant to be public.
- Progress photos are private and shown through short-lived signed links.
- If `config.js` is left unfilled the app still works, saving to that browser only.
