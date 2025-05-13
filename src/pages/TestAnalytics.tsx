import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, FileText, Download } from "lucide-react";
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
              
              {testData && <TestAnalysis result={testData} testName={testData.name} />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </MainLayout>
  );
};

export default TestAnalytics;
