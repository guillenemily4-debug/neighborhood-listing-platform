
-- Midterm Part 4: Administrator service permissions

-- Allow administrators to approve or suspend
-- services using their authenticated session.

CREATE POLICY exam_services_admin_update
ON public.services
FOR UPDATE
TO authenticated
USING (
    public.is_services_admin()
)
WITH CHECK (
    public.is_services_admin()
);
