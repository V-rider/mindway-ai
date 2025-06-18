
-- Create a function to hash passwords using pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update students table with hashed passwords
UPDATE students 
SET hashed_password = crypt(password, gen_salt('bf'))
WHERE hashed_password IS NULL;

-- Update teachers table with hashed passwords  
UPDATE teachers
SET hashed_password = crypt(password, gen_salt('bf'))
WHERE hashed_password IS NULL;
