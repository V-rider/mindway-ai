
-- Add hashed_password column to students table
ALTER TABLE public.students 
ADD COLUMN hashed_password TEXT;

-- Add hashed_password column to teachers table  
ALTER TABLE public.teachers 
ADD COLUMN hashed_password TEXT;

-- Add a comment to clarify the migration strategy
COMMENT ON COLUMN public.students.hashed_password IS 'New column for Web Crypto API hashed passwords';
COMMENT ON COLUMN public.teachers.hashed_password IS 'New column for Web Crypto API hashed passwords';
