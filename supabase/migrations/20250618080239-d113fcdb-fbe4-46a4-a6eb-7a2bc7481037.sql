
-- Add hashed_password column to teachers table if it doesn't exist
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS hashed_password TEXT;

-- Update existing teachers with temporary hash that will be migrated
UPDATE public.teachers 
SET hashed_password = 'temp_salt:temp_hash' 
WHERE hashed_password IS NULL;
