# ChefFinder

ChefFinder V1 matches chefs to restaurant roles from **submitted applications**. A phone number is a contact field. Public web, referral, and job-board rows stay potential discovery records until the chef applies.

## Workflow

```text
Public discovery / referral
        ↓
Potential Candidate
        ↓
Application Invite
        ↓
Chef Application
        ↓
Structured Candidate Profile
        ↓
AI Match
        ↓
Shortlist → Contact → Interview → Trial → Hire
```

## Run locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Optional: copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` for a later narrative integration. Match scores run locally and do not need the key.
3. Start the app: `npm run dev`. Discover loads ChefFinder Search, Programmable Search Engine `f5cf19bdcf6e04bc5`.
4. Optional API: `npm run server` (proxied from Vite at `/api`)

## Checks

- `npm test` — scoring ignores phone numbers and any runtime verified flag
- `npm run build` — typecheck and production bundle

## V1 storage

Browser `localStorage` keys:

- `cheffinder_chef_applications`
- `cheffinder_job_requirements`

The next production phase should replace these keys with PostgreSQL/API persistence. See [docs/v1-application-policy.md](docs/v1-application-policy.md).
