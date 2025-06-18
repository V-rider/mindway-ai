
-- Add hashed_password column to students table if it doesn't exist
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS hashed_password TEXT;

-- Set temporary hash for existing students
UPDATE public.students 
SET hashed_password = 'temp_salt:temp_hash' 
WHERE hashed_password IS NULL;

-- Make the column required (after setting temporary values)
ALTER TABLE public.students ALTER COLUMN hashed_password SET NOT NULL;

-- Add hashed_password column to teachers table if it doesn't exist
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS hashed_password TEXT;

-- Set temporary hash for existing teachers
UPDATE public.teachers 
SET hashed_password = 'temp_salt:temp_hash' 
WHERE hashed_password IS NULL;
