
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
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

import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const mockSchool: School = {
  id: "school-1",
  name: "Riverdale Elementary",
  classes: [
    { id: "class-1", name: "Class 3A", grade: "3", studentCount: 24 },
    { id: "class-2", name: "Class 4B", grade: "4", studentCount: 22 },
    { id: "class-3", name: "Class 5C", grade: "5", studentCount: 20 },
    { id: "class-4", name: "Class 6A", grade: "6", studentCount: 25 },
    { id: "class-5", name: "Class 6B", grade: "6", studentCount: 23 },
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
    id: "class-3",
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
    id: "class-4",
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
    id: "class-5",
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
type ViewState = "overview" | "class" | "student";

const Dashboard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [viewState, setViewState] = useState<ViewState>("overview");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const isMobile = useIsMobile();
  
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
  
  // If the user isn't authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // If the user isn't an admin, show the student Analytics page wrapped in MainLayout
  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="w-full max-w-7xl mx-auto">
          <Analytics />
        </div>
      </MainLayout>
    );
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
            <button
              onClick={viewState === "class" ? handleBackToOverview : handleBackToClass}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to {viewState === "class" ? "Overview" : "Class"}
            </button>
          </div>
        )}
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {viewState === "overview" 
                ? "Admin Dashboard" 
                : viewState === "class" && selectedClass
                ? `${selectedClass.name} Dashboard`
                : viewState === "student" && selectedStudentId
                ? "Student Profile"
                : "Dashboard"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {viewState === "overview"
                ? "Comprehensive view of school-wide performance metrics"
                : viewState === "class" && selectedClass
                ? `Performance analytics for Grade ${selectedClass.grade} students`
                : viewState === "student"
                ? "Detailed student analytics and learning recommendations"
                : "Analytics Dashboard"}
            </p>
          </div>
          
          {viewState !== "student" && (
            <Button
              onClick={handleGenerateReport}
              className="flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              Generate Report
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
            />
            
            <PerformanceHeatmap 
              data={mockHeatmapData}
              onClassSelect={(className) => {
                const classData = mockClassPerformances.find(c => c.name === className);
                if (classData) {
                  handleViewClass(classData.id);
                }
              }}
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
