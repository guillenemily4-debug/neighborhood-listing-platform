-- Fictional sponsor data for local development
-- Do not use real customer information

INSERT INTO public.sponsors (
    name,
    description,
    website_url,
    is_active
)
SELECT
    'Sample Neighborhood Cafe',
    'Fictional local coffee shop',
    'https://example.com/cafe',
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM public.sponsors
    WHERE name = 'Sample Neighborhood Cafe'
);

INSERT INTO public.sponsors (
    name,
    description,
    website_url,
    is_active
)
SELECT
    'Sample Home Services',
    'Fictional home maintenance business',
    'https://example.com/services',
    FALSE
WHERE NOT EXISTS (
    SELECT 1 FROM public.sponsors
    WHERE name = 'Sample Home Services'
);