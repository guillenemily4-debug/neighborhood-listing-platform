# Lab 5: Individual Contribution and Team Collaboration

## Student Information

- GitHub Username: guillenemily4-debug
- Partner: connerwonner
- Lab: Database, API, and Row-Level Security

## Individual Contributions

I implemented database and API functionality in my Neighborhood Listing Platform repository, including versioned PostgreSQL migrations, RLS policies, input validation, and security verification.

My original database work is recorded in commits `515b790` and `a9d5beb`.

## Collaboration With Conner

I contributed to Conner's `property-listings-app` repository through a separate feature branch.

My contributions included:

- Creating an RLS security test matrix.
- Identifying authorization weaknesses in existing owner policies.
- Adding a SQL migration restricting owner INSERT, UPDATE, and DELETE operations.
- Testing access permissions in an isolated Supabase development project.
- Documenting successful and rejected database operations.
- Opening a pull request requesting Conner's review.

**Collaboration Pull Request:**

https://github.com/connerwonner/property-listings-app/pull/2

**Review status:** Conner's review was requested. Final approval and merge must be confirmed separately.

## Security Verification

Testing included anonymous, authenticated owner, other-user, simulated administrator, and service-role access.

The database rejected an unauthorized attempt to create a published property with PostgreSQL error `42501`.

These tests used simulated database roles and JWT claims. Full application authentication testing remains separate.

## Secret Hygiene

In my own Neighborhood Listing Platform repository:

- Gitleaks scanned 24 commits and detected zero leaks.
- `.env.local` was confirmed ignored by `.gitignore`.
- `.env.local` was confirmed absent from tracked Git files.

## AI Assistance

ChatGPT assisted with security analysis, migration drafting, and RLS test planning.

Gemini's independent schema review is documented in `docs/ai-collaboration-log.md`.

## Remaining Collaboration Evidence

- Conner's completed PR review and any follow-up corrections.
- Pair-programming session record with driver/navigator switch, if performed.
- Final testing and review status.
