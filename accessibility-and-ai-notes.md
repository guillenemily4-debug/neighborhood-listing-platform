# Accessibility and AI Notes

## Component Hierarchy
## Responsive Layout Test

375px: Pass - 1 column
768px: Pass - 2 columns
1280px: Pass - 3 columns

## Keyboard Accessibility Test

- Tab navigation: Pass
- Shift+Tab reverse navigation: Pass
- Location select keyboard operation: Pass
- Apply Filters button: Pass
- Sponsor link: Pass
- Property detail links: Pass
- Visible focus indicators: Pass
- No keyboard traps found

## Lighthouse Accessibility Test

Initial Accessibility Score: 95/100

Issues Found:
1. Background and foreground colors did not have sufficient contrast.
2. Heading elements were not in sequentially descending order.

Fixes:
- Added `text-slate-900` to the Location select for better contrast.
- Changed property title headings from `<h3>` to `<h2>`.
- Changed the SponsorBanner headline from `<h3>` to `<p>`.

Final Accessibility Score: 100/100

Verification:
Reran Lighthouse after the fixes and confirmed an Accessibility score of 100/100.

### Initial Issue

The "Featured Homes" heading had poor color contrast against the dark page background.

Fix:
Changed the heading text to white for better visibility.

Verification:
Reloaded the page and visually confirmed that the heading is clearly readable.

## AI Review

### ChatGPT

Prompt:
Review this React component for semantic HTML, WCAG-oriented keyboard access,
responsive behavior, and TypeScript safety. Return: issue, why it matters,
smallest change, and a manual test. Do not claim compliance from code alone.

Useful Suggestion:
Add "opens in a new tab" to the accessible name of the sponsor link.

Verdict:
Accepted

Reason:
The sponsor link uses target="_blank", so the accessible name should make the
new-tab behavior clear.

Verification:
Used Tab to focus the sponsor link and checked the accessible name after the
change.

### Gemini

Prompt:
Review this React component for semantic HTML, WCAG-oriented keyboard access,
responsive behavior, and TypeScript safety. Return: issue, why it matters,
smallest change, and a manual test. Do not claim compliance from code alone.

Useful Suggestion:
Add "opens in a new tab" to the accessible name of the SponsorBanner link.

Verdict:
Accepted

Reason:
The sponsor link uses target="_blank", so informing users that the link opens
in a new tab makes the behavior clearer.

Verification:
Used Tab to focus the sponsor link and confirmed the link still worked after
the aria-label change.

Rejected Suggestion:
Gemini reported multiple malformed TypeScript and JSX syntax errors in
PropertyCard, SearchFilters, and SponsorBanner.

Verdict:
Rejected

Reason:
The actual project compiled and rendered successfully in the browser.
The reported syntax problems appeared to come from formatting or copying the
code into Gemini rather than the source files themselves.

Verification:
The application rendered correctly, keyboard navigation worked, and the final
Lighthouse Accessibility score was 100/100.

## Accepted and Rejected Suggestions