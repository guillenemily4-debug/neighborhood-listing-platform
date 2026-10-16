
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
