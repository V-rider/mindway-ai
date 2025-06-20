import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  User,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { ClassPerformance, StudentPerformance } from "@/types";
import { motion } from "framer-motion";

interface ClassPerformanceCardProps {
  classData: ClassPerformance & { studentCount?: number };
  students: StudentPerformance[];
  onStudentSelect: (studentId: string) => void;
  loading?: boolean;
}

export const ClassPerformanceCard = ({ 
  classData, 
  students, 
  onStudentSelect,
  loading = false 
}: ClassPerformanceCardProps) => {
  const studentCount = classData.studentCount || students.length;
  
  return (
    <div className="space-y-6">
      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Students
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  studentCount
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
              <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Class Average
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {classData.averageScore}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-4">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Improving Students
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  students.filter(s => s.improvement > 0).length
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 mr-4">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Need Help
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  students.filter(s => s.averageScore < 70).length
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Class Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Performance trend visualization will appear here
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classData.topicMastery.map((topic, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {topic.topic}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {topic.mastery}%
                    </span>
                  </div>
                  <Progress value={topic.mastery} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Common Error Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classData.errorPatterns.map((pattern, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {pattern.pattern}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {pattern.percentage}%
                    </span>
                  </div>
                  <Progress value={pattern.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Recent Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No recent assessments available</p>
            <Button variant="outline" className="mt-4">
              Create Assessment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Students ({loading ? "Loading..." : studentCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading students...</span>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No students found in this class</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <motion.div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => onStudentSelect(student.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {student.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Average: {student.averageScore}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={student.improvement > 0 ? "default" : student.improvement < 0 ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {student.improvement > 0 ? "+" : ""}{student.improvement}%
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {student.averageScore >= 80 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : student.averageScore >= 70 ? (
                        <BarChart3 className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
