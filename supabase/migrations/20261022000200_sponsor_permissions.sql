
-- Require sponsors to be approved and active.

DROP POLICY IF EXISTS
"Public can view active sponsors"
ON public.sponsors;

CREATE POLICY "Public can view approved active sponsors"
ON public.sponsors
FOR SELECT
TO anon, authenticated
USING (
  is_approved = true
  AND is_active = true
);

-- Permit reading only the fields needed for
-- matching and displaying eligible sponsors.
-- Do not expose contact_email.

GRANT SELECT (
  is_approved,
  placement,
  start_date,
  end_date,
  target_zip_codes,
  priority
)
ON TABLE public.sponsors
TO anon, authenticated;
