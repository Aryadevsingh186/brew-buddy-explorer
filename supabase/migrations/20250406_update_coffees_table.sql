
-- Add category and tags columns to coffees table if they don't exist yet
DO $$
BEGIN
    -- Check if category column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'coffees'
        AND column_name = 'category'
    ) THEN
        -- Add category column with default value 'coffee'
        ALTER TABLE public.coffees ADD COLUMN category text DEFAULT 'coffee';
    END IF;
    
    -- Check if tags column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'coffees'
        AND column_name = 'tags'
    ) THEN
        -- Add tags column as an array of text
        ALTER TABLE public.coffees ADD COLUMN tags text[];
    END IF;
END
$$;
