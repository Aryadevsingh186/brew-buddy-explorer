
-- Create coffees table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.coffees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies for the coffees table
ALTER TABLE public.coffees ENABLE ROW LEVEL SECURITY;

-- Admin can do anything with coffees
CREATE POLICY IF NOT EXISTS "Admins can do anything with coffees"
ON public.coffees
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Anyone can view coffees
CREATE POLICY IF NOT EXISTS "Anyone can view coffees"
ON public.coffees
FOR SELECT
USING (true);
