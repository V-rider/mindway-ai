
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
          grade: "3", // Changed from number to string to fix type error
          className: "Class 3A",
          avatar: "",
          averageScore: 82, // Added the missing averageScore property
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
    navigate("/dashboard"); // Changed from "/students" to "/dashboard" to go back to class dashboard
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
          student && (
            <StudentProfileCard
              student={student}
              onBack={handleBackClick}
              onGenerateReport={handleGenerateReport}
            />
          )
        )}
      </div>
    </MainLayout>
  );
};

export default StudentProfile;
