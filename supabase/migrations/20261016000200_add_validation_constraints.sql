
-- Add database-level validation to property listings.
-- Complements existing Next.js Zod validation.

ALTER TABLE public.properties
ADD CONSTRAINT property_title_length
CHECK (length(trim(title)) BETWEEN 1 AND 150),

ADD CONSTRAINT property_description_length
CHECK (description IS NULL OR length(description) <= 2000),

ADD CONSTRAINT property_address_length
CHECK (length(trim(address)) BETWEEN 1 AND 200),

ADD CONSTRAINT property_city_length
CHECK (length(trim(city)) BETWEEN 1 AND 100),

ADD CONSTRAINT property_state_length
CHECK (length(trim(state)) BETWEEN 2 AND 50),

ADD CONSTRAINT property_zip_format
CHECK (zip_code ~ '^[0-9]{5}(-[0-9]{4})?$'),

ADD CONSTRAINT property_bedrooms_limit
CHECK (bedrooms IS NULL OR bedrooms <= 100),

ADD CONSTRAINT property_bathrooms_limit
CHECK (bathrooms IS NULL OR bathrooms <= 99.9),

ADD CONSTRAINT property_price_limit
CHECK (price <= 9999999999.99);
