
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestAnalysis } from "@/components/ui/TestAnalysis";
import { PredictionScatterPlot } from "@/components/ui/PredictionScatterPlot";
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

  // Effect to fetch test data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchTestData = () => {
      // Simulate API delay
      setTimeout(() => {
        // Mock data with predicted scores
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
              predictedScore: 82,
              areas: ["Excellent at addition and subtraction", "Needs work on fractions"]
            },
            {
              studentId: "s-2",
              name: "Noah Smith",
              score: 75,
              predictedScore: 78,
              areas: ["Strong in multiplication", "Struggles with word problems"]
            },
            {
              studentId: "s-3",
              name: "Olivia Brown",
              score: 90,
              predictedScore: 87,
              areas: ["Excellent across all areas", "Sometimes makes calculation errors"]
            },
            {
              studentId: "s-4",
              name: "William Davis",
              score: 65,
              predictedScore: 70,
              areas: ["Good at basic operations", "Needs help with fractions and decimals"]
            },
            {
              studentId: "s-5",
              name: "Ava Wilson",
              score: 80,
              predictedScore: 79,
              areas: ["Strong problem solver", "Occasionally makes careless mistakes"]
            },
            {
              studentId: "s-6",
              name: "James Miller",
              score: 92,
              predictedScore: 85,
              areas: ["Exceptional mathematical reasoning", "Great at complex problems"]
            },
            {
              studentId: "s-7",
              name: "Sophia Garcia",
              score: 68,
              predictedScore: 75,
              areas: ["Good effort but needs more practice", "Struggles with time management"]
            },
            {
              studentId: "s-8",
              name: "Liam Rodriguez",
              score: 83,
              predictedScore: 81,
              areas: ["Consistent performer", "Good at following procedures"]
            }
          ]
        };
        
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

  // Get the specific student's data if studentId is provided
  const getStudentSpecificData = () => {
    if (!studentId || !testData) return testData;
    
    const studentResult = testData.studentResults.find(student => student.studentId === studentId);
    if (studentResult) {
      // Return modified test data with the student's specific score
      return {
        ...testData,
        averageScore: studentResult.score, // Use student's actual score instead of class average
        studentName: studentResult.name
      };
    }
    return testData;
  };

  // Prepare scatter plot data
  const scatterPlotData = testData?.studentResults.map(student => ({
    studentId: student.studentId,
    name: student.name,
    actualScore: student.score,
    predictedScore: student.predictedScore || student.score // fallback if no predicted score
  })) || [];

  const displayData = getStudentSpecificData();

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
                      {studentId && displayData?.studentName && (
                        <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                          - {displayData.studentName}
                        </span>
                      )}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      {studentId 
                        ? "Individual student analysis of test results and performance metrics"
                        : "Comprehensive analysis of test results and performance metrics"
                      }
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
              
              {displayData && (
                <div className="space-y-8">
                  <TestAnalysis 
                    result={displayData} 
                    testName={displayData.name} 
                    hideScoreCard={!studentId} // Only hide score card for class view, show for individual students
                  />
                  {/* Only show prediction scatter plot for class view, not individual student */}
                  {!studentId && (
                    <PredictionScatterPlot data={scatterPlotData} testName={displayData.name} />
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </MainLayout>
  );
};

export default TestAnalytics;
