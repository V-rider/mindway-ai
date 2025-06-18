
-- First, let's check if the tables exist and create them if they don't
-- Create Students table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.Students (
    sid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    class TEXT NOT NULL
);

-- Create Teachers table if it doesn't exist  
CREATE TABLE IF NOT EXISTS public.Teachers (
    email TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    classes TEXT NOT NULL
);

-- Now insert the sample data
INSERT INTO public.Students (sid, name, email, password, class) VALUES 
('student1', 'Jasper Gay', 'gay.jasper@cfss.edu.hk', 'P9mK2xL4', 'class-1'),
('student2', 'John Doe', 'student@example.com', 'password', 'class-1'),
('student3', 'Jane Smith', 'jane@example.com', 'password', 'class-2')
ON CONFLICT (email) DO NOTHING;

-- Insert sample teacher data  
INSERT INTO public.Teachers (name, email, password, classes) VALUES
('Admin Teacher', 'admin@example.com', 'password', 'class-1'),
('Math Teacher', 'teacher@example.com', 'password', 'class-2')
ON CONFLICT (email) DO NOTHING;
