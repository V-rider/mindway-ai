import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  TrendingUp,
  TrendingDown,
  XCircle,
  CheckCircle,
  Target,
  BookOpen,
  Filter,
  Download,
  Share,
  ArrowLeft,
} from "lucide-react";
import { TestAnalysis } from "@/components/ui/TestAnalysis";
import { ChartsSection } from "@/components/ui/Charts";
import { PredictionScatterPlot } from "@/components/ui/PredictionScatterPlot";
import { Button } from "@/components/ui/button";

const TestAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock student performance data with predicted vs actual scores
  const mockStudentData = [
    { studentName: "Alice Johnson", actualScore: 92, predictedScore: 85, performance: 'above' as const },
    { studentName: "Bob Smith", actualScore: 78, predictedScore: 82, performance: 'below' as const },
    { studentName: "Carol Davis", actualScore: 88, predictedScore: 87, performance: 'above' as const },
    { studentName: "David Wilson", actualScore: 65, predictedScore: 70, performance: 'below' as const },
    { studentName: "Emma Brown", actualScore: 94, predictedScore: 93, performance: 'above' as const },
    { studentName: "Frank Miller", actualScore: 71, predictedScore: 75, performance: 'below' as const },
    { studentName: "Grace Lee", actualScore: 89, predictedScore: 88, performance: 'above' as const },
    { studentName: "Henry Taylor", actualScore: 76, predictedScore: 76, performance: 'on-target' as const },
    { studentName: "Ivy Chen", actualScore: 83, predictedScore: 80, performance: 'above' as const },
    { studentName: "Jack Anderson", actualScore: 69, predictedScore: 74, performance: 'below' as const },
    { studentName: "Kate Williams", actualScore: 91, predictedScore: 89, performance: 'above' as const },
    { studentName: "Liam Thompson", actualScore: 77, predictedScore: 78, performance: 'below' as const },
    { studentName: "Mia Garcia", actualScore: 85, predictedScore: 83, performance: 'above' as const },
    { studentName: "Noah Martinez", actualScore: 72, predictedScore: 77, performance: 'below' as const },
    { studentName: "Olivia Rodriguez", actualScore: 90, predictedScore: 91, performance: 'below' as const },
  ];

  // Mock test data for TestAnalysis component
  const mockTestData = {
    id: "test-123",
    testName: "Math Fundamentals",
    averageScore: 76,
    questionStats: [
      { topic: "Number Operations", correctPercentage: 80 },
      { topic: "Fractions", correctPercentage: 62 },
      { topic: "Decimals", correctPercentage: 75 },
      { topic: "Geometry", correctPercentage: 100 },
      { topic: "Measurement", correctPercentage: 100 },
    ],
  };

  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [activeTab, setActiveTab] = useState<"overview" | "analysis">("analysis");

  const performanceData = {
    week: [
      { day: "Mon", score: 65 },
      { day: "Tue", score: 70 },
      { day: "Wed", score: 68 },
      { day: "Thu", score: 75 },
      { day: "Fri", score: 78 },
      { day: "Sat", score: 82 },
      { day: "Sun", score: 85 },
    ],
    month: [
      { day: "Week 1", score: 62 },
      { day: "Week 2", score: 68 },
      { day: "Week 3", score: 75 },
      { day: "Week 4", score: 82 },
    ],
    year: [
      { day: "Jan", score: 60 },
      { day: "Feb", score: 65 },
      { day: "Mar", score: 70 },
      { day: "Apr", score: 68 },
      { day: "May", score: 72 },
      { day: "Jun", score: 75 },
      { day: "Jul", score: 78 },
      { day: "Aug", score: 80 },
      { day: "Sep", score: 83 },
      { day: "Oct", score: 85 },
      { day: "Nov", score: 82 },
      { day: "Dec", score: 88 },
    ],
  };

  const conceptData = [
    { concept: "Number Operations", mastery: 85 },
    { concept: "Fractions", mastery: 62 },
    { concept: "Decimals", mastery: 75 },
    { concept: "Geometry", mastery: 80 },
    { concept: "Measurement", mastery: 70 },
  ];

  const errorData = [
    { type: "Calculation Errors", count: 12 },
    { type: "Conceptual Misunderstanding", count: 8 },
    { type: "Procedural Errors", count: 5 },
    { type: "Careless Mistakes", count: 3 },
  ];

  const correctVsIncorrectData = [
    { name: "Correct", value: 76, color: "#4ade80" },
    { name: "Incorrect", value: 24, color: "#f87171" },
  ];

  const skillsData = [
    { subject: "Number Operations", A: 85, fullMark: 100 },
    { subject: "Fractions", A: 62, fullMark: 100 },
    { subject: "Decimals", A: 75, fullMark: 100 },
    { subject: "Geometry", A: 80, fullMark: 100 },
    { subject: "Measurement", A: 70, fullMark: 100 },
  ];

  const currentPerformanceData = performanceData[timeRange];

  const handleGoBack = () => {
    navigate('/reports');
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Test Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Detailed analysis of student performance on the Math Fundamentals test.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Report
            </button>
          </div>
        </div>
        
        {/* Test Analysis */}
        <TestAnalysis 
          result={mockTestData} 
          testName={mockTestData.testName} 
          hideScoreCard={true}
        />
        
        {/* New Prediction Scatter Plot */}
        <PredictionScatterPlot 
          data={mockStudentData}
          testName={mockTestData.testName}
        />
        
        {/* Charts Section */}
        <ChartsSection result={mockTestData} />
      </div>
    </MainLayout>
  );
};

export default TestAnalytics;
