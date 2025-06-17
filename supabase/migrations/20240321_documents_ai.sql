-- Create documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    class_id UUID REFERENCES classes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document analysis table
CREATE TABLE document_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id),
    analysis_type VARCHAR(50) NOT NULL CHECK (analysis_type IN ('summary', 'key_points', 'difficulty', 'topics')),
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document annotations table
CREATE TABLE document_annotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id),
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    page_number INTEGER,
    position_x FLOAT,
    position_y FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document highlights table
CREATE TABLE document_highlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id),
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    page_number INTEGER,
    start_position INTEGER,
    end_position INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_highlights ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Documents policies
CREATE POLICY "Teachers can manage their class documents"
ON documents FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM classes
        WHERE classes.id = documents.class_id
        AND classes.teacher_id = auth.uid()
    )
);

CREATE POLICY "Students can view their class documents"
ON documents FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM class_enrollments
        WHERE class_enrollments.class_id = documents.class_id
        AND class_enrollments.student_id = auth.uid()
    )
);

-- Document analysis policies
CREATE POLICY "Users can view analysis of accessible documents"
ON document_analysis FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM documents
        WHERE documents.id = document_analysis.document_id
        AND (
            documents.uploaded_by = auth.uid()
            OR EXISTS (
                SELECT 1 FROM class_enrollments
                WHERE class_enrollments.class_id = documents.class_id
                AND class_enrollments.student_id = auth.uid()
            )
        )
    )
);

-- Document annotations policies
CREATE POLICY "Users can manage their own annotations"
ON document_annotations FOR ALL
TO authenticated
USING (
    user_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM documents
        WHERE documents.id = document_annotations.document_id
        AND (
            documents.uploaded_by = auth.uid()
            OR EXISTS (
                SELECT 1 FROM class_enrollments
                WHERE class_enrollments.class_id = documents.class_id
                AND class_enrollments.student_id = auth.uid()
            )
        )
    )
);

-- Document highlights policies
CREATE POLICY "Users can manage their own highlights"
ON document_highlights FOR ALL
TO authenticated
USING (
    user_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM documents
        WHERE documents.id = document_highlights.document_id
        AND (
            documents.uploaded_by = auth.uid()
            OR EXISTS (
                SELECT 1 FROM class_enrollments
                WHERE class_enrollments.class_id = documents.class_id
                AND class_enrollments.student_id = auth.uid()
            )
        )
    )
);

-- Create indexes for better performance
CREATE INDEX idx_documents_class_id ON documents(class_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_document_analysis_document_id ON document_analysis(document_id);
CREATE INDEX idx_document_annotations_document_id ON document_annotations(document_id);
CREATE INDEX idx_document_annotations_user_id ON document_annotations(user_id);
CREATE INDEX idx_document_highlights_document_id ON document_highlights(document_id);
CREATE INDEX idx_document_highlights_user_id ON document_highlights(user_id); 