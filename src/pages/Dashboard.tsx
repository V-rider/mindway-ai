
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Analytics from "./Analytics";
import { 
  School, 
  ClassPerformance, 
  StudentProfile, 
  HeatmapData, 
  StudentPerformance, 
  ReportTemplate 
} from "@/types";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { PerformanceHeatmap } from "@/components/dashboard/PerformanceHeatmap";
import { ClassPerformanceCard } from "@/components/dashboard/ClassPerformanceCard";
import { StudentProfileCard } from "@/components/dashboard/StudentProfileCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { ReportGenerator } from "@/components/dashboard/ReportGenerator";
import { useIsMobile } from "@/hooks/use-mobile";
import { PaperMiscorrectionChecker } from "@/components/dashboard/PaperMiscorrectionChecker";

import { Button } from "@/components/ui/button";
import { 
  Download, 
  ChevronLeft, 
  Search, 
  FileText,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const mockSchool: School = {
  id: "school-1",
  name: "Riverdale Elementary",
  classes: [
    { id: "class-1", name: "Class 3A", grade: "3", studentCount: 24 },
    { id: "class-2", name: "Class 3B", grade: "3", studentCount: 22 },
    { id: "class-3", name: "Class 3C", grade: "3", studentCount: 23 },
    { id: "class-4", name: "Class 3D", grade: "3", studentCount: 25 },
    { id: "class-5", name: "Class 4A", grade: "4", studentCount: 26 },
    { id: "class-6", name: "Class 4B", grade: "4", studentCount: 22 },
    { id: "class-7", name: "Class 4C", grade: "4", studentCount: 24 },
    { id: "class-8", name: "Class 4D", grade: "4", studentCount: 23 },
    { id: "class-9", name: "Class 5A", grade: "5", studentCount: 25 },
    { id: "class-10", name: "Class 5B", grade: "5", studentCount: 24 },
    { id: "class-11", name: "Class 5C", grade: "5", studentCount: 20 },
    { id: "class-12", name: "Class 5D", grade: "5", studentCount: 22 },
    { id: "class-13", name: "Class 6A", grade: "6", studentCount: 25 },
    { id: "class-14", name: "Class 6B", grade: "6", studentCount: 23 },
    { id: "class-15", name: "Class 6C", grade: "6", studentCount: 24 },
    { id: "class-16", name: "Class 6D", grade: "6", studentCount: 26 },
  ]
};

const mockClassPerformances: ClassPerformance[] = [
  {
    id: "class-1",
    name: "Class 3A",
    grade: "3",
    averageScore: 72,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 85 },
      { topic: "Multiplication", mastery: 76 },
      { topic: "Division", mastery: 65 },
      { topic: "Fractions", mastery: 58 },
      { topic: "Geometry", mastery: 74 },
    ],
    errorPatterns: [
      { pattern: "Improper fraction simplification", percentage: 45 },
      { pattern: "Division calculation errors", percentage: 30 },
      { pattern: "Misunderstood word problems", percentage: 25 },
    ]
  },
  {
    id: "class-2",
    name: "Class 3B",
    grade: "3",
    averageScore: 76,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 88 },
      { topic: "Multiplication", mastery: 80 },
      { topic: "Division", mastery: 70 },
      { topic: "Fractions", mastery: 65 },
      { topic: "Geometry", mastery: 78 },
    ],
    errorPatterns: [
      { pattern: "Improper fraction simplification", percentage: 40 },
      { pattern: "Division calculation errors", percentage: 35 },
      { pattern: "Geometry concept misunderstanding", percentage: 28 },
    ]
  },
  {
    id: "class-3",
    name: "Class 3C",
    grade: "3",
    averageScore: 68,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 80 },
      { topic: "Multiplication", mastery: 72 },
      { topic: "Division", mastery: 60 },
      { topic: "Fractions", mastery: 55 },
      { topic: "Geometry", mastery: 70 },
    ],
    errorPatterns: [
      { pattern: "Division calculation errors", percentage: 48 },
      { pattern: "Improper fraction simplification", percentage: 42 },
      { pattern: "Word problem interpretation", percentage: 35 },
    ]
  },
  {
    id: "class-4",
    name: "Class 3D",
    grade: "3",
    averageScore: 81,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 92 },
      { topic: "Multiplication", mastery: 85 },
      { topic: "Division", mastery: 75 },
      { topic: "Fractions", mastery: 72 },
      { topic: "Geometry", mastery: 82 },
    ],
    errorPatterns: [
      { pattern: "Fraction operations", percentage: 35 },
      { pattern: "Complex word problems", percentage: 30 },
      { pattern: "Division with remainders", percentage: 25 },
    ]
  },
  {
    id: "class-5",
    name: "Class 4A",
    grade: "4",
    averageScore: 75,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 92 },
      { topic: "Multiplication", mastery: 84 },
      { topic: "Division", mastery: 76 },
      { topic: "Fractions", mastery: 65 },
      { topic: "Decimals", mastery: 60 },
      { topic: "Geometry", mastery: 72 },
    ],
    errorPatterns: [
      { pattern: "Decimal place value confusion", percentage: 45 },
      { pattern: "Improper fraction simplification", percentage: 38 },
      { pattern: "Geometry concept misunderstanding", percentage: 30 },
    ]
  },
  {
    id: "class-6",
    name: "Class 4B",
    grade: "4",
    averageScore: 68,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 90 },
      { topic: "Multiplication", mastery: 82 },
      { topic: "Division", mastery: 72 },
      { topic: "Fractions", mastery: 60 },
      { topic: "Decimals", mastery: 55 },
      { topic: "Geometry", mastery: 65 },
    ],
    errorPatterns: [
      { pattern: "Decimal place value confusion", percentage: 50 },
      { pattern: "Improper fraction simplification", percentage: 35 },
      { pattern: "Geometry concept misunderstanding", percentage: 28 },
    ]
  },
  {
    id: "class-7",
    name: "Class 4C",
    grade: "4",
    averageScore: 82,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 95 },
      { topic: "Multiplication", mastery: 88 },
      { topic: "Division", mastery: 80 },
      { topic: "Fractions", mastery: 75 },
      { topic: "Decimals", mastery: 70 },
      { topic: "Geometry", mastery: 85 },
    ],
    errorPatterns: [
      { pattern: "Complex fraction operations", percentage: 35 },
      { pattern: "Decimal calculations", percentage: 32 },
      { pattern: "Word problem interpretation", percentage: 25 },
    ]
  },
  {
    id: "class-8",
    name: "Class 4D",
    grade: "4",
    averageScore: 71,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 88 },
      { topic: "Multiplication", mastery: 78 },
      { topic: "Division", mastery: 68 },
      { topic: "Fractions", mastery: 62 },
      { topic: "Decimals", mastery: 58 },
      { topic: "Geometry", mastery: 70 },
    ],
    errorPatterns: [
      { pattern: "Decimal operations", percentage: 45 },
      { pattern: "Fraction to decimal conversion", percentage: 40 },
      { pattern: "Word problem comprehension", percentage: 32 },
    ]
  },
  {
    id: "class-9",
    name: "Class 5A",
    grade: "5",
    averageScore: 84,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 96 },
      { topic: "Multiplication", mastery: 92 },
      { topic: "Division", mastery: 85 },
      { topic: "Fractions", mastery: 80 },
      { topic: "Decimals", mastery: 75 },
      { topic: "Percentages", mastery: 72 },
      { topic: "Geometry", mastery: 88 },
    ],
    errorPatterns: [
      { pattern: "Percentage calculation errors", percentage: 30 },
      { pattern: "Complex fraction operations", percentage: 25 },
      { pattern: "Word problem interpretation", percentage: 20 },
    ]
  },
  {
    id: "class-10",
    name: "Class 5B",
    grade: "5",
    averageScore: 74,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 90 },
      { topic: "Multiplication", mastery: 85 },
      { topic: "Division", mastery: 78 },
      { topic: "Fractions", mastery: 72 },
      { topic: "Decimals", mastery: 68 },
      { topic: "Percentages", mastery: 63 },
      { topic: "Geometry", mastery: 75 },
    ],
    errorPatterns: [
      { pattern: "Percentage calculations", percentage: 42 },
      { pattern: "Complex fraction operations", percentage: 35 },
      { pattern: "Multi-step problems", percentage: 30 },
    ]
  },
  {
    id: "class-11",
    name: "Class 5C",
    grade: "5",
    averageScore: 78,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 94 },
      { topic: "Multiplication", mastery: 88 },
      { topic: "Division", mastery: 82 },
      { topic: "Fractions", mastery: 75 },
      { topic: "Decimals", mastery: 70 },
      { topic: "Percentages", mastery: 68 },
      { topic: "Geometry", mastery: 80 },
    ],
    errorPatterns: [
      { pattern: "Percentage calculation errors", percentage: 35 },
      { pattern: "Complex fraction operations", percentage: 28 },
      { pattern: "Word problem interpretation", percentage: 22 },
    ]
  },
  {
    id: "class-12",
    name: "Class 5D",
    grade: "5",
    averageScore: 80,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 95 },
      { topic: "Multiplication", mastery: 90 },
      { topic: "Division", mastery: 84 },
      { topic: "Fractions", mastery: 78 },
      { topic: "Decimals", mastery: 72 },
      { topic: "Percentages", mastery: 70 },
      { topic: "Geometry", mastery: 82 },
    ],
    errorPatterns: [
      { pattern: "Percentage word problems", percentage: 32 },
      { pattern: "Mixed operations", percentage: 28 },
      { pattern: "Geometry applications", percentage: 24 },
    ]
  },
  {
    id: "class-13",
    name: "Class 6A",
    grade: "6",
    averageScore: 83,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 96 },
      { topic: "Multiplication", mastery: 92 },
      { topic: "Division", mastery: 88 },
      { topic: "Fractions", mastery: 85 },
      { topic: "Decimals", mastery: 82 },
      { topic: "Percentages", mastery: 78 },
      { topic: "Pre-Algebra", mastery: 75 },
      { topic: "Geometry", mastery: 84 },
    ],
    errorPatterns: [
      { pattern: "Pre-algebra concept confusion", percentage: 30 },
      { pattern: "Complex word problems", percentage: 25 },
      { pattern: "Multi-step calculation errors", percentage: 20 },
    ]
  },
  {
    id: "class-14",
    name: "Class 6B",
    grade: "6",
    averageScore: 75,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 94 },
      { topic: "Multiplication", mastery: 88 },
      { topic: "Division", mastery: 82 },
      { topic: "Fractions", mastery: 78 },
      { topic: "Decimals", mastery: 74 },
      { topic: "Percentages", mastery: 70 },
      { topic: "Pre-Algebra", mastery: 62 },
      { topic: "Geometry", mastery: 75 },
    ],
    errorPatterns: [
      { pattern: "Pre-algebra concept confusion", percentage: 40 },
      { pattern: "Complex fraction operations", percentage: 32 },
      { pattern: "Multi-step calculation errors", percentage: 28 },
    ]
  },
  {
    id: "class-15",
    name: "Class 6C",
    grade: "6",
    averageScore: 79,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 95 },
      { topic: "Multiplication", mastery: 90 },
      { topic: "Division", mastery: 85 },
      { topic: "Fractions", mastery: 80 },
      { topic: "Decimals", mastery: 78 },
      { topic: "Percentages", mastery: 73 },
      { topic: "Pre-Algebra", mastery: 68 },
      { topic: "Geometry", mastery: 82 },
    ],
    errorPatterns: [
      { pattern: "Pre-algebra variable usage", percentage: 35 },
      { pattern: "Percentage calculation errors", percentage: 30 },
      { pattern: "Geometry proof understanding", percentage: 25 },
    ]
  },
  {
    id: "class-16",
    name: "Class 6D",
    grade: "6",
    averageScore: 81,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 97 },
      { topic: "Multiplication", mastery: 93 },
      { topic: "Division", mastery: 87 },
      { topic: "Fractions", mastery: 83 },
      { topic: "Decimals", mastery: 80 },
      { topic: "Percentages", mastery: 75 },
      { topic: "Pre-Algebra", mastery: 72 },
      { topic: "Geometry", mastery: 88 },
    ],
    errorPatterns: [
      { pattern: "Algebra equation solving", percentage: 28 },
      { pattern: "Word problem interpretation", percentage: 24 },
      { pattern: "Mixed fraction operations", percentage: 22 },
    ]
  },
];

