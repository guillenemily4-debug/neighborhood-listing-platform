
# AI Collaboration Log
## Neighborhood Listing Platform

### AI Tool: ChatGPT

**Purpose:** Develop a secure PostgreSQL database and integrate it with a Next.js website.

**Prompt summary:**
Help implement a Supabase PostgreSQL schema for properties,
sponsors, property_sponsors, profiles, and inquiries.
Review RLS policies for ownership, approval restrictions,
privilege escalation, validation, and security risks.
Use placeholders for credentials.

**Useful suggestions:**
- Create a versioned database migration.
- Enable RLS on all five tables.
- Restrict public access to approved properties.
- Require authenticated ownership for property writes.
- Validate POST requests using Zod.
- Keep database credentials out of Git.
- Test allowed and forbidden operations.

**Suggestions revised or rejected:**
- Repeated SQL GRANT/REVOKE statements were consolidated.
- A proposed unnecessary function EXECUTE grant was removed.
- Public access to owner_id was restricted.
- Force-updating dependencies was avoided.

**Verification performed:**
- Local Supabase migration and database reset succeeded.
- Anonymous and owner RLS tests passed.
- GET /api/listings returned an approved property.
- Authenticated POST returned HTTP 201.
- Invalid authenticated POST returned HTTP 400.
- TypeScript, ESLint, and production build passed.
- Gitleaks reported no leaks in Git history or staged changes.

**Commit:**
515b790 - Add initial database schema and RLS policies

### AI Tool: Gemini / Google AI Studio

**Purpose:** Obtain an independent defensive security review of the PostgreSQL schema and RLS policies.

**Prompt:** Review this PostgreSQL schema and RLS plan as a defensive database engineer. Identify privilege escalation, ownership, validation, and cascade risks. Give executable tests, but use placeholders for all credentials.

**Gemini's findings:**
- Identified potential account-deletion problems involving `ON DELETE RESTRICT` and `ON DELETE CASCADE`.
- Recommended database-level maximum lengths for text fields.
- Identified the risk of future permission changes exposing sponsor contact information.
- Recommended reviewing inquiry permissions and administrator authorization.
- Suggested improvements to the automatic user-profile creation trigger.

**Useful recommendations:**
- Add database constraints to supplement Zod validation.
- Review foreign-key deletion behavior.
- Maintain strict separation between public and private information.
- Expand automated security testing.

**Rejected or deferred recommendations:**
- Did not replace the working migration with Gemini's entire proposed schema.
- Deferred broader inquiry-access policies pending privacy review.
- Deferred administrator JWT authorization until server-side role verification is designed.
- Did not run Gemini's proposed test suite because it requires corrections.

**Verification:**
Compared Gemini's recommendations with the existing schema, API design, and previously completed RLS tests. Gemini's proposed remediation SQL has not been executed or verified.

**Commit:** To be recorded after the final Git commit.

### Privacy
No real credentials, passwords, service-role keys,
or private customer records were included in AI prompts.

## Sponsor Selection Assignment — October 22, 2026
# AI Collaboration Log — Sponsor Selection System

**Project:** Neighborhood Listing Platform
**Date:** October 22, 2026
**Tools Used:** ChatGPT and Google Gemini

## 1. Purpose

The purpose of using AI was to review and improve a deterministic sponsor-selection system. The system selects local sponsors based on geographic ZIP codes, approval status, campaign dates, placement, and priority without collecting sensitive user information or using individualized profiling.

## 2. ChatGPT Review

**Prompt:** Act as an adversarial tester for a contextual sponsor-selection function. Generate boundary cases involving dates, ZIP codes, empty data, ties, unapproved records, and unsafe URLs. Do not propose user profiling.

**Useful Suggestions:**
- Test invalid and unsafe sponsor URLs.
- Reject HTTP, FTP, and JavaScript URL schemes.
- Reject localhost and loopback IP addresses.
- Test missing sponsor records and deterministic selection.
- Verify that inactive and expired sponsors cannot be selected.

**Rejected or Deferred Suggestions:**
- Individualized advertising based on visitor identity was excluded.
- More advanced geographic matching was deferred until approved geographic data is available.

**Verification:** Added URL-validation and sponsor-selection unit tests. The tests passed successfully.

## 3. Google Gemini Review

**Prompt:** Act as an adversarial tester for a deterministic geography-based sponsor-selection system. Examine ZIP codes, dates, empty candidates, ties, inactive and unapproved sponsors, unsafe URLs, and duplicate impressions. Recommend additional tests without using sensitive traits or personal profiling.

**Useful Suggestions:**
- Preserve leading zeros in ZIP codes.
- Reject inactive sponsors even when their priority is higher.
- Ensure multi-ZIP campaigns do not receive additional selection weight merely because they cover more ZIP codes.
- Maintain deterministic results when candidates tie.
- Review campaign boundary dates and unsafe redirect behavior.

**Rejected or Deferred Suggestions:**
- Session-based tracking identifiers were rejected for the class version.
- IP-based HMAC identifiers were rejected to avoid collecting visitor-derived tracking information.
- ZIP+4 normalization was deferred because the current implementation requires five-digit ZIP codes.
- Additional redirect-chain and approval-revocation checks remain future security work.

**Verification:** Added three new selection tests based on Gemini's recommendations. All three passed.

## 4. Test Evidence

**Command:**

`npx tsx --test src/lib/sponsor-selector.test.ts src/lib/sponsor-url.test.ts`

**Results:**
- Total tests: 29
- Passed: 29
- Failed: 0

**TypeScript verification:**

`npx tsc --noEmit`

No TypeScript errors were reported.

## 5. Privacy and Explainability

Sponsor eligibility depends on approval status, active status, placement, campaign dates, and ZIP-code matching. Eligible sponsors are ranked by priority, with a deterministic tie-breaking process.

The application does not use visitor identity, sensitive traits, or discriminatory housing targeting.

The class impression event includes sponsor ID, placement, timestamp, and coarse page context. The application event does not intentionally include visitor IP addresses or individual identifiers.

## 6. Final AI Review Decision

Both ChatGPT and Gemini provided useful testing suggestions. Suggestions were reviewed before implementation rather than accepted automatically.

Relevant tests were added and verified. Recommendations requiring personal tracking were rejected, while changes requiring additional geographic data or security integration were documented for future work.

**Git Commit:** Pending — add the commit hash after changes have been committed to GitHub.