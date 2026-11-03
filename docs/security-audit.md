
# Midterm Practical Version B — Security Audit

## Row-Level Security Verification

Migration: 20261102170000_exam_services_rls.sql

All five required tables have Row-Level Security enabled.

## Authorization Test Matrix

| User Role | Test | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Anonymous | Read approved services | Allowed | Plumbing Inspection (approved) was visible | PASS |
| Anonymous | Read draft services | Denied | Home Staging Consultation (draft) was hidden | PASS |
| Provider A | Update own draft service | Allowed | Home Staging Consultation updated successfully (1 row) | PASS |
| Provider A | Update Provider B's service | Denied | Electrical Inspection update affected 0 rows | PASS |
| Provider A | Read bookings for own service | Allowed | 1 booking visible | PASS |
| Provider A | Approve own draft service | Denied | PostgreSQL error 42501: RLS policy blocked approval | PASS |
| Client | Submit booking | Allowed | 1 booking inserted successfully; transaction rolled back | PASS |
| Client | Read another client's booking | Denied | Existing booking confirmed; client query returned 0 rows | PASS |
| Admin | Read and manage all records using authorized elevated execution | Allowed | Not tested | Pending |
| Admin | Read all services and bookings | Allowed | 3 services and 1 booking visible | PASS |
| Admin | Approve draft service | Allowed | Electrical Inspection approval updated 1 row; transaction rolled back | PASS |
| Admin | Suspend approved service | Allowed | Plumbing Inspection suspension updated 1 row; transaction rolled back | PASS |
| Anonymous | POST /api/services without authentication | HTTP 401 Unauthorized | HTTP 401 Unauthorized | PASS |


## Anonymous Access Test Evidence

Testing environment: Local Supabase Studio

Test records:
- Plumbing Inspection — approved
- Home Staging Consultation — draft

Verification:
Executed SELECT against public.services using
SET LOCAL ROLE anon.

Observed result:
Only Plumbing Inspection was returned.

Conclusion:
PASS — Anonymous visitors can view approved
services but cannot view draft services.

## Security Notes

- Service ownership is checked against auth.uid().
- Provider modifications are limited to draft or suspended services.
- Booking SELECT policies are restricted to administrators and associated providers.
- Service-role access must remain server-side.
- Policy creation does not establish that authorization tests have passed.

## RLS Activation Verification

Executed a query against pg_tables in local Supabase Studio.

Result: PASS

All five required tables have rowsecurity = true:
- profiles
- service_categories
- services
- service_category_mappings
- bookings

Verification method: Supabase SQL Editor

## RLS Policy Inspection

Verification tool: Local Supabase Studio SQL Editor

- Confirmed that RLS is enabled on all five required tables.
- Queried pg_policies and confirmed that security policies exist.
- The public schema currently contains 15 policies, including
  policies from previous laboratory assignments.

Status: PASS — RLS activation and policy existence checks.

Note: Role-based authorization tests are still pending.

## Security Audit Summary

Testing environment: Local Supabase Studio

Verification completed:
- RLS enabled across all five required tables.
- Anonymous users can view approved services but not drafts.
- Provider A can modify their own draft service.
- Provider A cannot modify Provider B's service.
- Providers can view bookings associated with their services.
- Clients can submit bookings.
- Clients cannot read other clients' bookings.
- Administrators can read all services and bookings.
- Administrators can approve draft services.
- Administrators can suspend approved services.
- Unauthenticated API submissions return HTTP 401.

All database modification tests were performed
using fictional local data.

Outstanding verification:
- Full elevated administrator read/write across all schemas.
- Authenticated API validation and creation tests.
- Explicit non-admin approval denial test.
