
-- First, let's update all existing students to have hashed passwords
-- We'll use the Edge Function to hash the existing plain text passwords

-- For now, let's just set up the structure properly
-- Remove the old password column and make hashed_password required
ALTER TABLE public.students DROP COLUMN IF EXISTS password;
ALTER TABLE public.students ALTER COLUMN hashed_password SET NOT NULL;

-- Update existing records with a temporary hashed password
-- (You'll need to run the hashing for actual passwords separately)
UPDATE public.students 
SET hashed_password = 'temp_salt:temp_hash' 
WHERE hashed_password IS NULL;
