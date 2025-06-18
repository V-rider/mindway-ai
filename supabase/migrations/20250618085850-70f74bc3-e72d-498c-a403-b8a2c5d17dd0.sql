
-- Force add the hashed_password column to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS hashed_password TEXT;

-- Force add the hashed_password column to teachers table  
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS hashed_password TEXT;

-- Set default values for any existing records
UPDATE public.students 
SET hashed_password = 'temp_salt:temp_hash' 
WHERE hashed_password IS NULL;

UPDATE public.teachers 
SET hashed_password = 'temp_salt:temp_hash' 
WHERE hashed_password IS NULL;

-- Verify the columns exist by checking table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'students' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'teachers' AND table_schema = 'public'
ORDER BY ordinal_position;
