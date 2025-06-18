
-- Drop the existing tables with uppercase names if they exist
DROP TABLE IF EXISTS public.Students CASCADE;
DROP TABLE IF EXISTS public.Teachers CASCADE;

-- Create tables with lowercase names to match TypeScript types
CREATE TABLE IF NOT EXISTS public.students (
    sid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    class TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.teachers (
    email TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    classes TEXT NOT NULL
);

-- Insert the sample data into the correct lowercase tables
INSERT INTO public.students (sid, name, email, password, class) VALUES 
('student1', 'Jasper Gay', 'gay.jasper@cfss.edu.hk', 'P9mK2xL4', 'class-1'),
('student2', 'John Doe', 'student@example.com', 'password', 'class-1'),
('student3', 'Jane Smith', 'jane@example.com', 'password', 'class-2')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.teachers (name, email, password, classes) VALUES
('Admin Teacher', 'admin@example.com', 'password', 'class-1'),
('Math Teacher', 'teacher@example.com', 'password', 'class-2')
ON CONFLICT (email) DO NOTHING;