const mockStudents: StudentPerformance[] = [
  {
    id: "student-1",
    name: "Emma Johnson",
    averageScore: 85,
    improvement: 5,
    strengths: ["Multiplication", "Word Problems"],
    weaknesses: ["Fractions", "Percentages"],
  },
  {
    id: "student-2",
    name: "James Smith",
    averageScore: 72,
    improvement: -2,
    strengths: ["Addition & Subtraction", "Geometry"],
    weaknesses: ["Division", "Word Problems"],
  },
  {
    id: "student-3",
    name: "Sofia Garcia",
    averageScore: 91,
    improvement: 8,
    strengths: ["Fractions", "Geometry", "Word Problems"],
    weaknesses: ["Complex Calculations"],
  },
  {
    id: "student-4",
    name: "Noah Wilson",
    averageScore: 68,
    improvement: 3,
    strengths: ["Addition & Subtraction"],
    weaknesses: ["Fractions", "Word Problems", "Multi-step Problems"],
  },
  {
    id: "student-5",
    name: "Olivia Brown",
    averageScore: 79,
    improvement: 4,
    strengths: ["Multiplication", "Division"],
    weaknesses: ["Fractions", "Geometry"],
  },
  {
    id: "student-6",
    name: "Liam Taylor",
    averageScore: 65,
    improvement: 7,
    strengths: ["Addition & Subtraction"],
    weaknesses: ["Multiplication", "Division", "Fractions"],
  },
  {
    id: "student-7",
    name: "Ethan Miller",
    averageScore: 84,
    improvement: 6,
    strengths: ["Geometry", "Pre-Algebra", "Word Problems"],
    weaknesses: ["Complex Fractions"],
  },
  {
    id: "student-8",
    name: "Isabella Chen",
    averageScore: 91,
    improvement: 4,
    strengths: ["All Mathematical Operations", "Problem Solving"],
    weaknesses: ["Time Management"],
  },
  {
    id: "student-9",
    name: "Lucas Rodriguez",
    averageScore: 73,
    improvement: 8,
    strengths: ["Geometry", "Patterns"],
    weaknesses: ["Word Problems", "Pre-Algebra Concepts"],
  },
];

