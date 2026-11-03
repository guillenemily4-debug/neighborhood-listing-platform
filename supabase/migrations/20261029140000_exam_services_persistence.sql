
-- Midterm Practical Version B
-- Local Services & Appointment Booking Subsystem

-- 1. Extend existing Lab 5 profiles table

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT;

UPDATE public.profiles
SET role = 'client'
WHERE role IS NULL;

ALTER TABLE public.profiles
ALTER COLUMN role SET DEFAULT 'client';

ALTER TABLE public.profiles
ALTER COLUMN role SET NOT NULL;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('admin', 'merchant', 'provider', 'client'));

-- 2. Service categories


-- 2. Service categories
CREATE TABLE public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL
        CHECK (char_length(name) >= 3),
    slug TEXT NOT NULL UNIQUE
        CHECK (slug ~* '^[a-z0-9-]+$'),
    active_status BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL
        DEFAULT timezone('utc'::text, now())
);

-- 3. Merchant services
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE RESTRICT,
    title TEXT NOT NULL
        CHECK (char_length(title) >= 5),
    hourly_rate NUMERIC(10, 2) NOT NULL
        CHECK (hourly_rate >= 0),
    duration_minutes INTEGER NOT NULL
        CHECK (duration_minutes >= 15),
    coverage_radius_miles INTEGER NOT NULL
        CHECK (coverage_radius_miles > 0),
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN (
            'draft', 'pending', 'approved', 'suspended'
        )),
    created_at TIMESTAMPTZ NOT NULL
        DEFAULT timezone('utc'::text, now())
);

-- 4. Many-to-many service/category mappings
CREATE TABLE public.service_category_mappings (
    service_id UUID NOT NULL
        REFERENCES public.services(id) ON DELETE CASCADE,
    category_id UUID NOT NULL
        REFERENCES public.service_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (service_id, category_id)
);

-- 5. Appointment bookings
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL
        REFERENCES public.services(id) ON DELETE CASCADE,
    client_email TEXT NOT NULL
        CHECK (
            client_email ~*
            '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        ),
    requested_date DATE NOT NULL,
    notes TEXT NOT NULL
        CHECK (char_length(notes) >= 10),
    created_at TIMESTAMPTZ NOT NULL
        DEFAULT timezone('utc'::text, now())
);

-- Default-deny security foundation
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_category_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
