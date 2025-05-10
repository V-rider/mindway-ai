
import React from 'react';
import { ClassPerformance, StudentPerformance } from '@/types';
import { motion } from 'framer-motion';
import { User, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
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
  Legend
} from 'recharts';

interface ClassPerformanceCardProps {
  classData: ClassPerformance;
  students: StudentPerformance[];
  onStudentSelect: (studentId: string) => void;
}

export const ClassPerformanceCard: React.FC<ClassPerformanceCardProps> = ({
  classData,
  students,
  onStudentSelect,
}) => {
  // Sort students by average score descending
  const sortedStudents = [...students].sort((a, b) => b.averageScore - a.averageScore);
  
  // Sort topic mastery data from highest to lowest percentage
  const sortedTopicMastery = [...classData.topicMastery].sort((a, b) => b.mastery - a.mastery);
  
  // Prepare data for the error patterns donut chart
  const errorChartData = classData.errorPatterns.map((error, index) => ({
    name: error.pattern,
    value: error.percentage,
    fill: ['#FF6B81', '#FF9F43', '#FFCC29'][index % 3] // Pink, Orange, Yellow colors similar to the image
  }));
  
  return (
    <div className="space-y-6">
      {/* Class Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {classData.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Grade {classData.grade} • {students.length} students
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

      {/* Performance Overview */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
                  barSize={18} // Further reduced bar size for more spacing
                  barGap={16} // Increased bar gap for better spacing
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis 
                    dataKey="topic" 
                    type="category" 
                    tick={(props) => {
                      // Custom tick renderer to prevent line breaks in the topic names
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
                    interval={0} // Ensure all ticks are shown
                    tickMargin={10} // Add margin to ticks
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
                        fill={entry.mastery >= 70 ? "#16a34a" : "#f97316"} // Dark green (#16a34a) for ≥70%, Orange for <70%
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
          
          {/* Common Error Patterns - Now a donut chart */}
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
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={false}
                  >
                    {errorChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'of students']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Error patterns legend with progress bars */}
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
      
      {/* Student List */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Students
        </h3>
        
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
                  {student.avatar ? (
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  )}
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
      </motion.div>
    </div>
  );
};
