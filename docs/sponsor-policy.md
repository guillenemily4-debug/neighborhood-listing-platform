
# Sponsor Selection Policy and Decision Note

## Eligibility Rules

Sponsors must meet all the following requirements:

- Approved and active
- Correct advertising placement
- Within the campaign's start and end dates
- Matching the property's ZIP code or an approved nearby ZIP

## Selection Rules

Eligible sponsors are ranked by priority.

When priorities are equal, exact ZIP matches are
preferred over nearby ZIP matches.

Remaining ties are resolved using a stable,
deterministic rotation based on the property ID
and sorted sponsor IDs.

Visitor identity and sensitive personal traits
are not used.

## Fallback and Disclosure

If no sponsor qualifies, the website displays
a Local Community Spotlight fallback message.

Every selected sponsor has a visible Sponsored
label adjacent to its placement.

## Privacy

The system does not use sensitive personal
information or individualized housing targeting.

Impression events contain:
- Sponsor ID
- Placement
- Timestamp
- Coarse page context

The application impression event does not
include visitor IP addresses or user identities.

## Redirect Security

Sponsor click destinations are retrieved from
approved database records.

The URL validator rejects unsafe protocols,
localhost, direct IP destinations, and URLs
containing credentials.

Further integration testing is required for
approval revocation and redirect safety.

## SQL Performance Review

Date: October 22, 2026

Query: Sponsor eligibility lookup for ZIP 90001.

EXPLAIN ANALYZE results:

- Scan type: Sequential Scan
- Planning time: 0.554 ms
- Execution time: 0.146 ms
- Rows removed by filter: 2
- Shared buffer hits: 5

Decision:

No additional database index is justified for
the current small sponsor dataset.

The query completed quickly using a sequential
scan. Indexes may be reconsidered if the table
grows or query performance deteriorates.

## Testing Evidence

- 29 unit tests passed
- 0 unit tests failed
- TypeScript verification passed
- Three fictional property outcomes verified
- Sponsored disclosure visually verified
- Approved sponsor redirect returned HTTP 302
- Impression endpoint returned HTTP 204

## Current Limitations

- Live matching currently uses exact ZIP codes.
- Nearby matching requires approved geographic data.
- Campaign boundaries use UTC calendar dates.
- Impression events are logged for class demonstration,
  not stored as production analytics.
- Redirect integration security tests remain to be completed.

## Redirect Integration Security Results

Date: October 22, 2026

The sponsor click API was tested against three cases:

- Approved sponsor: HTTP 302 redirect succeeded.
- Unapproved sponsor: HTTP 404, rejected.
- Approved sponsor with unsafe JavaScript URL:
  HTTP 400, rejected.

All three observed responses matched expectations.

Temporary security test sponsors were removed
after verification.

The existing URL-validation unit tests also passed.

## Redirect Integration Security Results

Date: October 22, 2026

Three redirect scenarios were verified:

- Approved sponsor: HTTP 302 Found
- Unapproved sponsor: HTTP 404 Not Found
- Approved sponsor with unsafe JavaScript URL:
  HTTP 400 Bad Request

All observed responses matched expectations.

The two temporary security-test sponsors
were deleted after testing.

The approved Community Coffee Shop sponsor
was retained for the demonstration.
