
import React from "react";
import { ClassPerformance, ErrorTypeResult } from "@/types";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface ClassDashboardProps {
  classData: ClassPerformance;
  onBackToOverview: () => void;
}

export const ClassDashboard: React.FC<ClassDashboardProps> = ({
  classData,
  onBackToOverview
}) => {
  // Transform the topic mastery data for the horizontal bar chart
  const topicMasteryData = classData.topicMastery.map(topic => ({
    topic: topic.topic,
    mastery: topic.mastery,
    color: topic.mastery >= 75 ? "#10b981" : 
           topic.mastery >= 65 ? "#f97316" : 
           "#ef4444"
  }));
  
  // Transform the error patterns data for the pie chart
  const errorPatternsData = classData.errorPatterns.map((error, index) => ({
    name: error.pattern,
    value: error.percentage,
    fill: ["#f87171", "#fb923c", "#fbbf24"][index % 3], // Pink, Orange, Yellow
    description: `Affects ~${error.percentage}% of students`
  }));
  
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center mb-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1 pl-0"
          onClick={onBackToOverview}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Overview</span>
        </Button>
      </div>
      
      {/* Class Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {classData.name} Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Grade {classData.grade} performance insights
        </p>
      </div>
      
      {/* Class Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {classData.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Grade {classData.grade} • {classData.studentCount || 9} students
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
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
      
      {/* Performance Overview Card */}
      <motion.div
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Performance Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Topic Mastery Overview */}
          <div>
            <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
              Topic Mastery Overview
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topicMasteryData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]} 
                  />
                  <YAxis 
                    dataKey="topic" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                    width={110}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Mastery']}
                  />
                  <Bar 
                    dataKey="mastery" 
                    radius={[0, 4, 4, 0]}
                  >
                    {topicMasteryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    {/* Add percentage labels at the end of each bar */}
                    {topicMasteryData.map((entry, index) => (
                      <text
                        key={`label-${index}`}
                        x={entry.mastery + 5}
                        y={index * 40 + 20}
                        fill="#666666"
                        fontSize={12}
                        textAnchor="start"
                        dominantBaseline="middle"
                      >
                        {entry.mastery}%
                      </text>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Common Error Patterns */}
          <div>
            <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
              Common Error Patterns
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={errorPatternsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {errorPatternsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Affected Students']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Error patterns legend */}
            <div className="mt-4 space-y-4">
              {errorPatternsData.map((error, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: error.fill }} 
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {error.name}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ width: `${error.value}%`, backgroundColor: error.fill }} 
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Affects ~{error.value}% of students
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Generate Report Button */}
      <div className="flex justify-end mt-6">
        <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Generate Report</span>
        </Button>
      </div>
    </div>
  );
};
