
# Midterm Practical Version B — Security Audit

## Row-Level Security Verification

Migration: 20261102170000_exam_services_rls.sql

All five required tables have Row-Level Security enabled.

## Authorization Test Matrix

| User Role | Test | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Anonymous | Read approved services | Allowed | Not tested | Pending |
| Anonymous | Read draft services | Denied | Not tested | Pending |
| Provider A | Update own draft service | Allowed | Not tested | Pending |
| Provider A | Update Provider B's service | Denied | Not tested | Pending |
| Client | Submit booking for approved service | Allowed | Not tested | Pending |
| Client | Read another client's booking | Denied | Not tested | Pending |
| Admin | Read and manage all records using authorized elevated execution | Allowed | Not tested | Pending |

## Security Notes

- Service ownership is checked against auth.uid().
- Provider modifications are limited to draft or suspended services.
- Booking SELECT policies are restricted to administrators and associated providers.
- Service-role access must remain server-side.
- Policy creation does not establish that authorization tests have passed.
