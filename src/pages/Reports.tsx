import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  SortAsc, 
  SortDesc,
  X,
  Download,
  Share,
  Upload as UploadIcon
} from "lucide-react";
import { TestAnalysis } from "@/components/ui/TestAnalysis";
import { ChartsSection } from "@/components/ui/Charts";
import { TestMeta, TestResult } from "@/types";

const Reports = () => {
  const { testId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Mock data for the test list
  const testList: (TestMeta & { score: number })[] = [
    {
      id: "test-1",
      name: "Midterm Math Exam",
      subject: "Mathematics",
      date: "2023-10-15",
      userId: "1",
      createdAt: "2023-10-15T14:30:00Z",
      score: 78,
    },
    {
      id: "test-2",
      name: "Multiplication Quiz",
      subject: "Arithmetic",
      date: "2023-10-08",
      userId: "1",
      createdAt: "2023-10-08T10:15:00Z",
      score: 92,
    },
    {
      id: "test-3",
      name: "Fractions Assessment",
      subject: "Mathematics",
      date: "2023-09-28",
      userId: "1",
      createdAt: "2023-09-28T09:45:00Z",
      score: 65,
    },
    {
      id: "test-4",
      name: "Geometry Basics Test",
      subject: "Geometry",
      date: "2023-09-15",
      userId: "1",
      createdAt: "2023-09-15T11:20:00Z",
      score: 81,
    },
    {
      id: "test-5",
      name: "Decimals Practice Test",
      subject: "Mathematics",
      date: "2023-09-05",
      userId: "1",
      createdAt: "2023-09-05T13:40:00Z",
      score: 73,
    },
  ];
  
  // Filter tests based on search term
  const filteredTests = testList.filter(test => 
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort tests by date
  const sortedTests = [...filteredTests].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" 
      ? dateA.getTime() - dateB.getTime() 
      : dateB.getTime() - dateA.getTime();
  });
  
  // Mock data for test analysis if a test ID is provided
  const mockTestResult: TestResult = {
    id: testId || "test-1",
    testId: testId || "test-1",
    score: 78,
    totalQuestions: 25,
    correctAnswers: 19,
    incorrectAnswers: 6,
    concepts: [
      { name: "Number Operations", score: 8, total: 10, percentage: 80 },
      { name: "Fractions", score: 4, total: 5, percentage: 80 },
      { name: "Decimals", score: 3, total: 5, percentage: 60 },
      { name: "Geometry", score: 4, total: 5, percentage: 80 }
    ],
    errorTypes: [
      { type: "Calculation Errors", count: 2, percentage: 33 },
      { type: "Conceptual Misunderstanding", count: 2, percentage: 33 },
      { type: "Procedural Errors", count: 1, percentage: 17 },
      { type: "Careless Mistakes", count: 1, percentage: 17 }
    ],
    recommendations: [
      "Focus on practicing decimal operations, especially multiplication and division with decimals.",
      "Review the concept of equivalent fractions and fraction simplification.",
      "Work on careful reading of problems to avoid careless mistakes.",
      "Practice more complex multi-step problems that combine different concepts."
    ],
    createdAt: "2023-10-15T14:30:00Z"
  };
  
  // If there's a test ID in the URL, show the test analysis page
  if (testId) {
    // Get the test name from the search params
    const testName = searchParams.get("name") || "Math Test";
    
    return (
      <MainLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/reports")}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 inline-flex items-center"
            >
              <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
              Back to all reports
            </button>
            
            <div className="flex items-center gap-3">
              <button
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
          
          {/* Test Analysis */}
          <div>
            <TestAnalysis result={mockTestResult} testName={testName} />
          </div>
          
          {/* Charts */}
          <div className="mt-8">
            <ChartsSection result={mockTestResult} />
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Otherwise, show the test list page
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Test Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and analyze all your previous test results.
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Search tests by name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="inline-flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {sortOrder === "asc" ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
            </button>
            
            <button
              className="inline-flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Calendar className="w-5 h-5" />
            </button>
            
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
        
        {/* Test List */}
        <div className="space-y-4">
          {sortedTests.length > 0 ? (
            sortedTests.map((test) => (
              <Link
                key={test.id}
                to={`/reports/${test.id}?name=${encodeURIComponent(test.name)}&subject=${encodeURIComponent(test.subject)}&date=${encodeURIComponent(test.date)}`}
              >
                <motion.div
                  className="glass-card rounded-xl p-4 hover:shadow-md transition-all"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                        {test.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>{test.subject}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(test.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center">
                      <div
                        className={`text-lg font-bold mr-4 ${
                          test.score >= 80
                            ? "text-green-500 dark:text-green-400"
                            : test.score >= 60
                            ? "text-yellow-500 dark:text-yellow-400"
                            : "text-red-500 dark:text-red-400"
                        }`}
                      >
                        {test.score}%
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="glass-card rounded-xl p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                  No tests found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm
                    ? "No tests match your search criteria. Try a different search term."
                    : "You haven't uploaded any tests yet."}
                </p>
                <Link
                  to="/upload"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
                >
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload Test
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
