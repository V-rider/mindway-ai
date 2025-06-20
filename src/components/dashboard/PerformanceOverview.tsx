
import React, { useState, useEffect } from "react";
import { School, ClassPerformance } from "@/types";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  PieChart,
  AlertTriangle, 
  Flag,
  ChevronDown,
  School as SchoolIcon,
  FileText
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsePieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { customTooltips } from '@/components/ui/custom-tooltips';
import { Progress } from '@/components/ui/progress';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/context/AuthContext";
import { classApi } from "@/lib/api/classes";

interface PerformanceOverviewProps {
  school: School;
  classPerformances: ClassPerformance[];
  onClassSelect: (classId: string) => void;
  onGradeChange?: (grade: string) => void;
  selectedGrade?: string;
  onDetailReport?: (grade: string) => void;
}

// Helper to safely call .includes on any value
function safeIncludes(val: unknown, search: string) {
  try {
    return String(val).includes(search);
  } catch {
    return false;
  }
}

export const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ 
  // school, 
  classPerformances,
  onClassSelect,
  onGradeChange,
  selectedGrade = "6",
  onDetailReport
}) => {
  const { user, isAdmin } = useAuth();
  const [teacherClasses, setTeacherClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  
  // Fetch teacher's classes from database (only for admin/teacher accounts)
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user?.email || !isAdmin) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching teacher data for email:", user.email);
        
        const result = await classApi.getTeacherClasses(user.email);
        
        console.log("Teacher data found:", result);
        setTeacherName(result.teacherName);
        // Extract class names from the database response
        setTeacherClasses(
          Array.isArray(result.classes)
            ? result.classes.map(c => String(c.class_name)).filter(Boolean)
            : []
        );
        
      } catch (error) {
        console.error("Error in fetchTeacherData:", error);
        setTeacherClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [user?.email, isAdmin]);
  
  // Filter classes by grade
  const filteredClasses = classPerformances.filter(cp => cp.grade === selectedGrade);
  
  const overallAverage = filteredClasses.reduce(
    (sum, cp) => sum + cp.averageScore, 
    0
  ) / (filteredClasses.length || 1);
  
  // Find classes with concerning performance
  const lowPerformingClasses = filteredClasses
    .filter(cp => cp.averageScore < 65)
    .sort((a, b) => a.averageScore - b.averageScore);
  
  // Find common error patterns across classes
  const allErrorPatterns = filteredClasses.flatMap(cp => cp.errorPatterns);
  const commonErrorPatterns = allErrorPatterns
    .reduce((acc: {pattern: string, count: number, avgPercentage: number}[], current) => {
      const existing = acc.find(item => item.pattern === current.pattern);
      if (existing) {
        existing.count += 1;
        existing.avgPercentage += current.percentage;
      } else {
        acc.push({ pattern: current.pattern, count: 1, avgPercentage: current.percentage });
      }
      return acc;
    }, [])
    .map(item => ({ 
      ...item, 
      avgPercentage: item.avgPercentage / item.count 
    }))
    .sort((a, b) => b.count - a.count || b.avgPercentage - a.avgPercentage)
    .slice(0, 3);
  
  // Check if a class is taught by the logged-in teacher (only for teachers)
  const isTeacherClass = (className: string) => {
    const result = isAdmin && teacherClasses.includes(className);
    console.log(`isTeacherClass check for "${className}":`, { isAdmin, teacherClasses, result });
    return result;
  };
  
  // Data for charts
  const classBarChartData = filteredClasses.map(classData => {
    const isTeaching = isTeacherClass(classData.name);
    console.log(`Chart data for "${classData.name}":`, { isTeaching, teacherClasses });
    
    return {
      name: classData.name,
      score: classData.averageScore,
      grade: `Grade ${classData.grade}`,
      fill: classData.averageScore >= 80 ? "#10b981" : 
            classData.averageScore >= 65 ? "#facc15" : "#ef4444",
      isTeaching: isTeaching
    };
  });
  
  // Error patterns for pie chart
  const errorPieChartData = commonErrorPatterns.map((error, index) => ({
    name: error.pattern,
    value: Math.round(error.avgPercentage),
    description: `Affects ~${error.avgPercentage.toFixed(1)}% of students`,
    fill: ["#f87171", "#fb923c", "#fbbf24"][index % 3]
  }));
  
  // Extract unique grades for filter dropdown
  const grades = Array.from(new Set(classPerformances.map(cp => cp.grade))).sort();
  
  // Debug log before filter
  console.log('teacherClasses (before filter):', teacherClasses, teacherClasses.map(c => typeof c));

  // Filter teacher's classes by selected grade (only for teachers)
  let teacherClassesForGrade = [];
  if (isAdmin) {
    try {
      teacherClassesForGrade = teacherClasses.filter(className => {
        return safeIncludes(className, `${selectedGrade}`) ||
               classPerformances.some(cp => safeIncludes(cp.name, className) && cp.grade === selectedGrade);
      });
    } catch (e) {
      console.error('Error in teacherClassesForGrade filter:', e, teacherClasses);
      teacherClassesForGrade = [];
    }
  }
    
  console.log('teacherClasses:', teacherClasses);
  
  return (
    <div className="space-y-6">
      {/* School Overview Card */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
              <SchoolIcon className="h-6 w-6 mr-2 text-purple-500" />
              Performance Overview
            </h2>
            
            {/* Detail Report Button */}
            {onDetailReport && (
              <Button 
                onClick={() => onDetailReport(selectedGrade)}
                variant="outline" 
                className="flex items-center gap-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <FileText className="h-4 w-4" />
                Detail Report for Grade {selectedGrade}
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            {isAdmin && (
              <p className="text-gray-600 dark:text-gray-400 text-sm hidden md:block">
                <SchoolIcon className="h-4 w-4 mr-1.5 text-purple-500 inline" />
                Classes you teach have a purple outline
              </p>
            )}
            
            {/* Grade filter */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Grade {selectedGrade}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {grades.map(grade => (
                    <DropdownMenuItem 
                      key={grade}
                      onClick={() => onGradeChange?.(grade)}
                    >
                      Grade {grade}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Overall Average</div>
            <div className={`text-2xl font-bold ${
              overallAverage >= 80 
                ? "text-green-600 dark:text-green-400" 
                : overallAverage >= 65
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {overallAverage.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Classes</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {filteredClasses.length}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Top Performing Class</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {filteredClasses.length > 0 
                ? filteredClasses.reduce((prev, current) => 
                    prev.averageScore > current.averageScore ? prev : current
                  ).name
                : "N/A"}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Needs Attention</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {lowPerformingClasses.length}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Classes Overview Chart */}
          <div className="col-span-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Class Performance
            </h3>
            {isAdmin && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Classes you teach have a purple outline and are clickable
              </p>
            )}
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={classBarChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                  barSize={36}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={props => {
                      const isTeaching = classBarChartData.find(item => item.name === props.payload.value)?.isTeaching;
                      const displayName = props.payload.value.replace(/^Class\s+/, '');
                      return (
                        <text 
                          x={props.x} 
                          y={props.y} 
                          dy={16} 
                          textAnchor="end" 
                          fill={isTeaching ? "#9b87f5" : "#666"}
                          fontWeight={isTeaching ? "600" : "normal"}
                          transform={`rotate(-45, ${props.x}, ${props.y})`}
                        >
                          {displayName}
                        </text>
                      );
                    }}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={customTooltips.renderBarChartTooltip} />
                  <Bar 
                    dataKey="score" 
                    name="Average Score"
                    onClick={(data) => {
                      // Only allow clicking if it's a teacher's class
                      const barData = classBarChartData.find(item => item.name === data.name);
                      if (barData?.isTeaching) {
                        const classData = filteredClasses.find(c => c.name === data.name);
                        if (classData) {
                          onClassSelect(classData.id);
                        }
                      }
                    }}
                  >
                    {classBarChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill}
                        stroke={entry.isTeaching ? "#8b5cf6" : "transparent"}
                        strokeWidth={entry.isTeaching ? 3 : 0}
                        style={{ cursor: entry.isTeaching ? "pointer" : "default" }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
              {isAdmin ? "Click on your classes (purple outline) to view detailed data" : "Click on a bar to view detailed class data"}
            </div>
          </div>
          
          {/* Areas of Concern */}
          <div>
            {/* Areas of Concern collapsible */}
            <Collapsible className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                  Areas of Concern
                </h3>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0">
                {lowPerformingClasses.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2 text-sm">
                      Low Performing Classes
                    </h4>
                    <ul className="space-y-3">
                      {lowPerformingClasses.slice(0, 3).map(classData => (
                        <li 
                          key={classData.id} 
                          className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-md ${
                            isTeacherClass(classData.name) ? 'border-2 border-purple-300 dark:border-purple-600' : ''
                          }`}
                          onClick={() => onClassSelect(classData.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm flex items-center ${
                              isTeacherClass(classData.name) 
                                ? 'text-purple-700 dark:text-purple-300 font-medium' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {isTeacherClass(classData.name) && (
                                <SchoolIcon className="h-4 w-4 mr-1.5 text-purple-500" />
                              )}
                              {classData.name} (Grade {classData.grade})
                            </span>
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">
                              {classData.averageScore}%
                            </span>
                          </div>
                          <Progress 
                            value={classData.averageScore} 
                            className={`h-2 ${
                              isTeacherClass(classData.name)
                                ? 'bg-purple-100 dark:bg-purple-900/30'
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-green-800 dark:text-green-400 mb-2 text-sm">
                      All Classes Performing Well
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      No classes are currently below the 65% threshold.
                    </p>
                  </div>
                )}
                
                {/* Common Error Patterns Pie Chart */}
                <div className="mt-6">
                  <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-4 text-sm flex items-center">
                    <PieChart className="w-4 h-4 mr-1 text-purple-500" />
                    Common Error Patterns
                  </h4>
                  
                  {commonErrorPatterns.length > 0 ? (
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsePieChart>
                          <Pie
                            data={errorPieChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            innerRadius={30}
                            dataKey="value"
                            nameKey="name"
                          >
                            {errorPieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip content={customTooltips.renderPieChartTooltip} />
                        </RechartsePieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                      No common error patterns detected
                    </div>
                  )}
                  
                  <div className="space-y-3 mt-4">
                    {commonErrorPatterns.map((error, index) => (
                      <div key={index} className="group">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: ["#f87171", "#fb923c", "#fbbf24"][index % 3] }}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {error.pattern}
                            </span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            <span className="text-xs">Flag</span>
                          </Button>
                        </div>
                        <Progress value={error.avgPercentage} className="h-2 bg-gray-200 dark:bg-gray-700" />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Affects ~{error.avgPercentage.toFixed(1)}% of students
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Your Classes Section - Only show for teachers */}
            {isAdmin && (
              <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-3 text-sm flex items-center">
                  <SchoolIcon className="h-4 w-4 mr-1.5 text-purple-500" />
                  Your Classes {loading && "(Loading...)"}
                  {teacherName && (
                    <span className="ml-2 text-xs text-purple-600 dark:text-purple-400">
                      (Teacher: {teacherName})
                    </span>
                  )}
                </h4>
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {teacherClassesForGrade.length > 0 ? (
                      teacherClassesForGrade.map((className, i) => {
                        const classData = classPerformances.find(c => c.name === className);
                        return (
                          <div 
                            key={i} 
                            className="flex items-center justify-between cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 p-2 rounded-md"
                            onClick={() => {
                              if (classData) {
                                onClassSelect(classData.id);
                              }
                            }}
                          >
                            <span className="text-sm text-purple-700 dark:text-purple-300 font-medium flex items-center">
                              <SchoolIcon className="h-4 w-4 mr-1.5 text-purple-500" />
                              {className}
                            </span>
                            <span className="text-xs text-purple-600 dark:text-purple-400">
                              {classData ? "View details →" : "No data"}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          {teacherClasses.length === 0 
                            ? "No classes assigned to you" 
                            : `No classes found for Grade ${selectedGrade}`}
                        </p>
                        {teacherClasses.length > 0 && (
                          <p className="text-xs text-purple-500 dark:text-purple-500 mt-1">
                            You teach: {teacherClasses.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