const mockStudentProfile: StudentProfile = {
  id: "student-1",
  name: "Emma Johnson",
  email: "emma.j@example.edu",
  grade: "3",
  className: "Class 3A",
  averageScore: 85,
  progressData: [
    { date: "2023-09-05", score: 75, testId: "test-1", testName: "Math Fundamentals Quiz" },
    { date: "2023-09-18", score: 78, testId: "test-2", testName: "Number Operations Test" },
    { date: "2023-10-02", score: 82, testId: "test-3", testName: "Fractions Assessment" },
    { date: "2023-10-15", score: 80, testId: "test-4", testName: "Geometry Basics" },
    { date: "2023-10-30", score: 85, testId: "test-5", testName: "Mixed Topics Quiz" },
    { date: "2023-11-12", score: 90, testId: "test-6", testName: "Mid-Term Assessment" },
  ],
  mistakeBreakdown: [
    { type: "Calculation Errors", percentage: 30 },
    { type: "Conceptual Gaps", percentage: 40 },
    { type: "Careless Mistakes", percentage: 20 },
    { type: "Time Management", percentage: 10 },
  ],
  strengths: [
    "Strong understanding of basic arithmetic operations",
    "Excellent at solving word problems",
    "Good visualization skills for geometric concepts",
  ],
  weaknesses: [
    "Struggles with fraction simplification",
    "Needs more practice with decimal operations",
    "Difficulty with multi-step problems",
  ],
  recommendedExercises: [
    { id: "ex-1", title: "Fraction Fundamentals", topic: "Fractions", difficulty: "medium" },
    { id: "ex-2", title: "Decimal Operations", topic: "Decimals", difficulty: "medium" },
    { id: "ex-3", title: "Multi-Step Problem Solving", topic: "Problem Solving", difficulty: "hard" },
    { id: "ex-4", title: "Geometry Practice", topic: "Geometry", difficulty: "easy" },
  ],
};

