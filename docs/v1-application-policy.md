# V1 application-first policy

V1 does not verify phone numbers. A phone number is a contact field only. Candidate and job facts become structured application data when the chef or restaurant submits the form.

## What a record means

| Record | How it is created | Label |
| --- | --- | --- |
| Public web page | ChefFinder Search (`f5cf19bdcf6e04bc5`) | Potential discovery page in the Programmable Search results |
| Seeded social, referral, or job-board row | Roster | Potential · Discovery, Referral, or Job board |
| Referral note | Discovery search | Potential · Referral |
| Chef application | Applications screen | Application-ready structured candidate |
| Restaurant requirement | Applications screen | Structured matching target |

There is no `verified` boolean on `ChefCandidate` and no OTP or phone-verification flow.

## Match score

`scoreMatch` in `src/utils/aiScoringEngine.ts` (also served by `POST /api/match`) uses:

- role alignment
- cuisine overlap
- location
- experience versus the requirement
- required skills
- application readiness (10 points once a chef application is on file)

The score does not read the phone number and does not award points for verification.

With no restaurant requirement selected, the UI shows a preview score from profile presence and application readiness. It is not a job match.

## Pipeline

From a candidate profile, a recruiter can invite a potential chef to apply, shortlist them, then move the record through contact, interview, trial, and hire. An invite copies contact fields into the application form. Submitting that form creates the structured candidate and, when the invite came from a discovery record, replaces that discovery row.

## Static site

`docs/index.html` is the GitHub Pages site. It follows this policy: phone numbers are contact fields, web search hits stay potential pages, and submitted applications become structured candidates.

## ChefFinder Search

The Discover screen embeds Google Programmable Search Engine `f5cf19bdcf6e04bc5` (public page: https://cse.google.com/cse?cx=f5cf19bdcf6e04bc5). The engine is configured to search the web. Those hits stay outside the structured roster. Roster filters and match scores apply to seeded records and submitted applications.

## Storage

| Key | Contents |
| --- | --- |
| `cheffinder_chef_applications` | Submitted chef applications |
| `cheffinder_job_requirements` | Submitted restaurant requirements |

Pipeline stage overrides stay in the current session. Replace both stored collections with PostgreSQL in the next production phase.
