
-- Midterm Version B
-- Allow public RLS policies to evaluate
-- the administrator-checking function.

GRANT EXECUTE
ON FUNCTION public.is_services_admin()
TO anon;
