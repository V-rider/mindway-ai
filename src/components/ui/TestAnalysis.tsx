
import React from "react";
import { TestResult, ConceptResult, ErrorTypeResult } from "@/types";
import { motion } from "framer-motion";
import { AlertCircle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/use-translation";

interface TestAnalysisProps {
  result: any; // Using 'any' temporarily to accept the current data format
  testName: string;
}

export const TestAnalysis: React.FC<TestAnalysisProps> = ({ result, testName }) => {
  const { t } = useTranslation();
  
  // Adapt the data to work with our component
  // This is a temporary solution until we update the test data structure
  const adaptedResult = {
    score: result.averageScore,
    concepts: result.questionStats ? result.questionStats.map(q => ({
      name: q.topic,
      percentage: q.correctPercentage,
      total: 1,
      score: q.correctPercentage / 100
    })) : [],
    errorTypes: [
      { type: "Calculation Errors", count: 3, percentage: 40 },
      { type: "Conceptual Gaps", count: 2, percentage: 30 },
      { type: "Careless Mistakes", count: 2, percentage: 20 },
      { type: "Time Management", count: 1, percentage: 10 }
    ],
    recommendations: [
      "Focus on practicing fraction operations daily",
      "Use visualization techniques for geometry problems",
      "Review multiplication tables regularly",
      "Take more timed practice tests to improve speed"
    ]
  };
  
  // Helper function to get color based on percentage score
  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-500 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  // Sort concepts from highest to lowest percentage
  const sortedConcepts = adaptedResult.concepts ? [...adaptedResult.concepts].sort((a, b) => b.percentage - a.percentage) : [];
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{testName} - {t('analysis')}</h2>
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium">
          <span>{t('class.average')}:</span>
          <span className={getScoreColor(adaptedResult.score)}>
            {adaptedResult.score}%
          </span>
        </div>
      </div>
      
      {/* By Concept */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {t('performance.by.concept')}
        </h3>
        
        <div className="glass-card rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedConcepts.map((concept, index) => (
            <motion.div 
              key={concept.name} 
              variants={item}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {concept.name}
                </h4>
                <span className={`text-sm font-bold ${getScoreColor(concept.percentage)}`}>
                  {concept.percentage}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div 
                  className={`h-2.5 rounded-full ${
                    concept.percentage >= 80
                      ? "bg-green-500"
                      : concept.percentage >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${concept.percentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${concept.percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {concept.percentage}% {t('class.average')}
              </div>
              
              <Link
                to={`/learning-pathway?concept=${encodeURIComponent(concept.name)}`}
                className="inline-flex items-center text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
              >
                <BookOpen className="w-3 h-3 mr-1" /> 
                {t('practice.this.concept')}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Error Types */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {t('common.error.types')}
        </h3>
        
        <div className="glass-card rounded-xl p-6">
          {adaptedResult.errorTypes.map(error => (
            <motion.div 
              key={error.type}
              variants={item}
              className="mb-4 last:mb-0"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {error.type}
                  </h4>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {error.count} {error.count === 1 ? t('error') : t('errors')} ({error.percentage}%)
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <motion.div 
                  className="h-1.5 rounded-full bg-red-500"
                  style={{ width: `${error.percentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${error.percentage}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {t('recommendations.for.improvement')}
        </h3>
        
        <div className="glass-card rounded-xl p-6">
          <ul className="space-y-3">
            {adaptedResult.recommendations.map((recommendation, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                className="flex items-start"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                  {recommendation}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};
