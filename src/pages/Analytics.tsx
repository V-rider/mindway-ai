import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { TestAnalysis } from "@/components/ui/TestAnalysis";
import { ChartsSection } from "@/components/ui/Charts";
import { Button } from "@/components/ui/button"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [activeTab, setActiveTab] = useState<"overview" | "analysis">("overview");
  
  // Mock result data for TestAnalysis component
  const mockTestResult = {
    id: "test-123",
    testId: "math-101",
    score: 76,
    totalQuestions: 25,
    correctAnswers: 19,
    incorrectAnswers: 6,
    concepts: [
      { name: "Number Operations", score: 8, total: 10, percentage: 80 },
      { name: "Fractions", score: 5, total: 8, percentage: 62 },
      { name: "Decimals", score: 3, total: 4, percentage: 75 },
      { name: "Geometry", score: 2, total: 2, percentage: 100 },
      { name: "Measurement", score: 1, total: 1, percentage: 100 }
    ],
    errorTypes: [
      { type: "Calculation Errors", count: 3, percentage: 50 },
      { type: "Conceptual Misunderstanding", count: 2, percentage: 33 },
      { type: "Careless Mistakes", count: 1, percentage: 17 }
    ],
    recommendations: [
      "Practice operations with fractions to improve understanding",
      "Review decimal place value concepts",
      "Use step-by-step problem solving to avoid calculation errors",
      "Focus on word problems to strengthen application skills"
    ],
    createdAt: new Date().toISOString(),
    studentId: "student-1",
    studentName: "John Doe"
  };
  
  // Mock data for performance trend
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
  
  // Mock data for concept mastery
  const conceptData = [
    { concept: "Number Operations", mastery: 85 },
    { concept: "Fractions", mastery: 62 },
    { concept: "Decimals", mastery: 75 },
    { concept: "Geometry", mastery: 80 },
    { concept: "Measurement", mastery: 70 },
  ];
  
  // Mock data for error distribution
  const errorData = [
    { type: "Calculation Errors", count: 12 },
    { type: "Conceptual Misunderstanding", count: 8 },
    { type: "Procedural Errors", count: 5 },
    { type: "Careless Mistakes", count: 3 },
  ];
  
  // Mock data for correct vs incorrect
  const correctVsIncorrectData = [
    { name: "Correct", value: 76, color: "#4ade80" },
    { name: "Incorrect", value: 24, color: "#f87171" },
  ];
  
  // Mock data for radar chart - skills by topic
  const skillsData = [
    { subject: "Number Operations", A: 85, fullMark: 100 },
    { subject: "Fractions", A: 62, fullMark: 100 },
    { subject: "Decimals", A: 75, fullMark: 100 },
    { subject: "Geometry", A: 80, fullMark: 100 },
    { subject: "Measurement", A: 70, fullMark: 100 },
  ];
  
  // Get performance data based on selected time range
  const currentPerformanceData = performanceData[timeRange];
  
  // Function to navigate to reports page
  const handleViewAllTests = () => {
    navigate('/reports');
  };
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Insights into your math learning progress and performance.
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
        
        {/* Tabs for Overview and Analysis */}
        <Tabs defaultValue="overview" onValueChange={(value) => setActiveTab(value as "overview" | "analysis")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Test Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Current Average",
                  value: "76%",
                  icon: BarChart3,
                  trend: "+8% from last month",
                  trendUp: true,
                  color: "bg-indigo-500",
                },
                {
                  title: "Error Rate",
                  value: "24%",
                  icon: XCircle,
                  trend: "-5% from last month",
                  trendUp: false,
                  color: "bg-red-500",
                },
                {
                  title: "Mastery Level",
                  value: "72%",
                  icon: Target,
                  trend: "+10% from last month",
                  trendUp: true,
                  color: "bg-green-500",
                },
                {
                  title: "Topics Mastered",
                  value: "8/12",
                  icon: BookOpen,
                  trend: "+2 new topics",
                  trendUp: true,
                  color: "bg-purple-500",
                },
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  className="glass-card rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {metric.title}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                        {metric.value}
                      </h3>
                    </div>
                    <div className={`${metric.color} p-3 rounded-lg text-white`}>
                      <metric.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    {metric.trendUp ? (
                      <TrendingUp className="w-3 h-3 mr-1 text-green-500 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 text-red-500 dark:text-red-400" />
                    )}
                    <p
                      className={`text-xs ${
                        metric.trendUp
                          ? "text-green-500 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {metric.trend}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          
            {/* Performance Trend Chart */}
            <motion.div
              className="glass-card rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Performance Trend
                </h2>
                <div className="flex items-center mt-4 sm:mt-0">
                  <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1 flex space-x-1">
                    {(["week", "month", "year"] as const).map((range) => (
                      <button
                        key={range}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                          timeRange === range
                            ? "bg-purple-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => setTimeRange(range)}
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={currentPerformanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Score"]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Test Score"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                      dot={{ r: 4, fill: "#8b5cf6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Concept Mastery */}
              <motion.div
                className="glass-card rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Concept Mastery
                  </h2>
                  <button
                    className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    Details
                  </button>
                </div>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={conceptData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <YAxis dataKey="concept" type="category" tick={{ fontSize: 12 }} width={120} />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Mastery"]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar
                        dataKey="mastery"
                        name="Mastery Level"
                        fill="#8b5cf6"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              {/* Skills Radar Chart (moved from below) */}
              <motion.div
                className="glass-card rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Skills Overview
                  </h2>
                  <button
                    className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    Details
                  </button>
                </div>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Math Skills"
                        dataKey="A"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.6}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Mastery"]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
            
            {/* Recommendations */}
            <motion.div
              className="glass-panel rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Key Insights & Recommendations
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-800 dark:text-gray-100">Strength:</span>{" "}
                      Excellent performance in Number Operations with 85% mastery. Continue to build on this strength.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <TrendingDown className="w-5 h-5 text-red-500 dark:text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-800 dark:text-gray-100">Weakness:</span>{" "}
                      Fractions (62% mastery) needs improvement. Focus on equivalent fractions and operations with fractions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <BookOpen className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-800 dark:text-gray-100">Recommendation:</span>{" "}
                      Consider focusing on the "Fractions" topic in your learning pathway to improve your understanding.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-800 dark:text-gray-100">Progress:</span>{" "}
                      Your overall performance has improved by 8% in the last month. Keep up the good work!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="analysis">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Recent Test Analysis
                </h2>
                <Button variant="outline" onClick={handleViewAllTests}>
                  View All Tests
                </Button>
              </div>
              
              {/* Test Analysis Component */}
              <TestAnalysis result={mockTestResult} testName="Math Fundamentals" />
              
              {/* Charts Section */}
              <ChartsSection result={mockTestResult} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Analytics;
