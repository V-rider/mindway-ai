
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, FileText, Download, TrendingUp, TrendingDown, Minus, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestAnalysis } from "@/components/ui/TestAnalysis";
import { motion, AnimatePresence } from "framer-motion";

const TestAnalytics = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId');
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);

  // Get class name based on ID
  const getClassName = (id: string): string => {
    // In a real app, this would be fetched from an API
    return id === "1" ? "3A" : "4B";
  };

  // Function to categorize student performance
  const categorizeStudentPerformance = (students) => {
    // In a real app, this would analyze historical performance data
    // For now, we'll simulate this based on current score and mock historical variance
    return students.map(student => {
      const score = student.score;
      const variance = Math.random() * 20; // Mock variance in performance
      
      let category;
      let categoryColor;
      let categoryIcon;
      
      if (score >= 80 && variance <= 10) {
        category = "Smart & Stable";
        categoryColor = "text-green-600 bg-green-100";
        categoryIcon = TrendingUp;
      } else if (score >= 80 && variance > 10) {
        category = "Smart but Unstable";
        categoryColor = "text-yellow-600 bg-yellow-100";
        categoryIcon = BarChart;
      } else if (score < 80 && variance <= 10) {
        category = "Struggling but Consistent";
        categoryColor = "text-blue-600 bg-blue-100";
        categoryIcon = Minus;
      } else {
        category = "Inconsistent Performance";
        categoryColor = "text-red-600 bg-red-100";
        categoryIcon = TrendingDown;
      }
      
      return {
        ...student,
        category,
        categoryColor,
        categoryIcon,
        variance: Math.round(variance)
      };
    });
  };

  // Effect to fetch test data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchTestData = () => {
      // Simulate API delay
      setTimeout(() => {
        // Mock data
        const data = {
          id: testId || "",
          name: "Math Fundamentals Assessment",
          date: "2023-11-15",
          averageScore: 78,
          highestScore: 95,
          lowestScore: 45,
          questionStats: [
            {
              questionNumber: 1,
              topic: "Addition",
              difficulty: "Easy",
              correctPercentage: 92
            },
            {
              questionNumber: 2,
              topic: "Subtraction",
              difficulty: "Easy",
              correctPercentage: 88
            },
            {
              questionNumber: 3,
              topic: "Multiplication",
              difficulty: "Medium",
              correctPercentage: 75
            },
            {
              questionNumber: 4,
              topic: "Division",
              difficulty: "Medium",
              correctPercentage: 68
            },
            {
              questionNumber: 5,
              topic: "Fractions",
              difficulty: "Hard",
              correctPercentage: 45
            }
          ],
          studentResults: [
            {
              studentId: "s-1",
              name: "Emma Johnson",
              score: 85,
              areas: ["Excellent at addition and subtraction", "Needs work on fractions"]
            },
            {
              studentId: "s-2",
              name: "Noah Smith",
              score: 75,
              areas: ["Strong in multiplication", "Struggles with word problems"]
            },
            {
              studentId: "s-3",
              name: "Olivia Brown",
              score: 90,
              areas: ["Excellent across all areas", "Sometimes makes calculation errors"]
            },
            {
              studentId: "s-4",
              name: "William Davis",
              score: 65,
              areas: ["Good at basic operations", "Needs help with fractions and decimals"]
            },
            {
              studentId: "s-5",
              name: "Ava Wilson",
              score: 80,
              areas: ["Strong problem solver", "Occasionally makes careless mistakes"]
            },
            {
              studentId: "s-6",
              name: "Liam Garcia",
              score: 95,
              areas: ["Consistently excellent performance", "Shows deep understanding"]
            },
            {
              studentId: "s-7",
              name: "Sophia Martinez",
              score: 55,
              areas: ["Struggles with most concepts", "Needs additional support"]
            },
            {
              studentId: "s-8",
              name: "Mason Rodriguez",
              score: 88,
              areas: ["Strong analytical skills", "Performs well under pressure"]
            }
          ]
        };
        
        // Add performance categorization
        data.categorizedStudents = categorizeStudentPerformance(data.studentResults);
        
        setTestData(data);
        setLoading(false);
      }, 800);
    };
    
    fetchTestData();
  }, [testId]);

  const handleBackClick = () => {
    if (studentId) {
      // Navigate back to student profile if student ID exists
      navigate(`/students/profile?studentId=${studentId}`);
    } else {
      // Otherwise go back to reports page
      navigate('/reports');
    }
  };

  // Group students by category
  const groupedStudents = testData?.categorizedStudents?.reduce((acc, student) => {
    if (!acc[student.category]) {
      acc[student.category] = [];
    }
    acc[student.category].push(student);
    return acc;
  }, {}) || {};

  return (
    <MainLayout>
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Button
                      variant="ghost"
                      onClick={handleBackClick}
                      className="-ml-2 flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>
                        {studentId ? "Back to Student Profile" : "Back to Reports"}
                      </span>
                    </Button>
                    
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">
                      Test Analytics
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Comprehensive analysis of test results and performance metrics
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Results
                  </Button>
                </div>
              </div>
              
              <div className="space-y-8">
                {testData && <TestAnalysis result={testData} testName={testData.name} hideScoreCard={true} />}
                
                {/* Student Ability Analysis Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Student Ability Analysis
                  </h3>
                  
                  <div className="glass-card rounded-xl p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Students are categorized based on their performance level and consistency patterns to help identify different learning needs.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(groupedStudents).map(([category, students]) => {
                        const sampleStudent = students[0];
                        const IconComponent = sampleStudent.categoryIcon;
                        
                        return (
                          <motion.div
                            key={category}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                          >
                            <div className="flex items-center mb-3">
                              <div className={`p-2 rounded-lg mr-3 ${sampleStudent.categoryColor}`}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                                  {category}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {students.length} student{students.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {students.map((student) => (
                                <div
                                  key={student.studentId}
                                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                                >
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {student.name}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {student.score}%
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                      (±{student.variance}%)
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Category-specific recommendations */}
                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-xs text-blue-700 dark:text-blue-300">
                                {category === "Smart & Stable" && "These students consistently perform well. Consider advanced challenges to maintain engagement."}
                                {category === "Smart but Unstable" && "These students have potential but need help with consistency. Focus on test-taking strategies and stress management."}
                                {category === "Struggling but Consistent" && "These students show steady effort but need foundational support. Provide targeted intervention for specific concepts."}
                                {category === "Inconsistent Performance" && "These students show variable results. Investigate underlying factors and provide individualized support strategies."}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    {/* Summary Statistics */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-3">Class Overview</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(groupedStudents).map(([category, students]) => (
                          <div key={category} className="text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {students.length}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {category.split(' ')[0]} {category.split(' ')[1] ? category.split(' ')[1].charAt(0) : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </MainLayout>
  );
};

export default TestAnalytics;