const mockHeatmapData: HeatmapData[] = [
  {
    className: "Class 3A",
    grade: "3",
    topics: [
      { name: "Addition & Subtraction", performance: 85 },
      { name: "Multiplication", performance: 76 },
      { name: "Division", performance: 65 },
      { name: "Fractions", performance: 58 },
      { name: "Geometry", performance: 74 },
    ],
  },
  {
    className: "Class 3B",
    grade: "3",
    topics: [
      { name: "Addition & Subtraction", performance: 88 },
      { name: "Multiplication", performance: 80 },
      { name: "Division", performance: 70 },
      { name: "Fractions", performance: 65 },
      { name: "Geometry", performance: 78 },
    ],
  },
  {
    className: "Class 3C",
    grade: "3",
    topics: [
      { name: "Addition & Subtraction", performance: 80 },
      { name: "Multiplication", performance: 72 },
      { name: "Division", performance: 60 },
      { name: "Fractions", performance: 55 },
      { name: "Geometry", performance: 70 },
    ],
  },
  {
    className: "Class 3D",
    grade: "3",
    topics: [
      { name: "Addition & Subtraction", performance: 92 },
      { name: "Multiplication", performance: 85 },
      { name: "Division", performance: 75 },
      { name: "Fractions", performance: 72 },
      { name: "Geometry", performance: 82 },
    ],
  },
  {
    className: "Class 4A",
    grade: "4",
    topics: [
      { name: "Addition & Subtraction", performance: 92 },
      { name: "Multiplication", performance: 84 },
      { name: "Division", performance: 76 },
      { name: "Fractions", performance: 65 },
      { name: "Decimals", performance: 60 },
      { name: "Geometry", performance: 72 },
    ],
  },
  {
    className: "Class 4B",
    grade: "4",
    topics: [
      { name: "Addition & Subtraction", performance: 90 },
      { name: "Multiplication", performance: 82 },
      { name: "Division", performance: 72 },
      { name: "Fractions", performance: 60 },
      { name: "Decimals", performance: 55 },
      { name: "Geometry", performance: 65 },
    ],
  },
  {
    className: "Class 4C",
    grade: "4",
    topics: [
      { name: "Addition & Subtraction", performance: 95 },
      { name: "Multiplication", performance: 88 },
      { name: "Division", performance: 80 },
      { name: "Fractions", performance: 75 },
      { name: "Decimals", performance: 70 },
      { name: "Geometry", performance: 85 },
    ],
  },
  {
    className: "Class 4D",
    grade: "4",
    topics: [
      { name: "Addition & Subtraction", performance: 88 },
      { name: "Multiplication", performance: 78 },
      { name: "Division", performance: 68 },
      { name: "Fractions", performance: 62 },
      { name: "Decimals", performance: 58 },
      { name: "Geometry", performance: 70 },
    ],
  },
  {
    className: "Class 5A",
    grade: "5",
    topics: [
      { name: "Addition & Subtraction", performance: 96 },
      { name: "Multiplication", performance: 92 },
      { name: "Division", performance: 85 },
      { name: "Fractions", performance: 80 },
      { name: "Decimals", performance: 75 },
      { name: "Percentages", performance: 72 },
      { name: "Geometry", performance: 88 },
    ],
  },
  {
    className: "Class 5B",
    grade: "5",
    topics: [
      { name: "Addition & Subtraction", performance: 90 },
      { name: "Multiplication", performance: 85 },
      { name: "Division", performance: 78 },
      { name: "Fractions", performance: 72 },
      { name: "Decimals", performance: 68 },
      { name: "Percentages", performance: 63 },
      { name: "Geometry", performance: 75 },
    ],
  },
  {
    className: "Class 5C",
    grade: "5",
    topics: [
      { name: "Addition & Subtraction", performance: 94 },
      { name: "Multiplication", performance: 88 },
      { name: "Division", performance: 82 },
      { name: "Fractions", performance: 75 },
      { name: "Decimals", performance: 70 },
      { name: "Percentages", performance: 68 },
      { name: "Geometry", performance: 80 },
    ],
  },
  {
    className: "Class 5D",
    grade: "5",
    topics: [
      { name: "Addition & Subtraction", performance: 95 },
      { name: "Multiplication", performance: 90 },
      { name: "Division", performance: 84 },
      { name: "Fractions", performance: 78 },
      { name: "Decimals", performance: 72 },
      { name: "Percentages", performance: 70 },
      { name: "Geometry", performance: 82 },
    ],
  },
  {
    className: "Class 6A",
    grade: "6",
    topics: [
      { name: "Addition & Subtraction", performance: 96 },
      { name: "Multiplication", performance: 92 },
      { name: "Division", performance: 88 },
      { name: "Fractions", performance: 85 },
      { name: "Decimals", performance: 82 },
      { name: "Percentages", performance: 78 },
      { name: "Pre-Algebra", performance: 75 },
      { name: "Geometry", performance: 84 },
    ],
  },
  {
    className: "Class 6B",
    grade: "6",
    topics: [
      { name: "Addition & Subtraction", performance: 94 },
      { name: "Multiplication", performance: 88 },
      { name: "Division", performance: 82 },
      { name: "Fractions", performance: 78 },
      { name: "Decimals", performance: 74 },
      { name: "Percentages", performance: 70 },
      { name: "Pre-Algebra", performance: 62 },
      { name: "Geometry", performance: 75 },
    ],
  },
  {
    className: "Class 6C",
    grade: "6",
    topics: [
      { name: "Addition & Subtraction", performance: 95 },
      { name: "Multiplication", performance: 90 },
      { name: "Division", performance: 85 },
      { name: "Fractions", performance: 80 },
      { name: "Decimals", performance: 78 },
      { name: "Percentages", performance: 73 },
      { name: "Pre-Algebra", performance: 68 },
      { name: "Geometry", performance: 82 },
    ],
  },
  {
    className: "Class 6D",
    grade: "6",
    topics: [
      { name: "Addition & Subtraction", performance: 97 },
      { name: "Multiplication", performance: 93 },
      { name: "Division", performance: 87 },
      { name: "Fractions", performance: 83 },
      { name: "Decimals", performance: 80 },
      { name: "Percentages", performance: 75 },
      { name: "Pre-Algebra", performance: 72 },
      { name: "Geometry", performance: 88 },
    ],
  },
];

