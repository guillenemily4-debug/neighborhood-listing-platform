
-- Repair missing sponsor eligibility columns.
-- Preserve all existing sponsor records.

ALTER TABLE public.sponsors
ADD COLUMN IF NOT EXISTS is_approved boolean
NOT NULL DEFAULT false,

ADD COLUMN IF NOT EXISTS placement text
NOT NULL DEFAULT 'property-sidebar',

ADD COLUMN IF NOT EXISTS start_date date,

ADD COLUMN IF NOT EXISTS end_date date,

ADD COLUMN IF NOT EXISTS target_zip_codes text[]
NOT NULL DEFAULT '{}',

ADD COLUMN IF NOT EXISTS priority integer
NOT NULL DEFAULT 0;

-- Require valid campaign dates and priority.
ALTER TABLE public.sponsors
ADD CONSTRAINT sponsor_campaign_dates
CHECK (
  start_date IS NULL
  OR end_date IS NULL
  OR end_date >= start_date
);

ALTER TABLE public.sponsors
ADD CONSTRAINT sponsor_priority_valid
CHECK (priority >= 0);
