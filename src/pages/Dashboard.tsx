import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { ClassPerformanceCard } from "@/components/dashboard/ClassPerformanceCard";
import { ClassDashboard } from "@/components/dashboard/ClassDashboard";
import { StudentProfileCard } from "@/components/dashboard/StudentProfileCard";
import { FilterBar } from "@/components/dashboard/FilterBar";

// Mock data - this would typically come from your API
const school = {
  id: "school-1",
  name: "Lincoln Elementary School",
  district: "Springfield School District",
  address: "123 Education Lane, Springfield",
  principalName: "Dr. Jane Smith",
  studentCount: 450,
  teacherCount: 28,
  gradeRange: "K-6",
  performanceRating: 4.2
};

// Mock classes data
const classPerformances = [
  {
    id: "class-1",
    name: "Class 6B",
    grade: "6",
    teacher: "Ms. Johnson",
    studentCount: 9,
    averageScore: 75,
    improvement: 5.2,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 94 },
      { topic: "Multiplication", mastery: 88 },
      { topic: "Division", mastery: 82 },
      { topic: "Fractions", mastery: 78 },
      { topic: "Geometry", mastery: 75 },
      { topic: "Decimals", mastery: 74 },
      { topic: "Percentages", mastery: 70 },
      { topic: "Pre-Algebra", mastery: 62 }
    ],
    errorPatterns: [
      { pattern: "Pre-algebra concept confusion", percentage: 40 },
      { pattern: "Complex fraction operations", percentage: 32 },
      { pattern: "Multi-step calculation errors", percentage: 28 }
    ]
  },
  {
    id: "class-2",
    name: "Class 6D",
    grade: "6",
    teacher: "Mr. Williams",
    studentCount: 24,
    averageScore: 82,
    improvement: 7.5,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 96 },
      { topic: "Multiplication", mastery: 92 },
      { topic: "Division", mastery: 86 },
      { topic: "Fractions", mastery: 84 },
      { topic: "Geometry", mastery: 80 },
      { topic: "Decimals", mastery: 78 },
      { topic: "Percentages", mastery: 75 },
      { topic: "Pre-Algebra", mastery: 68 }
    ],
    errorPatterns: [
      { pattern: "Pre-algebra concept confusion", percentage: 35 },
      { pattern: "Multi-step calculation errors", percentage: 30 },
      { pattern: "Order of operations errors", percentage: 25 }
    ]
  },
  {
    id: "class-3",
    name: "Class 5C",
    grade: "5",
    teacher: "Mrs. Davis",
    studentCount: 20,
    averageScore: 68,
    improvement: 3.2,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 88 },
      { topic: "Multiplication", mastery: 80 },
      { topic: "Division", mastery: 74 },
      { topic: "Fractions", mastery: 70 },
      { topic: "Geometry", mastery: 65 },
      { topic: "Decimals", mastery: 62 },
      { topic: "Percentages", mastery: 58 },
      { topic: "Pre-Algebra", mastery: 50 }
    ],
    errorPatterns: [
      { pattern: "Fraction and decimal confusion", percentage: 45 },
      { pattern: "Basic algebraic equation errors", percentage: 35 },
      { pattern: "Geometry formula misapplication", percentage: 20 }
    ]
  },
  {
    id: "class-4",
    name: "Class 4B",
    grade: "4",
    teacher: "Mr. Brown",
    studentCount: 22,
    averageScore: 72,
    improvement: 6.8,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 90 },
      { topic: "Multiplication", mastery: 84 },
      { topic: "Division", mastery: 78 },
      { topic: "Fractions", mastery: 74 },
    ],
    errorPatterns: [
      { pattern: "Multiplication table errors", percentage: 30 },
      { pattern: "Long division process mistakes", percentage: 25 },
      { pattern: "Fraction simplification errors", percentage: 20 }
    ]
  },
  {
    id: "class-5",
    name: "Class 3A",
    grade: "3",
    teacher: "Ms. Green",
    studentCount: 18,
    averageScore: 79,
    improvement: 4.9,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 92 },
      { topic: "Basic Geometry", mastery: 86 },
      { topic: "Time Telling", mastery: 80 }
    ],
    errorPatterns: [
      { pattern: "Addition carrying errors", percentage: 35 },
      { pattern: "Subtraction borrowing errors", percentage: 30 },
      { pattern: "Shape identification mistakes", percentage: 15 }
    ]
  },
  {
    id: "class-6",
    name: "Class 3D",
    grade: "3",
    teacher: "Mrs. White",
    studentCount: 21,
    averageScore: 76,
    improvement: 5.5,
    topicMastery: [
      { topic: "Addition & Subtraction", mastery: 89 },
      { topic: "Basic Geometry", mastery: 83 },
      { topic: "Time Telling", mastery: 77 }
    ],
    errorPatterns: [
      { pattern: "Addition carrying errors", percentage: 40 },
      { pattern: "Subtraction borrowing errors", percentage: 25 },
      { pattern: "Calendar reading errors", percentage: 10 }
    ]
  }
];

