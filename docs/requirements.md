
# Midterm Practical Version B
## Local Services & Appointment Booking Requirements

### Story 1 — Service Provider / Merchant
**Scope:** Medium

As an authenticated local service provider, I want to submit service listing drafts with hourly rates so that clients can book appointments once administrators approve them.

**Acceptance Criteria**
- Given an authenticated merchant, when a valid service is submitted, then it is saved with status `draft` and provider_id equal to auth.uid().
- Given an invalid service payload, when the merchant submits it, then the API returns HTTP 400.
- Given a merchant who does not own a service, when they attempt to modify it, then access is denied.
- Given a merchant's approved service, when they attempt to edit it, then the modification is denied.

**Traceability**
- Migration: `supabase/migrations/20261029140000_exam_services_persistence.sql`
- API: `app/api/services/route.ts` (POST)
- Validation: `src/schemas/service.ts`
- Tables: `profiles`, `services`

### Story 2 — Neighborhood Client / Resident
**Scope:** Medium

As a neighborhood resident, I want to view approved services by district and request appointments without accessing other clients' booking information.

**Acceptance Criteria**
- Given an anonymous visitor, when requesting services, then only approved services are returned.
- Given an inactive service category or coverage zone, when filtering services, then inactive offerings are excluded.
- Given a resident submitting a valid booking request, when the request is processed, then a booking is created.
- Given a resident attempting to view another client's booking, when querying bookings, then access is denied.

**Traceability**
- Migration: `supabase/migrations/20261029140000_exam_services_persistence.sql`
- API: `app/api/services/route.ts` (GET)
- Booking endpoint: `app/api/bookings/route.ts` (planned)
- UI: `src/components/ServiceCard.tsx`
- Tables: `services`, `service_categories`, `service_category_mappings`, `bookings`

### Story 3 — Platform Administrator
**Scope:** Large

As a platform administrator, I want to approve service listings, deactivate inappropriate listings, and audit all client bookings.

**Acceptance Criteria**
- Given an administrator, when reviewing pending services, then they can approve or suspend a service.
- Given an administrator, when accessing booking records, then all bookings are visible.
- Given a regular merchant or client, when attempting administrative actions, then access is denied.
- Given an administrator updating records, when the authorized operation succeeds, then the changes are persisted.

**Traceability**
- Migration: `supabase/migrations/20261029140000_exam_services_persistence.sql`
- Admin endpoint: `app/api/admin/services/route.ts` (planned)
- Tables: `profiles`, `services`, `bookings`
- Security: RLS policies and `docs/security-audit.md`

## Implementation Status
These requirements describe intended functionality.
Implementation and verification will be documented as each feature is completed.
