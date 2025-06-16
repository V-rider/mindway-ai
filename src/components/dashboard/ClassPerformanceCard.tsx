
import React from 'react';
import { ClassPerformance, StudentPerformance } from '@/types';
import { motion } from 'framer-motion';
import { User, TrendingUp, TrendingDown, ChevronRight, Calendar, Target, Award, AlertTriangle } from 'lucide-react';
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
  ScatterChart,
  Scatter
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
  
  // Prepare data for the error patterns pie chart with subject names
  const errorChartData = classData.errorPatterns.map((error, index) => ({
    name: error.pattern,
    value: error.percentage,
    subject: error.pattern,
    fill: ['#FF6B81', '#FF9F43', '#FFCC29'][index % 3]
  }));

  // Mock assessment data for this class
  const classAssessments = [
    {
      id: "test-1",
      name: "Number Operations Quiz",
      date: "2023-11-20",
      averageScore: 78,
      participantCount: 22,
      difficulty: "Medium",
      status: "completed"
    },
    {
      id: "test-2", 
      name: "Fractions Assessment",
      date: "2023-11-15",
      averageScore: 65,
      participantCount: 24,
      difficulty: "Hard",
      status: "completed"
    },
    {
      id: "test-3",
      name: "Geometry Basics",
      date: "2023-11-10",
      averageScore: 85,
      participantCount: 23,
      difficulty: "Easy",
      status: "completed"
    },
    {
      id: "test-4",
      name: "Word Problems Challenge",
      date: "2023-11-05",
      averageScore: 72,
      participantCount: 24,
      difficulty: "Hard",
      status: "completed"
    }
  ];

  // Performance trend data
  const performanceTrend = [
    { assessment: "Geometry Basics", score: 85, date: "Nov 10" },
    { assessment: "Word Problems", score: 72, date: "Nov 5" },
    { assessment: "Fractions", score: 65, date: "Nov 15" },
    { assessment: "Number Ops", score: 78, date: "Nov 20" }
  ];

  // Student ability analysis data
  const studentAbilityData = [
    {
      category: "High Performers",
      count: 8,
      percentage: 33,
      color: "#10B981",
      description: "Consistent scores above 80%"
    },
    {
      category: "Steady Improvers", 
      count: 6,
      percentage: 25,
      color: "#3B82F6",
      description: "Showing steady improvement"
    },
    {
      category: "Inconsistent",
      count: 5,
      percentage: 21,
      color: "#F59E0B", 
      description: "Variable performance"
    },
    {
      category: "Need Support",
      count: 5,
      percentage: 21,
      color: "#EF4444",
      description: "Consistently below 60%"
    }
  ];

  // Score distribution data
  const scoreDistribution = [
    { range: "90-100%", count: 4, color: "#10B981" },
    { range: "80-89%", count: 7, color: "#059669" },
    { range: "70-79%", count: 6, color: "#F59E0B" },
    { range: "60-69%", count: 4, color: "#DC2626" },
    { range: "Below 60%", count: 3, color: "#B91C1C" }
  ];
  
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

      {/* Assessment Analysis Section */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Assessment Analysis
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Trend */}
          <div>
            <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
              Performance Trend
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Class Average']} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Ability Distribution */}
          <div>
            <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
              Student Performance Categories
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentAbilityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="category"
                  >
                    {studentAbilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} students`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {studentAbilityData.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">{category.category}</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">
                    {category.count} ({category.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="mb-6">
          <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
            Recent Assessments
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classAssessments.map((assessment, index) => (
              <div key={assessment.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200">
                      {assessment.name}
                    </h5>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {assessment.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {assessment.participantCount} students
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        assessment.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        assessment.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {assessment.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      assessment.averageScore >= 75 ? 'text-green-600 dark:text-green-400' :
                      assessment.averageScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {assessment.averageScore}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Class Avg
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Distribution */}
        <div>
          <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
            Score Distribution (Latest Assessment)
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="count" 
                    position="top" 
                    style={{ fill: '#666', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
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
          Topic Performance Overview
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
