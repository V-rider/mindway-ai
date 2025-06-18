
-- Add hashed_password column to students table if it doesn't exist
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS hashed_password TEXT;

-- Add hashed_password column to teachers table if it doesn't exist
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS hashed_password TEXT;

-- Update existing students with temporary hash that will be migrated
UPDATE public.students 
SET hashed_password = 'temp_salt:temp_hash' 
WHERE hashed_password IS NULL;

-- Update existing teachers with temporary hash that will be migrated
UPDATE public.teachers 
SET hashed_password = 'temp_salt:temp_hash' 
WHERE hashed_password IS NULL;
