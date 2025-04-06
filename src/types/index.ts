
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
  classId?: string;
}

export interface TestMeta {
  id: string;
  name: string;
  subject: string;
  date: string;
  userId: string;
  createdAt: string;
  studentId?: string;
}

export interface TestResult {
  id: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  concepts: ConceptResult[];
  errorTypes: ErrorTypeResult[];
  recommendations: string[];
  createdAt: string;
  studentId?: string;
  studentName?: string;
}

export interface Question {
  id: string;
  number: number;
  concept: string;
  isCorrect: boolean;
  errorType?: string;
  notes?: string;
}

export interface ConceptResult {
  name: string;
  score: number;
  total: number;
  percentage: number;
}

export interface ErrorTypeResult {
  type: string;
  count: number;
  percentage: number;
}

export interface LearningPath {
  strand: string;
  topics: LearningTopic[];
}

export interface LearningTopic {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  progress: number;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: number;
  completed: boolean;
}

export interface MenuItem {
  title: string;
  path: string;
  icon: React.ComponentType;
}

export interface ClassData {
  id: string;
  name: string;
  grade: string;
  studentCount: number;
}

export interface StudentPerformance {
  id: string;
  name: string;
  avatar?: string;
  averageScore: number;
  improvement: number;
  strengths: string[];
  weaknesses: string[];
}

export interface School {
  id: string;
  name: string;
  classes: ClassData[];
}

export interface ClassPerformance {
  id: string;
  name: string;
  grade: string;
  averageScore: number;
  topicMastery: TopicMastery[];
  errorPatterns: ErrorPattern[];
}

export interface TopicMastery {
  topic: string;
  mastery: number; // 0-100
}

export interface ErrorPattern {
  pattern: string;
  percentage: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  grade: string;
  className: string;
  averageScore: number;
  progressData: ProgressDataPoint[];
  mistakeBreakdown: MistakeType[];
  strengths: string[];
  weaknesses: string[];
  recommendedExercises: RecommendedExercise[];
}

export interface ProgressDataPoint {
  date: string;
  score: number;
  testId: string;
  testName: string;
}

export interface MistakeType {
  type: string;
  percentage: number;
}

export interface RecommendedExercise {
  id: string;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: 'student' | 'class' | 'school';
  frequency: 'weekly' | 'monthly' | 'custom';
  recipients: string[];
  format: 'pdf' | 'csv';
}

export interface HeatmapData {
  className: string;
  grade: string;
  topics: {
    name: string;
    performance: number; // 0-100
  }[];
}
