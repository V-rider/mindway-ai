
import React, { useState, useEffect } from "react";
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
import { performanceApi } from "@/lib/api/performance";

import { Button } from "@/components/ui/button";
import { 
  Download, 
  ChevronLeft, 
  Search, 
  FileText,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data for features not yet connected to real data
const mockSchool: School = {
  id: "school-1",
  name: "School Dashboard",
  classes: []
};

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
  ],
  mistakeBreakdown: [
    { type: "Calculation Errors", percentage: 30 },
    { type: "Conceptual Gaps", percentage: 40 },
  ],
  strengths: [
    "Strong understanding of basic arithmetic operations",
    "Excellent at solving word problems",
  ],
  weaknesses: [
    "Struggles with fraction simplification",
    "Needs more practice with decimal operations",
  ],
  recommendedExercises: [
    { id: "ex-1", title: "Fraction Fundamentals", topic: "Fractions", difficulty: "medium" },
  ],
};

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
];

// Grade and subjects list for filters
const gradesList = ["1", "2", "3", "4", "5", "6"];
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
  const [selectedGrade, setSelectedGrade] = useState<string>("1");
  
  // Real data states
  const [classPerformances, setClassPerformances] = useState<ClassPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  
  // Load real data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const performances = await performanceApi.getClassPerformances();
        setClassPerformances(performances);
        
        // Convert class performances to heatmap data
        const heatmap: HeatmapData[] = performances.map(cp => ({
          className: cp.name,
          grade: cp.grade,
          topics: cp.topicMastery.map(tm => ({
            name: tm.topic,
            performance: tm.mastery
          }))
        }));
        setHeatmapData(heatmap);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      loadData();
    }
  }, [isAuthenticated, isAdmin]);
  
  // Handle view changes with scroll to top
  const handleViewClass = (classId: string) => {
    setSelectedClassId(classId);
    setViewState("class");
    window.scrollTo(0, 0);
  };
  
  const handleViewStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setViewState("student");
    window.scrollTo(0, 0);
  };
  
  const handleBackToOverview = () => {
    setViewState("overview");
    setSelectedClassId(null);
    setSelectedStudentId(null);
    window.scrollTo(0, 0);
  };
  
  const handleBackToClass = () => {
    setViewState("class");
    setSelectedStudentId(null);
    window.scrollTo(0, 0);
  };
  
  const handleGenerateReport = () => {
    setShowReportGenerator(true);
  };

  const handleViewMiscorrection = () => {
    setViewState("miscorrection");
    window.scrollTo(0, 0);
  };
  
  // New handler for grade changes with scroll to top
  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    window.scrollTo(0, 0);
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
  const selectedClass = classPerformances.find(c => c.id === selectedClassId);
  
  // Show loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <span className="ml-4 text-lg text-gray-600 dark:text-gray-400">Loading dashboard data...</span>
          </div>
        </div>
      </MainLayout>
    );
  }
  
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
              <FileText className="w-4 w-4" />
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
              classPerformances={classPerformances}
              onClassSelect={handleViewClass}
              onGradeChange={handleGradeChange}
              selectedGrade={selectedGrade}
              onDetailReport={handleViewDetailReport}
            />
            
            <PerformanceHeatmap 
              data={heatmapData}
              onClassSelect={(className) => {
                const classData = classPerformances.find(c => c.name === className);
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
