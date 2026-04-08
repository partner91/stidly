# Tidly Backend

This folder contains the local Supabase backend for the Tidly Expo app.

## What it provides

- Local Supabase stack via Docker
- Supabase Auth for email/password sign-in
- Google OAuth provider wiring for local development
- `profiles` and `todos` tables with Row Level Security
- Mailpit-backed local email testing for signup and password reset flows

## Prerequisites

- Docker Desktop running
- Node.js and npm

## Setup

1. Install backend dependencies:

   ```powershell
   npm install
   ```

2. Copy the environment template and add your Google OAuth credentials:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Start the local Supabase stack:

   ```powershell
   npm run supabase:start
   ```

4. Inspect the generated local keys and URLs:

   ```powershell
   npm run supabase:status
   ```

## Google OAuth local configuration

Create a Google OAuth client and add this local Supabase callback URL as an authorized redirect URI:

`http://127.0.0.1:54321/auth/v1/callback`

For the Expo app itself, the redirect allow-list already includes:

- `tidly://auth/callback`
- `http://localhost:19006/auth/callback`
- `http://localhost:8081/auth/callback`

## Useful local URLs

After `npm run supabase:start`:

- API: `http://127.0.0.1:54321`
- Studio: `http://127.0.0.1:54323`
- Mailpit: `http://127.0.0.1:54324`

## Notes

- Email confirmation is disabled in local development so email/password signup can be tested quickly.
- Mail-based flows still work locally through Mailpit for reset-password and other auth emails.
