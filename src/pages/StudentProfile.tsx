
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, User, Download, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentProfileCard } from "@/components/dashboard/StudentProfileCard";
import { StudentProfile as StudentProfileType } from "@/types";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId');
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<StudentProfileType | null>(null);

  useEffect(() => {
    // In a real app, we'd fetch the student data from an API
    const fetchStudentData = () => {
      // Simulate API call delay
      setTimeout(() => {
        // Mock student data
        const mockStudent: StudentProfileType = {
          id: studentId || "s-1",
          name: "Emma Johnson",
          email: "emmaj@example.edu",
          grade: 3,
          className: "Class 3A",
          avatar: "",
          progressData: [
            { date: "2023-09-05", score: 75, testId: "g3-test-1", testName: "Math Fundamentals Quiz" },
            { date: "2023-09-18", score: 77, testId: "g3-test-2", testName: "Shapes & Geometry" },
            { date: "2023-10-02", score: 80, testId: "g3-test-1", testName: "Addition & Subtraction" },
            { date: "2023-10-15", score: 78, testId: "g3-test-3", testName: "Word Problems" },
            { date: "2023-10-30", score: 82, testId: "g3-test-2", testName: "Shapes & Geometry" },
            { date: "2023-11-12", score: 85, testId: "g3-test-1", testName: "Addition & Subtraction" }
          ],
          mistakeBreakdown: [
            { type: "Calculation Errors", percentage: 40 },
            { type: "Conceptual Gaps", percentage: 30 },
            { type: "Careless Mistakes", percentage: 20 },
            { type: "Time Management", percentage: 10 }
          ],
          strengths: [
            "Strong understanding of basic arithmetic operations",
            "Excellent at solving word problems",
            "Good visualization skills for geometric concepts"
          ],
          weaknesses: [
            "Struggles with fraction simplification",
            "Needs more practice with decimal operations",
            "Difficulty with multi-step problems"
          ],
          recommendedExercises: [
            {
              id: "ex-1",
              title: "Fraction Fundamentals",
              topic: "Fractions",
              difficulty: "medium"
            },
            {
              id: "ex-2",
              title: "Decimal Operations",
              topic: "Decimals",
              difficulty: "medium"
            },
            {
              id: "ex-3",
              title: "Step-by-Step Problem Solving",
              topic: "Word Problems",
              difficulty: "hard"
            }
          ]
        };
        
        setStudent(mockStudent);
        setIsLoading(false);
      }, 800);
    };
    
    fetchStudentData();
  }, [studentId]);

  const handleBackClick = () => {
    navigate("/students");
  };

  const handleGenerateReport = (studentId: string) => {
    console.log(`Generating report for student ${studentId}`);
    // In a real app, this would trigger a report generation process
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <Button 
                  variant="ghost" 
                  onClick={handleBackClick}
                  className="mb-2 -ml-2 flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Class</span>
                </Button>
                
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Student Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Detailed student analytics and recommendations
                </p>
              </div>
              
              <Button 
                onClick={() => handleGenerateReport(student?.id || "")}
                className="inline-flex items-center px-4 py-2 text-sm font-medium"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
            
            {student && (
              <div className="space-y-8">
                {/* Student Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-purple-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                      {student.avatar ? (
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {student.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {student.className} • Grade {student.grade} • {student.email}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
                
                {/* Performance Overview */}
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
                    Performance Overview
                  </h3>
                  
                  {/* Performance Charts would go here */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Progress Over Time
                      </h4>
                      {/* Line chart placeholder */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">Progress Chart</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mistake Breakdown
                      </h4>
                      {/* Pie chart placeholder */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">Mistake Breakdown Chart</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                      Strengths
                    </h3>
                    
                    <ul className="space-y-3">
                      {student.strengths.map((strength, index) => (
                        <li 
                          key={index} 
                          className="flex items-center bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-800/30"
                        >
                          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-700/30 flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-green-800 dark:text-green-300">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm text-gray-800 dark:text-gray-200">
                            {strength}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Areas for Improvement */}
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                      <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                      Areas for Improvement
                    </h3>
                    
                    <ul className="space-y-3">
                      {student.weaknesses.map((weakness, index) => (
                        <li 
                          key={index} 
                          className="flex items-center bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-800/30"
                        >
                          <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-700/30 flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-red-800 dark:text-red-300">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm text-gray-800 dark:text-gray-200">
                            {weakness}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Past Reports */}
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                    <FileText className="w-5 h-5 text-blue-500 mr-2" />
                    Past Reports
                  </h3>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {student.progressData.slice(0, 3).map((report, index) => (
                      <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">
                            {report.testName}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(report.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`font-medium ${
                            report.score >= 75 
                              ? "text-green-600 dark:text-green-400" 
                              : report.score >= 60
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {report.score}%
                          </span>
                          
                          <Link
                            to={`/reports/${report.testId}?studentId=${student.id}`}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                          >
                            <FileText className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default StudentProfile;