const mockReportTemplates: ReportTemplate[] = [
  {
    id: "template-1",
    name: "Student Progress Report",
    type: "student",
    frequency: "weekly",
    recipients: [],
    format: "pdf",
  },
  {
    id: "template-2",
    name: "Class Performance Summary",
    type: "class",
    frequency: "monthly",
    recipients: [],
    format: "pdf",
  },
  {
    id: "template-3",
    name: "School-Wide Analytics",
    type: "school",
    frequency: "monthly",
    recipients: [],
    format: "pdf",
  },
  {
    id: "template-4",
    name: "Raw Data Export",
    type: "school",
    frequency: "custom",
    recipients: [],
    format: "csv",
  },
];

// Grade and subjects list for filters
const gradesList = ["3", "4", "5", "6"];
const subjectsList = ["Mathematics", "Arithmetic", "Geometry", "Pre-Algebra"];

// View states
type ViewState = "overview" | "class" | "student" | "miscorrection";

const Dashboard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<ViewState>("overview");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const isMobile = useIsMobile();
  const [selectedGrade, setSelectedGrade] = useState<string>("6"); // New state to track selected grade
  
  // Handle view changes
  const handleViewClass = (classId: string) => {
    setSelectedClassId(classId);
    setViewState("class");
  };
  
  const handleViewStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setViewState("student");
  };
  
  const handleBackToOverview = () => {
    setViewState("overview");
    setSelectedClassId(null);
    setSelectedStudentId(null);
  };
  
  const handleBackToClass = () => {
    setViewState("class");
    setSelectedStudentId(null);
  };
  
  const handleGenerateReport = () => {
    setShowReportGenerator(true);
  };

  const handleViewMiscorrection = () => {
    setViewState("miscorrection");
  };
  
  // New handler for grade changes
  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
  };

  // New handler for detail report button click
  const handleViewDetailReport = (grade: string) => {
    navigate(`/reports?grade=${grade}`);
  };
  
  // If the user isn't authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // If the user isn't an admin, redirect to the Analytics page
  if (!isAdmin) {
    return <Analytics />;
  }
  
  // Get the selected class details if in class view
  const selectedClass = mockClassPerformances.find(c => c.id === selectedClassId);
  
  // Render different views based on viewState
  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto">
        {/* Back button if not in overview */}
        {viewState !== "overview" && (
          <div className="mb-6">
            <Button 
              variant="ghost"
              onClick={viewState === "class" || viewState === "miscorrection" ? handleBackToOverview : handleBackToClass}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to {viewState === "class" || viewState === "miscorrection" ? "Overview" : "Class"}
            </Button>
          </div>
        )}
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {viewState === "overview" 
                ? "Teacher Dashboard" 
                : viewState === "class" && selectedClass
                ? `${selectedClass.name} Dashboard`
                : viewState === "student" && selectedStudentId
                ? "Student Profile"
                : viewState === "miscorrection"
                ? "Paper Miscorrection Checker"
                : "Dashboard"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {viewState === "overview"
                ? "Performance analytics at a glance"
                : viewState === "class" && selectedClass
                ? `Grade ${selectedClass.grade} performance insights`
                : viewState === "student"
                ? "Detailed student analytics and recommendations"
                : viewState === "miscorrection"
                ? "Check for possible miscorrections on student papers"
                : "Analytics Dashboard"}
            </p>
          </div>
          
          {viewState === "overview" && (
            <div className="flex gap-2">
              <Button
                onClick={handleViewMiscorrection}
                variant="outline"
                className="flex items-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span className="sm:inline hidden">Check Papers</span>
              </Button>
              
              <Button
                onClick={handleGenerateReport}
                className="flex items-center gap-2 shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span className="sm:inline hidden">Reports</span>
              </Button>
            </div>
          )}
          
          {viewState !== "overview" && viewState !== "miscorrection" && (
            <Button
              onClick={handleGenerateReport}
              className="flex items-center gap-2 shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span className="sm:inline hidden">Generate Report</span>
            </Button>
          )}
        </div>
        
        {/* Filters */}
        {viewState === "overview" && (
          <div className="mb-6">
            <FilterBar 
              onFilterChange={() => {}} 
              grades={gradesList}
              subjects={subjectsList}
            />
          </div>
        )}
        
        {/* Overview Dashboard */}
        {viewState === "overview" && (
          <div className="space-y-8">
            <PerformanceOverview 
              school={mockSchool} 
              classPerformances={mockClassPerformances}
              onClassSelect={handleViewClass}
              onGradeChange={handleGradeChange}
              selectedGrade={selectedGrade}
              onDetailReport={handleViewDetailReport}
            />
            
            <PerformanceHeatmap 
              data={mockHeatmapData}
              onClassSelect={(className) => {
                const classData = mockClassPerformances.find(c => c.name === className);
                if (classData) {
                  handleViewClass(classData.id);
                }
              }}
              selectedGrade={selectedGrade}
            />
          </div>
        )}
        
        {/* Class Dashboard */}
        {viewState === "class" && selectedClass && (
          <ClassPerformanceCard
            classData={selectedClass}
            students={mockStudents}
            onStudentSelect={handleViewStudent}
          />
        )}
        
        {/* Student Profile */}
        {viewState === "student" && (
          <StudentProfileCard
            student={mockStudentProfile}
            onBack={handleBackToClass}
            onGenerateReport={() => setShowReportGenerator(true)}
          />
        )}

        {/* Paper Miscorrection Checker */}
        {viewState === "miscorrection" && (
          <PaperMiscorrectionChecker />
        )}
        
        {/* Report Generator Dialog */}
        {showReportGenerator && (
          <ReportGenerator
            templates={mockReportTemplates}
            type={viewState === "student" ? "student" : viewState === "class" ? "class" : "school"}
            selectedIds={
              viewState === "student" && selectedStudentId
                ? [selectedStudentId]
                : viewState === "class" && selectedClassId
                ? [selectedClassId]
                : undefined
            }
            onClose={() => setShowReportGenerator(false)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
