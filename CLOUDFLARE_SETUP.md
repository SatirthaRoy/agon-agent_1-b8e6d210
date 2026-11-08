# Cloudflare Pages and D1 setup

## Cloudflare Pages project

Connect the GitHub repository `SatirthaRoy/Love-site` in Cloudflare Pages with these build settings:

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

The D1 binding and database ID are already configured in `wrangler.toml` as `DB` and `bb96f742-6687-44f2-b10b-e2f92d55d987`.

## Required Pages secrets

In the Pages project's **Settings → Variables and Secrets**, add these as secrets (not plain-text variables):

- `ADMIN_PIN`: a private PIN used to log in to the Master Admin panel
- `ADMIN_SESSION_SECRET`: a randomly generated secret with at least 32 characters

Do not reuse the old default PIN. Generate the session secret on your own computer, for example with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`, and paste it directly into Cloudflare. Do not send either value in chat or commit them.

## Apply the database schema

Install dependencies, then authenticate Wrangler with Cloudflare:

```powershell
npm install
npx wrangler login
npm run db:migrate:remote
```

Review Wrangler's confirmation carefully. This applies all pending migrations, including application tables, schema updates, and the initial settings row. It does not import content from Supabase or browser storage.

## Local development

Copy `.dev.vars.example` to `.dev.vars` and set private local values for `ADMIN_PIN` and `ADMIN_SESSION_SECRET`. Then run:

```powershell
npm run dev
```

This applies the migration to Wrangler's local D1 emulator, builds the frontend, and serves the Pages Functions locally. Local D1 data is separate from the remote database.

## Existing content

Entries saved by the earlier offline fallback live in the browser's local storage. Export them from the same browser before clearing its site data. They are not automatically copied by the D1 schema migration. Supabase data also needs a separate export/import if any records exist there.

To import the browser backup after the D1 schema is applied:

```powershell
node scripts/prepare-content-import.mjs "$env:USERPROFILE\Downloads\love-site-content-backup.json"
npx wrangler d1 execute love-site-db --remote --file "$env:TEMP\love-site-content-import.sql"
```

The import uses `INSERT OR IGNORE`, so it is intended for a fresh database and will not replace rows already present. The generated SQL stays in the Windows temp directory and may contain private letters; do not commit or share it.
