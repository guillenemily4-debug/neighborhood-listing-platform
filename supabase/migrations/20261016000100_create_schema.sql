-- Neighborhood Listing Platform: initial schema and access controls
-- Apply only to a clean development database after review.
-- Supabase auth.users must already exist.

CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.properties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    title text NOT NULL CHECK (length(btrim(title)) > 0),
    description text,
    address text NOT NULL CHECK (length(btrim(address)) > 0),
    city text NOT NULL CHECK (length(btrim(city)) > 0),
    state text NOT NULL CHECK (length(btrim(state)) > 0),
    zip_code text NOT NULL CHECK (length(btrim(zip_code)) > 0),
    price numeric(12,2) NOT NULL CHECK (price >= 0),
    bedrooms integer CHECK (bedrooms >= 0),
    bathrooms numeric(3,1) CHECK (bathrooms >= 0),
    is_approved boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.sponsors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL CHECK (length(btrim(name)) > 0),
    description text,
    website_url text,
    contact_email text,
    is_active boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.property_sponsors (
    property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    sponsor_id uuid NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (property_id, sponsor_id)
);

CREATE TABLE public.inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    sender_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_name text NOT NULL CHECK (length(btrim(sender_name)) > 0),
    sender_email text NOT NULL CHECK (length(btrim(sender_email)) > 0),
    message text NOT NULL CHECK (length(btrim(message)) > 0),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Deny by default; individual policies and privileges below allow limited access.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Remove direct table access for API roles, including PUBLIC grants.
REVOKE ALL PRIVILEGES ON TABLE public.profiles, public.properties,
    public.sponsors, public.property_sponsors, public.inquiries
FROM PUBLIC, anon, authenticated;

-- Also remove any explicit column-level grants supplied by project defaults.
REVOKE ALL PRIVILEGES (id, full_name, created_at, updated_at)
    ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES (id, owner_id, title, description, address, city, state,
    zip_code, price, bedrooms, bathrooms, is_approved, created_at, updated_at)
    ON TABLE public.properties FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES (id, name, description, website_url, contact_email,
    is_active, created_at, updated_at)
    ON TABLE public.sponsors FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES (property_id, sponsor_id, created_at)
    ON TABLE public.property_sponsors FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES (id, property_id, sender_id, sender_name,
    sender_email, message, created_at)
    ON TABLE public.inquiries FROM PUBLIC, anon, authenticated;

-- Public visitors see approved listings only.
CREATE POLICY "Public can view approved properties"
ON public.properties FOR SELECT TO anon, authenticated
USING (is_approved = true);

-- Signed-in owners can also see their own drafts.
CREATE POLICY "Owners can view their own properties"
ON public.properties FOR SELECT TO authenticated
USING (owner_id = (SELECT auth.uid()));

CREATE POLICY "Owners can create unapproved properties"
ON public.properties FOR INSERT TO authenticated
WITH CHECK (owner_id = (SELECT auth.uid()) AND is_approved = false);

CREATE POLICY "Owners can update unapproved properties"
ON public.properties FOR UPDATE TO authenticated
USING (owner_id = (SELECT auth.uid()) AND is_approved = false)
WITH CHECK (owner_id = (SELECT auth.uid()) AND is_approved = false);

CREATE POLICY "Public can view active sponsors"
ON public.sponsors FOR SELECT TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Public can view approved property sponsors"
ON public.property_sponsors FOR SELECT TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.id = property_id AND p.is_approved = true
    )
    AND EXISTS (
        SELECT 1 FROM public.sponsors s
        WHERE s.id = sponsor_id AND s.is_active = true
    )
);

-- Read only the public listing columns. RLS still governs which rows appear.
GRANT SELECT (id, title, description, address, city, state, zip_code,
    price, bedrooms, bathrooms, is_approved, created_at)
ON TABLE public.properties TO anon, authenticated;

-- Owners need owner_id to identify their records in authenticated UI routes.
GRANT SELECT (owner_id) ON TABLE public.properties TO authenticated;

-- Do not permit direct changes to owner_id, approval state, or timestamps.
GRANT INSERT (owner_id, title, description, address, city, state, zip_code,
    price, bedrooms, bathrooms)
ON TABLE public.properties TO authenticated;
GRANT UPDATE (title, description, address, city, state, zip_code,
    price, bedrooms, bathrooms)
ON TABLE public.properties TO authenticated;

-- Sponsor contact_email remains private.
GRANT SELECT (id, name, description, website_url, is_active, created_at)
ON TABLE public.sponsors TO anon, authenticated;

-- Read relationship rows only if both referenced rows pass their RLS checks.
GRANT SELECT ON TABLE public.property_sponsors TO anon, authenticated;

-- Profiles and inquiries deliberately have no API role privileges or policies.
-- Trusted server code must authorize any work with those tables.

-- Supabase Auth signup: insert a matching profile using definer's privileges.
CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id) VALUES (NEW.id);
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user()
FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
