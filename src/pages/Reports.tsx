
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  FileText, 
  Search, 
  Filter, 
  Download,
  Users,
  X,
  Calendar,
  ListFilter,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Reports = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get user role from auth context
  const { isAdmin, user } = useAuth();
  
  // Extract grade from query parameters
  const queryParams = new URLSearchParams(location.search);
  const gradeFromQuery = queryParams.get('grade');
  
  // State for selected grade and search term
  const [selectedGrade, setSelectedGrade] = useState<string>(gradeFromQuery || "6");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewAllTests, setViewAllTests] = useState(false);
  
  // Update state when URL parameters change
  useEffect(() => {
    if (gradeFromQuery) {
      setSelectedGrade(gradeFromQuery);
    }
  }, [gradeFromQuery]);
  
  // List of available grades
  const grades = ["3", "4", "5", "6"];
  
  // Mock test data by grade
  const testStatsByGrade = {
    "3": {
      averageScore: 76,
      subjectPerformance: [
        { subject: "Number Operations", performance: "Good", color: "text-green-500" },
        { subject: "Shapes & Patterns", performance: "Needs Improvement", color: "text-yellow-500" },
        { subject: "Word Problems", performance: "Good", color: "text-green-500" },
        { subject: "Basic Fractions", performance: "Needs Improvement", color: "text-yellow-500" }
      ],
      mostChallenging: "Basic Fractions",
      highestPerforming: "Number Operations",
      recentTests: [
        { id: "g3-test-1", name: "Addition & Subtraction Test", date: "2023-10-15", performance: "Above Average", completionRate: "92%" },
        { id: "g3-test-2", name: "Shapes Quiz", date: "2023-09-28", performance: "Average", completionRate: "85%" },
        { id: "g3-test-3", name: "Word Problems Assessment", date: "2023-09-10", performance: "Above Average", completionRate: "88%" }
      ],
      allTests: [
        { id: "g3-test-1", name: "Addition & Subtraction Test", date: "2023-10-15", performance: "Above Average", completionRate: "92%" },
        { id: "g3-test-2", name: "Shapes Quiz", date: "2023-09-28", performance: "Average", completionRate: "85%" },
        { id: "g3-test-3", name: "Word Problems Assessment", date: "2023-09-10", performance: "Above Average", completionRate: "88%" },
        { id: "g3-test-4", name: "Math Fundamentals Quiz", date: "2023-08-20", performance: "Good", completionRate: "90%" },
        { id: "g3-test-5", name: "Basic Fractions Test", date: "2023-08-05", performance: "Needs Improvement", completionRate: "78%" },
        { id: "g3-test-6", name: "Number Operations Assessment", date: "2023-07-15", performance: "Excellent", completionRate: "95%" }
      ]
    },
    "4": {
      averageScore: 74,
      subjectPerformance: [
        { subject: "Multiplication & Division", performance: "Good", color: "text-green-500" },
        { subject: "Fractions", performance: "Needs Improvement", color: "text-yellow-500" },
        { subject: "Geometry", performance: "Needs Support", color: "text-red-500" },
        { subject: "Measurement", performance: "Good", color: "text-green-500" }
      ],
      mostChallenging: "Geometry",
      highestPerforming: "Multiplication & Division",
      recentTests: [
        { id: "g4-test-1", name: "Multiplication Test", date: "2023-10-18", performance: "Above Average", completionRate: "90%" },
        { id: "g4-test-2", name: "Fractions Quiz", date: "2023-10-01", performance: "Average", completionRate: "87%" },
        { id: "g4-test-3", name: "Geometry Basics", date: "2023-09-15", performance: "Below Average", completionRate: "78%" }
      ],
      allTests: [
        { id: "g4-test-1", name: "Multiplication Test", date: "2023-10-18", performance: "Above Average", completionRate: "90%" },
        { id: "g4-test-2", name: "Fractions Quiz", date: "2023-10-01", performance: "Average", completionRate: "87%" },
        { id: "g4-test-3", name: "Geometry Basics", date: "2023-09-15", performance: "Below Average", completionRate: "78%" },
        { id: "g4-test-4", name: "Measurement Unit Test", date: "2023-08-25", performance: "Good", completionRate: "89%" },
        { id: "g4-test-5", name: "Division Challenge", date: "2023-08-10", performance: "Average", completionRate: "82%" },
        { id: "g4-test-6", name: "Word Problems Test", date: "2023-07-20", performance: "Below Average", completionRate: "75%" }
      ]
    },
    "5": {
      averageScore: 78,
      subjectPerformance: [
        { subject: "Fractions & Decimals", performance: "Good", color: "text-green-500" },
        { subject: "Pre-Algebra", performance: "Good", color: "text-green-500" },
        { subject: "Data & Graphs", performance: "Excellent", color: "text-green-500" },
        { subject: "Advanced Geometry", performance: "Needs Improvement", color: "text-yellow-500" }
      ],
      mostChallenging: "Advanced Geometry",
      highestPerforming: "Data & Graphs",
      recentTests: [
        { id: "g5-test-1", name: "Decimal Operations", date: "2023-10-20", performance: "Above Average", completionRate: "95%" },
        { id: "g5-test-2", name: "Pre-Algebra Concepts", date: "2023-10-05", performance: "Above Average", completionRate: "92%" },
        { id: "g5-test-3", name: "Geometry & Measurement", date: "2023-09-22", performance: "Average", completionRate: "89%" }
      ],
      allTests: [
        { id: "g5-test-1", name: "Decimal Operations", date: "2023-10-20", performance: "Above Average", completionRate: "95%" },
        { id: "g5-test-2", name: "Pre-Algebra Concepts", date: "2023-10-05", performance: "Above Average", completionRate: "92%" },
        { id: "g5-test-3", name: "Geometry & Measurement", date: "2023-09-22", performance: "Average", completionRate: "89%" },
        { id: "g5-test-4", name: "Data Analysis Quiz", date: "2023-09-05", performance: "Excellent", completionRate: "97%" },
        { id: "g5-test-5", name: "Fractions & Decimals Test", date: "2023-08-18", performance: "Good", completionRate: "91%" },
        { id: "g5-test-6", name: "Word Problems Challenge", date: "2023-08-01", performance: "Average", completionRate: "86%" }
      ]
    },
    "6": {
      averageScore: 82,
      subjectPerformance: [
        { subject: "Ratios & Proportions", performance: "Excellent", color: "text-green-500" },
        { subject: "Algebra Introduction", performance: "Good", color: "text-green-500" },
        { subject: "Statistics", performance: "Excellent", color: "text-green-500" },
        { subject: "Geometric Formulas", performance: "Good", color: "text-green-500" }
      ],
      mostChallenging: "Algebra Introduction",
      highestPerforming: "Statistics",
      recentTests: [
        { id: "g6-test-1", name: "Ratios & Proportions Quiz", date: "2023-10-25", performance: "Excellent", completionRate: "98%" },
        { id: "g6-test-2", name: "Algebra Basics Test", date: "2023-10-10", performance: "Above Average", completionRate: "94%" },
        { id: "g6-test-3", name: "Statistics & Data Analysis", date: "2023-09-27", performance: "Excellent", completionRate: "97%" }
      ],
      allTests: [
        { id: "g6-test-1", name: "Ratios & Proportions Quiz", date: "2023-10-25", performance: "Excellent", completionRate: "98%" },
        { id: "g6-test-2", name: "Algebra Basics Test", date: "2023-10-10", performance: "Above Average", completionRate: "94%" },
        { id: "g6-test-3", name: "Statistics & Data Analysis", date: "2023-09-27", performance: "Excellent", completionRate: "97%" },
        { id: "g6-test-4", name: "Geometric Formulas Assessment", date: "2023-09-12", performance: "Good", completionRate: "92%" },
        { id: "g6-test-5", name: "Pre-Algebra Evaluation", date: "2023-08-29", performance: "Above Average", completionRate: "93%" },
        { id: "g6-test-6", name: "Mathematical Reasoning Test", date: "2023-08-15", performance: "Excellent", completionRate: "96%" }
      ]
    }
  };
  
  // Get data for the selected grade
  const currentGradeData = testStatsByGrade[selectedGrade as keyof typeof testStatsByGrade];
  
  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Function to get performance color
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return "text-green-600 dark:text-green-400";
      case "Above Average":
        return "text-green-500 dark:text-green-400";
      case "Good":
        return "text-green-500 dark:text-green-400";
      case "Average":
        return "text-yellow-500 dark:text-yellow-400";
      case "Below Average":
        return "text-yellow-600 dark:text-yellow-500";
      case "Needs Improvement":
        return "text-yellow-600 dark:text-yellow-500";
      case "Needs Support":
        return "text-red-500 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };
  
  // Function to sort tests
  const sortTests = (tests: any[]) => {
    return [...tests].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "performance") {
        const performanceOrder = ["Excellent", "Above Average", "Good", "Average", "Below Average", "Needs Improvement", "Needs Support"];
        comparison = performanceOrder.indexOf(a.performance) - performanceOrder.indexOf(b.performance);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  // Get the appropriate tests list based on viewAllTests state
  const testsToDisplay = viewAllTests 
    ? currentGradeData.allTests 
    : currentGradeData.recentTests;

  // Filter tests based on search term
  const filteredTests = testsToDisplay
    .filter(test => test.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  // Sort filtered tests
  const sortedAndFilteredTests = sortTests(filteredTests);
  
  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Toggle view all tests
  const toggleViewAllTests = () => {
    setViewAllTests(!viewAllTests);
  };
  
  // Navigate back to analytics
  const handleBackToAnalytics = () => {
    navigate("/analytics");
  };
  
  // Navigate back to dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };
  
  // Navigate to individual test analytics
  const handleViewTestAnalytics = (testId: string) => {
    navigate(`/reports/${testId}`);
  };

  // Handle grade change
  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    // Update URL with new grade
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('grade', grade);
    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString()
    });
  };
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {!isAdmin && (
              <Button 
                variant="ghost" 
                onClick={handleBackToAnalytics}
                className="mb-2 -ml-2 flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Analytics</span>
              </Button>
            )}
            {isAdmin && (
              <Button 
                variant="ghost" 
                onClick={handleBackToDashboard}
                className="mb-2 -ml-2 flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
            )}
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {isAdmin ? `Grade ${selectedGrade} Reports` : 'Student Assessments'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isAdmin ? 'Overall class performance and recent assessments' : 'Overall performance and recent assessments'}
            </p>
          </div>
          
          {/* Grade Selector */}
          <div className="w-full sm:w-auto">
            <Select 
              value={selectedGrade} 
              onValueChange={handleGradeChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade}>
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Performance Overview - Only shown for admin users */}
        {isAdmin && (
          <div className="glass-card rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Performance Overview
              </h2>
              <div className="flex items-center mt-2 sm:mt-0">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="font-medium text-gray-800 dark:text-gray-100">Grade {selectedGrade} Classes</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Overall Performance</span>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {currentGradeData.averageScore}%
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {currentGradeData.averageScore >= 80 ? "Excellent" : 
                    currentGradeData.averageScore >= 70 ? "Good" : 
                    currentGradeData.averageScore >= 60 ? "Average" : "Needs Improvement"}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Highest Performing Area</span>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {currentGradeData.highestPerforming}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Needs Most Support</span>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3">
                    <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">!</span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {currentGradeData.mostChallenging}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Subject Performance - Only shown for admin users */}
        {isAdmin && (
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
              Subject Performance
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentGradeData.subjectPerformance.map((subject, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-gray-100">
                      {subject.subject}
                    </h3>
                    <span className={subject.color}>
                      {subject.performance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Recent Tests - with View All Tests button */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {viewAllTests ? "All Assessments" : "Recent Assessments"}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={toggleViewAllTests}
                className="flex items-center gap-2 order-1 sm:order-none"
              >
                <ListFilter className="w-4 h-4" />
                <span>{viewAllTests ? "Show Recent" : "View All Tests"}</span>
              </Button>
              
              <div className="relative order-0 sm:order-none w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {sortedAndFilteredTests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => toggleSort("name")}
                    >
                      <div className="flex items-center">
                        Assessment Name
                        {sortField === "name" && (
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => toggleSort("date")}
                    >
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Date
                        {sortField === "date" && (
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => toggleSort("performance")}
                    >
                      <div className="flex items-center">
                        Performance
                        {sortField === "performance" && (
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead className="w-[50px]">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAndFilteredTests.map((test) => (
                    <TableRow 
                      key={test.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
                      onClick={() => handleViewTestAnalytics(test.id)}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-100">
                            {test.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(test.date)}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getPerformanceColor(test.performance)}`}>
                          {test.performance}
                        </span>
                      </TableCell>
                      <TableCell>{test.completionRate}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-full p-2 h-auto w-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTestAnalytics(test.id);
                          }}
                        >
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                  No assessments found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm
                    ? "No assessments match your search criteria. Try a different search term."
                    : "No recent assessments available for this grade."}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-center mt-6">
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Download Complete Report</span>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
