
# Database Security and Verification

## Project
Neighborhood Listing Platform

## Database
- PostgreSQL through Supabase
- Local development using Docker
- Five tables: profiles, properties, sponsors, property_sponsors, inquiries
- Versioned SQL migration

## Row-Level Security
RLS is enabled on all five tables.

Security policies:
- Public users can read approved properties.
- Public users can read active sponsors.
- Public users can read approved property-sponsor relationships.
- Owners can view their own properties.
- Authenticated owners can create unapproved properties.
- Owners can update only their own unapproved properties.

## Security Test Results
- Anonymous user cannot view unapproved listings: PASS
- Owner can view their own unapproved listing: PASS
- Other user cannot view an owner's unapproved listing: PASS
- Other user cannot update an owner's unapproved listing: PASS
- Owner can update their own unapproved listing: PASS
- Owner cannot update approval status: PASS
- User cannot create a listing under another owner's identity: PASS
- Unauthenticated POST request returns HTTP 401: PASS
- Authenticated valid POST request returns HTTP 201: PASS
- Invalid authenticated POST request returns HTTP 400: PASS
- Second numbered migration applied successfully: PASS
- All nine additional database constraints verified: PASS
- PostgreSQL rejected an empty property title (SQLSTATE 23514): PASS
- Invalid database update preserved the original record: PASS

## Migration and Seed Verification
- Local database reset completed successfully.
- Migration recreated all five tables.
- Fictional sponsor seed data inserted successfully.
- Property API retrieved an approved fictional listing.

## Secret Hygiene
- Environment variables are stored in .env.local.
- .env.local is ignored by Git.
- Service-role credentials are not used by the application routes.
- Git history scan: 0 leaks detected.
- Staged change scan: 0 leaks detected.
- Temporary Supabase secrets are excluded from Git.
- Production dependency audit: 0 known vulnerabilities.

## API Security
GET /api/listings:
- Selects explicit public listing fields.
- Returns approved listings.
- Provides safe error responses.

POST /api/listings:
- Requires authenticated Supabase user.
- Validates input using Zod.
- Assigns owner_id from the authenticated user.
- Rejects client-controlled approval fields.
- Uses database RLS to enforce ownership.

## Remaining Security Considerations
- Development dependency audit reported five high-severity vulnerabilities.
- Admin authorization and service-role operations are not implemented.
- Authenticated PATCH functionality is not implemented.
- Automated RLS regression tests are not yet included.
