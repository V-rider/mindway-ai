-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'student', 'teacher')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class enrollments table
CREATE TABLE class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id),
    student_id UUID REFERENCES users(id),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- Create learning materials table
CREATE TABLE learning_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    type VARCHAR(50) CHECK (type IN ('lesson', 'quiz', 'assignment')),
    class_id UUID REFERENCES classes(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student progress table
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id),
    material_id UUID REFERENCES learning_materials(id),
    status VARCHAR(50) CHECK (status IN ('not_started', 'in_progress', 'completed')),
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    criteria TEXT,
    badge_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student achievements table
CREATE TABLE student_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id),
    achievement_id UUID REFERENCES achievements(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, achievement_id)
);

-- Create math challenges table
CREATE TABLE math_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    problem_text TEXT NOT NULL,
    solution TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create challenge attempts table
CREATE TABLE challenge_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id),
    challenge_id UUID REFERENCES math_challenges(id),
    attempt_text TEXT,
    is_correct BOOLEAN,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE math_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_attempts ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users policies
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
ON users FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- Classes policies
CREATE POLICY "Teachers can manage their classes"
ON classes FOR ALL
TO authenticated
USING (
    auth.uid() = teacher_id OR
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
);

CREATE POLICY "Students can view their enrolled classes"
ON classes FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM class_enrollments
        WHERE class_enrollments.class_id = classes.id
        AND class_enrollments.student_id = auth.uid()
    )
);

-- Class enrollments policies
CREATE POLICY "Teachers can manage enrollments for their classes"
ON class_enrollments FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM classes
        WHERE classes.id = class_enrollments.class_id
        AND classes.teacher_id = auth.uid()
    )
);

-- Learning materials policies
CREATE POLICY "Teachers can manage their class materials"
ON learning_materials FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM classes
        WHERE classes.id = learning_materials.class_id
        AND classes.teacher_id = auth.uid()
    )
);

CREATE POLICY "Students can view their class materials"
ON learning_materials FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM class_enrollments
        WHERE class_enrollments.class_id = learning_materials.class_id
        AND class_enrollments.student_id = auth.uid()
    )
);

-- Student progress policies
CREATE POLICY "Students can view their own progress"
ON student_progress FOR SELECT
TO authenticated
USING (
    auth.uid() = student_id OR
    EXISTS (
        SELECT 1 FROM classes c
        JOIN class_enrollments ce ON c.id = ce.class_id
        WHERE ce.student_id = student_progress.student_id
        AND c.teacher_id = auth.uid()
    )
);

-- Create indexes for better performance
CREATE INDEX idx_class_enrollments_student_id ON class_enrollments(student_id);
CREATE INDEX idx_class_enrollments_class_id ON class_enrollments(class_id);
CREATE INDEX idx_learning_materials_class_id ON learning_materials(class_id);
CREATE INDEX idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX idx_student_progress_material_id ON student_progress(material_id);
CREATE INDEX idx_challenge_attempts_student_id ON challenge_attempts(student_id);
CREATE INDEX idx_challenge_attempts_challenge_id ON challenge_attempts(challenge_id); 