// Mock student data
const students = [
  {
    id: "student-1",
    name: "Alex Johnson",
    grade: "6",
    classId: "class-1",
    averageScore: 82,
    improvement: 8.5,
    strengths: ["Multiplication", "Geometry"],
    weaknesses: ["Pre-Algebra", "Word Problems"],
    recentTests: [
      { id: "test-1", name: "Fractions Quiz", score: 85, date: "2023-10-15" },
      { id: "test-2", name: "Geometry Test", score: 90, date: "2023-10-05" },
      { id: "test-3", name: "Pre-Algebra Assessment", score: 72, date: "2023-09-25" }
    ]
  },
  {
    id: "student-2",
    name: "Megan Davis",
    grade: "6",
    classId: "class-1",
    averageScore: 76,
    improvement: 6.2,
    strengths: ["Fractions", "Decimals"],
    weaknesses: ["Percentages", "Division"],
    recentTests: [
      { id: "test-4", name: "Decimals Quiz", score: 80, date: "2023-10-18" },
      { id: "test-5", name: "Division Test", score: 68, date: "2023-10-08" },
      { id: "test-6", name: "Percentages Practice", score: 75, date: "2023-09-28" }
    ]
  },
  {
    id: "student-3",
    name: "Cody Wilson",
    grade: "6",
    classId: "class-2",
    averageScore: 88,
    improvement: 9.1,
    strengths: ["Algebra", "Statistics"],
    weaknesses: ["Geometry", "Ratios"],
    recentTests: [
      { id: "test-7", name: "Algebra Basics", score: 92, date: "2023-10-20" },
      { id: "test-8", name: "Statistics Project", score: 85, date: "2023-10-10" },
      { id: "test-9", name: "Geometry Review", score: 78, date: "2023-09-30" }
    ]
  },
  {
    id: "student-4",
    name: "Jordan Lee",
    grade: "5",
    classId: "class-3",
    averageScore: 65,
    improvement: 2.8,
    strengths: ["Addition", "Subtraction"],
    weaknesses: ["Fractions", "Decimals"],
    recentTests: [
      { id: "test-10", name: "Addition Quiz", score: 70, date: "2023-10-22" },
      { id: "test-11", name: "Subtraction Test", score: 62, date: "2023-10-12" },
      { id: "test-12", name: "Fractions Practice", score: 58, date: "2023-10-02" }
    ]
  },
  {
    id: "student-5",
    name: "Avery King",
    grade: "4",
    classId: "class-4",
    averageScore: 70,
    improvement: 4.5,
    strengths: ["Multiplication", "Division"],
    weaknesses: ["Word Problems", "Geometry"],
    recentTests: [
      { id: "test-13", name: "Multiplication Test", score: 75, date: "2023-10-24" },
      { id: "test-14", name: "Division Quiz", score: 68, date: "2023-10-14" },
      { id: "test-15", name: "Word Problems Review", score: 65, date: "2023-10-04" }
    ]
  },
  {
    id: "student-6",
    name: "Riley Green",
    grade: "3",
    classId: "class-5",
    averageScore: 78,
    improvement: 5.9,
    strengths: ["Addition", "Shapes"],
    weaknesses: ["Subtraction", "Time"],
    recentTests: [
      { id: "test-16", name: "Addition Practice", score: 82, date: "2023-10-26" },
      { id: "test-17", name: "Shapes Quiz", score: 76, date: "2023-10-16" },
      { id: "test-18", name: "Subtraction Review", score: 72, date: "2023-10-06" }
    ]
  }
];

const Dashboard = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>("6");
  
  // Get the selected class data
  const selectedClassData = classPerformances.find(cp => cp.id === selectedClass);
  
  // Get the selected student data
  const selectedStudentData = students.find(s => s.id === selectedStudent);
  
  // Get students for the selected class
  const classStudents = students.filter(student => student.classId === selectedClass);
  
  // Back handlers
  const handleBackToOverview = () => {
    setSelectedClass(null);
    setSelectedStudent(null);
  };
  
  const handleBackToClass = () => {
    setSelectedStudent(null);
  };
  
  // Content based on selection state
  const renderContent = () => {
    if (selectedStudent && selectedStudentData) {
      // Show student profile
      return (
        <StudentProfileCard 
          student={selectedStudentData} 
          onBackToClass={handleBackToClass}
        />
      );
    } else if (selectedClass && selectedClassData) {
      // Show class dashboard
      return (
        <ClassDashboard 
          classData={selectedClassData} 
          onBackToOverview={handleBackToOverview} 
        />
      );
    } else {
      // Show school overview
      return (
        <PerformanceOverview 
          school={school}
          classPerformances={classPerformances}
          onClassSelect={setSelectedClass}
          onGradeChange={setSelectedGrade}
          selectedGrade={selectedGrade}
        />
      );
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {!selectedStudent && !selectedClass && (
          <FilterBar 
            selectedGrade={selectedGrade} 
            onGradeChange={setSelectedGrade}
          />
        )}
        
        {renderContent()}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
