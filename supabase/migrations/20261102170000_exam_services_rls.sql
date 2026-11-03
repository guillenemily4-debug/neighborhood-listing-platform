
-- Midterm Practical Version B
-- Part 4: Services and Bookings Row-Level Security

-- Enable RLS on all five tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_category_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Helper: check administrator role without
-- recursive queries against profiles.
CREATE OR REPLACE FUNCTION public.is_services_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = (SELECT auth.uid())
          AND role = 'admin'
    );
$$;

REVOKE ALL ON FUNCTION public.is_services_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_services_admin()
TO authenticated;

-- Profiles: users can read their own profile;
-- admins can read all.
CREATE POLICY exam_profiles_select
ON public.profiles FOR SELECT
TO authenticated
USING (
    id = (SELECT auth.uid())
    OR public.is_services_admin()
);

-- Categories: public reads active categories.
CREATE POLICY exam_categories_select
ON public.service_categories FOR SELECT
TO anon, authenticated
USING (
    active_status = true
    OR public.is_services_admin()
);

-- Services: public reads approved services;
-- owners can see their own services.
CREATE POLICY exam_services_select
ON public.services FOR SELECT
TO anon, authenticated
USING (
    status = 'approved'
    OR provider_id = (SELECT auth.uid())
    OR public.is_services_admin()
);

-- Providers can insert only their own drafts.
CREATE POLICY exam_services_insert
ON public.services FOR INSERT
TO authenticated
WITH CHECK (
    provider_id = (SELECT auth.uid())
    AND status = 'draft'
);

-- Providers can update only their own drafts
-- or suspended records, without publishing them.
CREATE POLICY exam_services_update
ON public.services FOR UPDATE
TO authenticated
USING (
    provider_id = (SELECT auth.uid())
    AND status IN ('draft', 'suspended')
)
WITH CHECK (
    provider_id = (SELECT auth.uid())
    AND status IN ('draft', 'suspended')
);

-- Providers can delete only their own drafts
-- or suspended records.
CREATE POLICY exam_services_delete
ON public.services FOR DELETE
TO authenticated
USING (
    provider_id = (SELECT auth.uid())
    AND status IN ('draft', 'suspended')
);

-- Public mapping access for approved services.
CREATE POLICY exam_mappings_select
ON public.service_category_mappings FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.services
        WHERE services.id = service_id
          AND services.status = 'approved'
    )
);

-- Anyone can request a booking for an
-- approved service.
CREATE POLICY exam_bookings_insert
ON public.bookings FOR INSERT
TO anon, authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.services
        WHERE services.id = service_id
          AND services.status = 'approved'
    )
);

-- Booking records are visible only to the
-- associated provider or an administrator.
CREATE POLICY exam_bookings_select
ON public.bookings FOR SELECT
TO authenticated
USING (
    public.is_services_admin()
    OR EXISTS (
        SELECT 1
        FROM public.services
        WHERE services.id = service_id
          AND services.provider_id = (SELECT auth.uid())
    )
);
