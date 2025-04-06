
import React from "react";
import { School, ClassPerformance } from "@/types";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

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
  const overallAverage = classPerformances.reduce(
    (sum, cp) => sum + cp.averageScore, 
    0
  ) / (classPerformances.length || 1);
  
  // Find classes with concerning performance
  const lowPerformingClasses = classPerformances
    .filter(cp => cp.averageScore < 65)
    .sort((a, b) => a.averageScore - b.averageScore);
  
  // Find common error patterns across classes
  const allErrorPatterns = classPerformances.flatMap(cp => cp.errorPatterns);
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
              Monitoring performance across {school.classes.length} classes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Overall Average:</span>
              <span className={`ml-2 font-bold ${
                overallAverage >= 75 
                  ? "text-green-600 dark:text-green-400" 
                  : overallAverage >= 60
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-red-600 dark:text-red-400"
              }`}>
                {overallAverage.toFixed(1)}%
              </span>
            </div>
            <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Classes:</span>
              <span className="ml-2 font-bold text-gray-800 dark:text-gray-200">
                {school.classes.length}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Classes Overview */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Class Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classPerformances.map((classData) => (
                <motion.div
                  key={classData.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
                  whileHover={{ y: -4 }}
                  onClick={() => onClassSelect(classData.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        {classData.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Grade {classData.grade}
                      </p>
                    </div>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      classData.averageScore >= 75 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                        : classData.averageScore >= 60
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}>
                      {classData.averageScore}%
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {classData.topicMastery.slice(0, 2).map((topic, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400 truncate max-w-[70%]">
                          {topic.topic}
                        </span>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                            <div 
                              className={`h-1.5 rounded-full ${
                                topic.mastery >= 75 
                                  ? "bg-green-500" 
                                  : topic.mastery >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`} 
                              style={{ width: `${topic.mastery}%` }}
                            />
                          </div>
                          <span className={
                            topic.mastery >= 75 
                              ? "text-green-600 dark:text-green-400" 
                              : topic.mastery >= 60
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                          }>
                            {topic.mastery}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Alerts & Issues */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
              Areas of Concern
            </h3>
            
            <div className="space-y-4">
              {lowPerformingClasses.length > 0 ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
                    Low Performing Classes
                  </h4>
                  <ul className="space-y-2">
                    {lowPerformingClasses.slice(0, 3).map(classData => (
                      <li key={classData.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {classData.name} (Grade {classData.grade})
                        </span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {classData.averageScore}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 dark:text-green-400 mb-2">
                    All Classes Performing Well
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    No classes are currently below the 65% threshold.
                  </p>
                </div>
              )}
              
              {/* Common Error Patterns */}
              <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-2">
                  Common Error Patterns
                </h4>
                <ul className="space-y-2">
                  {commonErrorPatterns.map((error, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span>{error.pattern}</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {error.count} classes
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                        <div 
                          className="h-1.5 rounded-full bg-red-500" 
                          style={{ width: `${error.avgPercentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Avg. {error.avgPercentage.toFixed(1)}% of students affected
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
