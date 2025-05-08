
import React from 'react';
import { StudentProfile } from '@/types';
import { motion } from 'framer-motion';
import { User, TrendingUp, TrendingDown, Download, FileText, ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StudentProfileCardProps {
  student: StudentProfile;
  onBack: () => void;
  onGenerateReport: (studentId: string) => void;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  student,
  onBack,
  onGenerateReport,
}) => {
  // Format dates for the chart
  const chartData = student.progressData.map(point => ({
    name: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Score: point.score,
    testId: point.testId,
    testName: point.testName,
  }));
  
  // For the pie chart
  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE'];
  
  return (
    <div className="space-y-6">
      {/* Student Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-purple-100 dark:bg-gray-700 flex items-center justify-center mr-4">
              {student.avatar ? (
                <img 
                  src={student.avatar} 
                  alt={student.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {student.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {student.className} • Grade {student.grade} • {student.email}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => onGenerateReport(student.id)}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>
      
      {/* Performance Overview */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Performance Overview
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Progress Chart */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
              Progress Over Time
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#888' }} 
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 12, fill: '#888' }} 
                    label={{ 
                      value: 'Score (%)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#888', fontSize: 12 } 
                    }} 
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Score']}
                    labelFormatter={(label) => `Test Date: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Score" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                    isAnimationActive={true} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Mistake Breakdown - Fixed with ScrollArea and better responsive handling */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
              Mistake Breakdown
            </h4>
            <ScrollArea className="h-64">
              <div className="flex flex-col justify-center items-center h-full">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={student.mistakeBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                      nameKey="type"
                    >
                      {student.mistakeBreakdown.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Percentage']}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
                              <p className="text-sm font-medium">{data.type}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{`${data.percentage}%`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{ fontSize: '12px' }}
                      formatter={(value) => {
                        return <span className="text-xs">{value}</span>;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ScrollArea>
          </div>
        </div>
      </motion.div>
      
      {/* Strengths and Weaknesses */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Strengths */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            Strengths
          </h3>
          
          <ul className="space-y-3">
            {student.strengths.map((strength, index) => (
              <li 
                key={index} 
                className="flex items-center bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-800/30"
              >
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-700/30 flex items-center justify-center mr-3">
                  <span className="text-xs font-medium text-green-800 dark:text-green-300">
                    {index + 1}
                  </span>
                </div>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {strength}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Weaknesses */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
            Areas for Improvement
          </h3>
          
          <ul className="space-y-3">
            {student.weaknesses.map((weakness, index) => (
              <li 
                key={index} 
                className="flex items-center bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-800/30"
              >
                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-700/30 flex items-center justify-center mr-3">
                  <span className="text-xs font-medium text-red-800 dark:text-red-300">
                    {index + 1}
                  </span>
                </div>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {weakness}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
      
      {/* Recommended Exercises */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            <BookOpen className="w-5 h-5 text-purple-500 mr-2" />
            Recommended Exercises
          </h3>
          
          <Link 
            to={`/learning-pathway?studentId=${student.id}`}
            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {student.recommendedExercises.map((exercise, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
            >
              <h4 className="font-medium text-gray-800 dark:text-gray-200">
                {exercise.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {exercise.topic}
              </p>
              
              <div className="mt-3 flex items-center justify-between">
                <div className={`px-2 py-1 text-xs rounded-full ${
                  exercise.difficulty === 'easy' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : exercise.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {exercise.difficulty}
                </div>
                
                <Link
                  to={`/learning-pathway?exercise=${exercise.id}`}
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                >
                  Start
                </Link>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Past Reports */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <FileText className="w-5 h-5 text-blue-500 mr-2" />
          Past Reports
        </h3>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {student.progressData.slice(0, 3).map((report, index) => (
            <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  {report.testName}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(report.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`font-medium ${
                  report.score >= 75 
                    ? "text-green-600 dark:text-green-400" 
                    : report.score >= 60
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {report.score}%
                </span>
                
                <Link
                  to={`/reports/${report.testId}?studentId=${student.id}`}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <FileText className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
