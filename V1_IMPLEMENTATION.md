# ChefFinder V1 — Application-First Implementation

## Product rule

V1 does **not** verify phone numbers. A phone number is a contact field only. Candidate/job facts become structured application data when the chef or restaurant submits the application.

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

## Files changed

- `src/types.ts` — application models, profile source/status, application navigation.
- `src/App.tsx` — Applications screen integration and conversion of submitted chef applications into live candidates.
- `src/components/Navbar.tsx` — Applications navigation.
- `src/components/ApplicationsView.tsx` — new chef and restaurant requirement forms.
- `src/components/CandidateCard.tsx` — remove fake verification badge.
- `src/components/CandidateModal.tsx` — remove fake verification badge and verification wording.
- `src/components/DashboardStats.tsx` — replace verification KPI with application-ready talent.
- `src/components/SearchFiltersSection.tsx` — remove certification/verification claim.
- `src/components/SearchLoadingAnimation.tsx` — describe structuring rather than verification.
- `src/components/SettingsDialog.tsx` — remove misleading “Verified” integration wording.
- `src/services/googleSearchService.ts` — remove verified-directory terminology.
- `src/utils/aiScoringEngine.ts` — remove phone/verification scoring and use application readiness.
- `server.ts` — remove candidate verification fields and use application-readiness scoring.
- `src/data/chefs.ts` — remove seeded `verified` flags.
- `README.md` and `docs/*` — document the V1 application-first policy.

## Storage in V1

Browser localStorage keys:

- `cheffinder_chef_applications`
- `cheffinder_job_requirements`

The next production phase should replace these with PostgreSQL/API persistence.

## Acceptance criteria

- No `verified` boolean exists on `ChefCandidate`.
- No OTP/phone-verification flow exists.
- Public social/job-source records are labelled as potential/discovery records.
- A completed chef application creates a structured candidate.
- A restaurant requirement creates a structured matching target.
- AI match score never uses phone verification.
- Candidate cards no longer display a generic Verified badge.
