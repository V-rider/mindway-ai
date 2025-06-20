import React, { useState, useEffect } from 'react';
import { ClassPerformance, StudentPerformance } from '@/types';
import { motion } from 'framer-motion';
import { 
  User, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight,
  Search,
  X,
  Calendar,
  ListFilter,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { classApi } from '@/lib/api/classes';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

interface ClassPerformanceCardProps {
  classData: ClassPerformance;
  students: StudentPerformance[];
  onStudentSelect: (studentId: string) => void;
}

interface DatabaseStudent {
  SID: number;
  name: string;
  email: string;
  class_id: number;
}

export const ClassPerformanceCard: React.FC<ClassPerformanceCardProps> = ({
  classData,
  students,
  onStudentSelect,
}) => {
  const navigate = useNavigate();
  const [realStudents, setRealStudents] = useState<DatabaseStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  
  // State for assessments section
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewAllTests, setViewAllTests] = useState(false);
  
  // State for performance trend time period
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">("month");

  // Fetch real students for the class
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        console.log('Fetching students for class:', classData.id);
        const studentsData = await classApi.getStudentsByClass(classData.id);
        console.log('Students data received:', studentsData);
        setRealStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
        setRealStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    if (classData.id) {
      fetchStudents();
    }
  }, [classData.id]);

  // Convert database students to display format with mock performance data
  const displayStudents = realStudents.map(student => ({
    id: student.SID.toString(),
    name: student.name,
    email: student.email,
    averageScore: Math.floor(Math.random() * 30) + 70, // Mock score between 70-100
    improvement: Math.floor(Math.random() * 21) - 10, // Mock improvement between -10 to +10
    strengths: ["Math Basics", "Problem Solving"],
    weaknesses: ["Advanced Topics", "Time Management"],
  }));

  // Mock assessments data for each class
  const classAssessments = {
    recentTests: [
      { id: `${classData.name.toLowerCase().replace(/\s+/g, '-')}-test-1`, name: "Ratios & Proportions Quiz", date: "2023-10-25", performance: "Excellent", completionRate: "98%" },
      { id: `${classData.name.toLowerCase().replace(/\s+/g, '-')}-test-2`, name: "Algebra Basics Test", date: "2023-10-10", performance: "Above Average", completionRate: "94%" },
      { id: `${classData.name.toLowerCase().replace(/\s+/g, '-')}-test-3`, name: "Statistics & Data Analysis", date: "2023-09-27", performance: "Excellent", completionRate: "97%" }
    ],
    allTests: [
      { id: `${classData.name.toLowerCase().replace(/\s+/g, '-')}-test-1`, name: "Ratios & Proportions Quiz", date: "2023-10-25", performance: "Excellent", completionRate: "98%" },
      { id: `${classData.name.toLowerCase().replace(/\s+/g, '-')}-test-2`, name: "Algebra Basics Test", date: "2023-10-10", performance: "Above Average", completionRate: "94%" },
      { id: `${classData.name.toLowerCase().replace(/\s+/g, '-')}-test-3`, name: "Statistics & Data Analysis", date: "2023-09-27", performance: "Excellent", completionRate: "97%" },
      { id: `${classData.name.toLowerCase().replace(/\s+/g, '-')}-test-4`, name: "Geometric Formulas Assessment", date: "2023-09-12", performance: "Good", completionRate: "92%" },
      { id: `${classData.name.toLowerCase().replace(/\s+/g, '-')}-test-5`, name: "Pre-Algebra Evaluation", date: "2023-08-29", performance: "Above Average", completionRate: "93%" },
      { id: `${classData.name.toLowerCase().replace(/\s+/g, '-')}-test-6`, name: "Mathematical Reasoning Test", date: "2023-08-15", performance: "Excellent", completionRate: "96%" }
    ]
  };

  // Mock performance trend data for different time periods
  const performanceTrendData = {
    week: [
      { date: "2023-10-23", score: 74, testName: "Daily Quiz 1" },
      { date: "2023-10-24", score: 76, testName: "Daily Quiz 2" },
      { date: "2023-10-25", score: 78, testName: "Ratios & Proportions Quiz" },
      { date: "2023-10-26", score: 75, testName: "Practice Test" },
      { date: "2023-10-27", score: 77, testName: "Weekly Assessment" },
      { date: "2023-10-28", score: 79, testName: "Review Quiz" },
      { date: "2023-10-29", score: 76, testName: "Weekend Practice" },
    ],
    month: [
      { date: "2023-08-15", score: 68, testName: "Mathematical Reasoning Test" },
      { date: "2023-08-29", score: 71, testName: "Pre-Algebra Evaluation" },
      { date: "2023-09-12", score: 69, testName: "Geometric Formulas Assessment" },
      { date: "2023-09-27", score: 74, testName: "Statistics & Data Analysis" },
      { date: "2023-10-10", score: 72, testName: "Algebra Basics Test" },
      { date: "2023-10-25", score: 76, testName: "Ratios & Proportions Quiz" },
    ],
    year: [
      { date: "2023-01-15", score: 65, testName: "Q1 Assessment" },
      { date: "2023-03-15", score: 68, testName: "Q2 Assessment" },
      { date: "2023-06-15", score: 70, testName: "Q3 Assessment" },
      { date: "2023-09-15", score: 73, testName: "Q4 Assessment" },
      { date: "2023-10-25", score: 76, testName: "Current Assessment" },
    ]
  };

  // Get current performance trend data based on selected time period
  const classPerformanceTrend = performanceTrendData[timePeriod];

  // Sort students by average score descending
  const sortedStudents = [...displayStudents].sort((a, b) => b.averageScore - a.averageScore);
  
  // Sort topic mastery data from highest to lowest percentage
  const sortedTopicMastery = [...classData.topicMastery].sort((a, b) => b.mastery - a.mastery);
  
  // Prepare data for the error patterns pie chart with subject names
  const errorChartData = classData.errorPatterns.map((error, index) => ({
    name: error.pattern,
    value: error.percentage,
    subject: error.pattern, // Adding subject field which contains the pattern name
    fill: ['#FF6B81', '#FF9F43', '#FFCC29'][index % 3] // Pink, Orange, Yellow colors similar to the image
  }));

  // Function to format date based on time period
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (timePeriod === "week") {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric' 
      });
    } else if (timePeriod === "month") {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short'
      });
    }
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
    ? classAssessments.allTests 
    : classAssessments.recentTests;

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
  
  // Navigate to individual test analytics
  const handleViewTestAnalytics = (testId: string) => {
    navigate(`/reports/${testId}`);
  };
  
  return (
    <div className="space-y-6">
      {/* Class Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {classData.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Grade {classData.grade} • {loadingStudents ? "Loading..." : `${realStudents.length} students`}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Average:</span>
            <span className={`ml-2 font-bold ${
              classData.averageScore >= 75 
                ? "text-green-600 dark:text-green-400" 
                : classData.averageScore >= 60
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {classData.averageScore.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Performance Trend */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Class Performance Trend
          </h3>
          
          <div className="flex gap-2 mt-3 sm:mt-0">
            {(["week", "month", "year"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timePeriod === period
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={classPerformanceTrend}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => formatDate(value)}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, 'Class Average']}
                labelFormatter={(label) => formatDate(label)}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#scoreGradient)"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Performance Overview */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Performance Overview
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topic Mastery Overview - Takes up 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
              Topic Mastery Overview
            </h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={sortedTopicMastery}
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  barSize={18}
                  barGap={16}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis 
                    dataKey="topic" 
                    type="category" 
                    tick={(props) => {
                      const topic = props.payload.value;
                      return (
                        <text 
                          x={props.x} 
                          y={props.y} 
                          dy={4} 
                          textAnchor="end" 
                          fill="#666"
                          fontSize={14}
                        >
                          {topic}
                        </text>
                      );
                    }}
                    width={120}
                    interval={0}
                    tickMargin={10}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Mastery']}
                  />
                  <Bar 
                    dataKey="mastery" 
                    radius={[0, 4, 4, 0]}
                  >
                    {sortedTopicMastery.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.mastery >= 70 ? "#16a34a" : "#f97316"}
                      />
                    ))}
                    <LabelList 
                      dataKey="mastery" 
                      position="right" 
                      formatter={(value) => `${value}%`}
                      style={{ fill: '#666', fontSize: '12px', fontWeight: 'bold' }}
                      offset={10}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Common Error Patterns */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
              Common Error Patterns
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={errorChartData}
                    cx="50%"
                    cy="40%"
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="subject"
                    label={false}
                  >
                    {errorChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, `${errorChartData.find(item => item.value === value)?.subject || 'Error'}`]}
                    labelFormatter={(label) => `${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-4">
              {classData.errorPatterns.map((error, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: ['#FF6B81', '#FF9F43', '#FFCC29'][index % 3] }} 
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {error.pattern}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${error.percentage}%`,
                        backgroundColor: ['#FF6B81', '#FF9F43', '#FFCC29'][index % 3]
                      }} 
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Affects ~{error.percentage}% of students
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Tests/Assessments */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
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
                  : "No recent assessments available for this class."}
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
      </motion.div>
      
      {/* Student List - Updated to use real data */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Students
        </h3>
        
        {loadingStudents ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 dark:text-gray-400">Loading students...</div>
          </div>
        ) : realStudents.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                No students found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This class doesn't have any students enrolled yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedStudents.map((student) => (
              <motion.div
                key={student.id}
                className="py-4 first:pt-0 last:pb-0 cursor-pointer"
                onClick={() => onStudentSelect(student.id)}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {student.name}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <div className="flex items-center">
                        <span>Average: </span>
                        <span className={`ml-1 ${
                          student.averageScore >= 75 
                            ? "text-green-600 dark:text-green-400" 
                            : student.averageScore >= 60
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                        }`}>
                          {student.averageScore}%
                        </span>
                      </div>
                      <div className="flex items-center ml-4">
                        <span>Growth: </span>
                        <div className={`ml-1 flex items-center ${
                          student.improvement > 0 
                            ? "text-green-600 dark:text-green-400" 
                            : student.improvement < 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}>
                          {student.improvement > 0 ? (
                            <>
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {student.improvement}%
                            </>
                          ) : student.improvement < 0 ? (
                            <>
                              <TrendingDown className="w-3 h-3 mr-1" />
                              {Math.abs(student.improvement)}%
                            </>
                          ) : (
                            "0%"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
