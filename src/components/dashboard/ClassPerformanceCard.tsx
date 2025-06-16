
import React, { useState } from "react";
import { ClassPerformance, StudentPerformance } from "@/types";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  BookOpen,
  User,
  Calendar,
  FileText,
  BarChart3,
  Clock
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { customTooltips } from '@/components/ui/custom-tooltips';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from "react-router-dom";

// Mock recent assessments data for the class
const getRecentAssessments = (classId: string) => [
  {
    id: "test-1",
    name: "Math Fundamentals Quiz",
    date: "2023-11-15",
    classAverage: 78,
    totalStudents: 24,
    duration: "45 min",
    status: "completed"
  },
  {
    id: "test-2", 
    name: "Fractions Assessment",
    date: "2023-11-08",
    classAverage: 72,
    totalStudents: 23,
    duration: "60 min", 
    status: "completed"
  },
  {
    id: "test-3",
    name: "Geometry Basics Test", 
    date: "2023-11-01",
    classAverage: 85,
    totalStudents: 24,
    duration: "50 min",
    status: "completed"
  },
  {
    id: "test-4",
    name: "Number Operations",
    date: "2023-10-25", 
    classAverage: 69,
    totalStudents: 22,
    duration: "40 min",
    status: "completed"
  }
];

interface ClassPerformanceCardProps {
  classData: ClassPerformance;
  students: StudentPerformance[];
  onStudentSelect: (studentId: string) => void;
}

export const ClassPerformanceCard: React.FC<ClassPerformanceCardProps> = ({
  classData,
  students,
  onStudentSelect
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "assessments">("overview");
  
  // Get recent assessments for this class
  const recentAssessments = getRecentAssessments(classData.id);
  
  // Helper function to get performance color
  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "text-green-500 dark:text-green-400";
    if (score >= 65) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

  // Helper function to get performance indicator
  const getPerformanceIndicator = (score: number) => {
    if (score >= 80) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (score >= 65) return <BarChart3 className="w-4 h-4 text-yellow-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  // Navigate to test analytics
  const handleViewTestAnalytics = (testId: string) => {
    navigate(`/test-analytics/${testId}`);
  };

  // Data for topic mastery chart
  const topicMasteryData = classData.topicMastery.map(topic => ({
    name: topic.topic,
    mastery: topic.mastery,
    fill: topic.mastery >= 80 ? "#10b981" : topic.mastery >= 65 ? "#facc15" : "#ef4444"
  }));

  // Data for error patterns chart
  const errorPatternsData = classData.errorPatterns.map(error => ({
    name: error.pattern,
    percentage: error.percentage,
    fill: "#ef4444"
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
              <Users className="w-6 h-6 mr-2 text-purple-500" />
              {classData.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Grade {classData.grade} • Performance Overview
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Class Average</div>
              <div className={`text-2xl font-bold ${getPerformanceColor(classData.averageScore)}`}>
                {classData.averageScore}%
              </div>
            </div>
            {getPerformanceIndicator(classData.averageScore)}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 px-6">
            {[
              { key: "overview", label: "Overview", icon: BarChart3 },
              { key: "students", label: "Students", icon: Users },
              { key: "assessments", label: "Recent Assessments", icon: FileText }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Topic Mastery */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Topic Mastery
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topicMasteryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip content={customTooltips.renderBarChartTooltip} />
                      <Bar dataKey="mastery" name="Mastery %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Error Patterns */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Common Error Patterns
                </h3>
                <div className="space-y-4">
                  {classData.errorPatterns.map((error, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{error.pattern}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32">
                          <Progress value={error.percentage} className="h-2" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                          {error.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Student Performance
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {students.length} students
                </div>
              </div>
              
              <div className="grid gap-4">
                {students.map((student) => (
                  <motion.div
                    key={student.id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => onStudentSelect(student.id)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-100">{student.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>Avg: {student.averageScore}%</span>
                            <span className={`flex items-center gap-1 ${
                              student.improvement >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {student.improvement >= 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {Math.abs(student.improvement)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getPerformanceColor(student.averageScore)}`}>
                          {student.averageScore}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Click to view details
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Assessments Tab */}
          {activeTab === "assessments" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Recent Assessments
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {recentAssessments.length} recent tests
                </div>
              </div>
              
              <div className="grid gap-4">
                {recentAssessments.map((assessment) => (
                  <motion.div
                    key={assessment.id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-1">
                            {assessment.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(assessment.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {assessment.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {assessment.totalStudents} students
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Class Average</div>
                          <div className={`text-xl font-bold ${getPerformanceColor(assessment.classAverage)}`}>
                            {assessment.classAverage}%
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleViewTestAnalytics(assessment.id)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <BarChart3 className="w-4 h-4" />
                          View Analytics
                        </Button>
                      </div>
                    </div>
                    
                    {/* Performance indicator bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Performance</span>
                        <span>{assessment.classAverage}% average</span>
                      </div>
                      <Progress 
                        value={assessment.classAverage} 
                        className={`h-2 ${
                          assessment.classAverage >= 80 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : assessment.classAverage >= 65 
                            ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {recentAssessments.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent assessments found for this class.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
