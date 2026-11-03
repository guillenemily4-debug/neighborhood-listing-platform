
-- Restrict service creation to authenticated
-- merchants and providers.

DROP POLICY IF EXISTS exam_services_insert
ON public.services;

CREATE POLICY exam_services_insert
ON public.services
FOR INSERT
TO authenticated
WITH CHECK (
    provider_id = (SELECT auth.uid())
    AND status = 'draft'
    AND EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = (SELECT auth.uid())
          AND role IN ('merchant', 'provider')
    )
);
