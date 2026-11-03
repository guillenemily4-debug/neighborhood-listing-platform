
# Midterm Practical Version B — Security Audit

## Row-Level Security Verification

Migration: 20261102170000_exam_services_rls.sql

All five required tables have Row-Level Security enabled.

## Authorization Test Matrix

| User Role | Test | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Anonymous | Read approved services | Allowed | Plumbing Inspection (approved) was visible | PASS |
| Anonymous | Read draft services | Denied | Home Staging Consultation (draft) was hidden | PASS |
| Provider A | Update own draft service | Allowed | Not tested | Pending |
| Provider A | Update Provider B's service | Denied | Not tested | Pending |
| Client | Submit booking for approved service | Allowed | Not tested | Pending |
| Client | Read another client's booking | Denied | Not tested | Pending |
| Admin | Read and manage all records using authorized elevated execution | Allowed | Not tested | Pending |
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
