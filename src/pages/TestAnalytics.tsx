
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, BookOpen, Target, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestAnalysis } from "@/components/ui/TestAnalysis";
import { TestResult, ConceptResult, ErrorTypeResult } from "@/types";

const TestAnalytics = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [testData, setTestData] = useState<{
    result: TestResult;
    testName: string;
  } | null>(null);
  
  // Mock fetch test data - in a real app, this would call an API
  useEffect(() => {
    const fetchTestData = () => {
      // Simulating API call delay
      setTimeout(() => {
        // Mock data for different tests
        const mockTestResults: Record<string, {
          result: TestResult;
          testName: string;
        }> = {
          "g3-test-1": {
            testName: "Addition & Subtraction Test",
            result: getMockTestResult("g3-test-1", "Addition & Subtraction", 78)
          },
          "g3-test-2": {
            testName: "Shapes Quiz",
            result: getMockTestResult("g3-test-2", "Shapes & Geometry", 65)
          },
          "g3-test-3": {
            testName: "Word Problems Assessment",
            result: getMockTestResult("g3-test-3", "Word Problems", 70)
          },
          "g4-test-1": {
            testName: "Multiplication Test",
            result: getMockTestResult("g4-test-1", "Multiplication", 80)
          },
          "g4-test-2": {
            testName: "Fractions Quiz",
            result: getMockTestResult("g4-test-2", "Fractions", 68)
          },
          "g4-test-3": {
            testName: "Geometry Basics",
            result: getMockTestResult("g4-test-3", "Geometry", 62)
          },
          "g5-test-1": {
            testName: "Decimal Operations",
            result: getMockTestResult("g5-test-1", "Decimals", 85)
          },
          "g5-test-2": {
            testName: "Pre-Algebra Concepts",
            result: getMockTestResult("g5-test-2", "Pre-Algebra", 72)
          },
          "g5-test-3": {
            testName: "Geometry & Measurement",
            result: getMockTestResult("g5-test-3", "Geometry & Measurement", 78)
          },
          "g6-test-1": {
            testName: "Ratios & Proportions Quiz",
            result: getMockTestResult("g6-test-1", "Ratios & Proportions", 88)
          },
          "g6-test-2": {
            testName: "Algebra Basics Test",
            result: getMockTestResult("g6-test-2", "Algebra Basics", 75)
          },
          "g6-test-3": {
            testName: "Statistics & Data Analysis",
            result: getMockTestResult("g6-test-3", "Statistics", 92)
          }
        };
        
        if (testId && mockTestResults[testId]) {
          setTestData(mockTestResults[testId]);
        } else {
          // Default fallback data if test ID doesn't match
          setTestData({
            testName: "Math Assessment",
            result: getMockTestResult("default", "Math Skills", 75)
          });
        }
        
        setIsLoading(false);
      }, 800); // simulate loading delay
    };
    
    fetchTestData();
  }, [testId]);
  
  const handleBackToReports = () => {
    navigate("/reports");
  };
  
  // Helper function to generate mock test result data
  function getMockTestResult(id: string, topic: string, score: number): TestResult {
    const totalQuestions = 20 + Math.floor(Math.random() * 10);
    const correctAnswers = Math.floor((score / 100) * totalQuestions);
    const incorrectAnswers = totalQuestions - correctAnswers;
    
    const concepts: ConceptResult[] = [
      { 
        name: `${topic} - Basic`, 
        score: Math.floor(score * 1.1), 
        total: 10, 
        percentage: Math.min(100, Math.floor(score * 1.1)) 
      },
      { 
        name: `${topic} - Advanced`, 
        score: Math.floor(score * 0.9), 
        total: 8, 
        percentage: Math.floor(score * 0.9) 
      },
      { 
        name: `${topic} - Applied`, 
        score: Math.floor(score * 0.85), 
        total: 7, 
        percentage: Math.floor(score * 0.85) 
      }
    ];
    
    const errorTypes: ErrorTypeResult[] = [
      { 
        type: "Calculation Errors", 
        count: Math.floor(incorrectAnswers * 0.4), 
        percentage: Math.floor(40) 
      },
      { 
        type: "Conceptual Misunderstanding", 
        count: Math.floor(incorrectAnswers * 0.35), 
        percentage: Math.floor(35) 
      },
      { 
        type: "Careless Mistakes", 
        count: Math.floor(incorrectAnswers * 0.25), 
        percentage: Math.floor(25) 
      }
    ];
    
    const recommendations = [
      `Practice ${topic} fundamentals to strengthen your understanding`,
      `Review ${topic} problem-solving techniques`,
      `Focus on understanding common errors in ${topic} problems`,
      `Try more advanced ${topic} exercises to challenge yourself`
    ];
    
    return {
      id: `result-${id}`,
      testId: id,
      score,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      concepts,
      errorTypes,
      recommendations,
      createdAt: new Date().toISOString(),
      studentId: "student-1",
      studentName: "John Doe"
    };
  }
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Page Header */}
            <div className="flex items-start justify-between">
              <div>
                <Button 
                  variant="ghost" 
                  onClick={handleBackToReports}
                  className="mb-2 -ml-2 flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Assessments</span>
                </Button>
                
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Test Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Detailed analysis of your performance on this assessment
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  className="inline-flex items-center px-4 py-2 text-sm font-medium"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
              </div>
            </div>
            
            {testData && (
              <TestAnalysis 
                result={testData.result} 
                testName={testData.testName} 
              />
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default TestAnalytics;
