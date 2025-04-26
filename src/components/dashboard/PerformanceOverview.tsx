
import React, { useState } from "react";
import { School, ClassPerformance } from "@/types";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  PieChart,
  AlertTriangle, 
  Flag,
  ChevronDown
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

interface PerformanceOverviewProps {
  school: School;
  classPerformances: ClassPerformance[];
  onClassSelect: (classId: string) => void;
}

export const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ 
  school, 
  classPerformances,
  onClassSelect 
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string | "all">("all");
  
  // Filter classes by grade if needed
  const filteredClasses = selectedGrade === "all"
    ? classPerformances
    : classPerformances.filter(cp => cp.grade === selectedGrade);
  
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
  
  // Data for charts
  const classBarChartData = filteredClasses.map(classData => ({
    name: classData.name,
    score: classData.averageScore,
    grade: `Grade ${classData.grade}`,
    fill: classData.averageScore >= 80 ? "#10b981" : 
          classData.averageScore >= 65 ? "#facc15" : "#ef4444"
  }));
  
  // Error patterns for pie chart
  const errorPieChartData = commonErrorPatterns.map((error, index) => ({
    name: error.pattern,
    value: Math.round(error.avgPercentage),
    description: `Affects ~${error.avgPercentage.toFixed(1)}% of students`,
    fill: ["#f87171", "#fb923c", "#fbbf24"][index % 3] // red, orange, amber
  }));
  
  // Get unique grades for filter
  const grades = Array.from(new Set(classPerformances.map(cp => cp.grade))).sort();
    
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
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {school.name} Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Performance insights
            </p>
          </div>
          
          {/* Grade filter */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {selectedGrade === "all" ? "All Grades" : `Grade ${selectedGrade}`}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedGrade("all")}>
                  All Grades
                </DropdownMenuItem>
                {grades.map(grade => (
                  <DropdownMenuItem 
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                  >
                    Grade {grade}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Class Performance
            </h3>
            
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
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={customTooltips.renderBarChartTooltip} />
                  <Bar 
                    dataKey="score" 
                    name="Average Score"
                    onClick={(data) => {
                      const classData = filteredClasses.find(c => c.name === data.name);
                      if (classData) {
                        onClassSelect(classData.id);
                      }
                    }}
                    cursor="pointer"
                  >
                    {classBarChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
              Click on a bar to view detailed class data
            </div>
          </div>
          
          {/* Areas of Concern */}
          <div>
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
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-md"
                          onClick={() => onClassSelect(classData.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {classData.name} (Grade {classData.grade})
                            </span>
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">
                              {classData.averageScore}%
                            </span>
                          </div>
                          <Progress value={classData.averageScore} className="h-2 bg-gray-200 dark:bg-gray-700" />
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
          </div>
        </div>
      </motion.div>
    </div>
  );
};
