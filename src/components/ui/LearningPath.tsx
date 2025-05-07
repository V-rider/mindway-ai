
import React, { useState, useMemo } from "react";
import { LearningPath, LearningTopic, Exercise } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  Play,
  BarChart3,
  Trophy,
  Percent
} from "lucide-react";

interface LearningPathwayProps {
  learningPaths: LearningPath[];
  selectedConcept?: string;
}

export const LearningPathway: React.FC<LearningPathwayProps> = ({ 
  learningPaths,
  selectedConcept
}) => {
  const [expandedStrands, setExpandedStrands] = useState<string[]>(
    selectedConcept 
      ? learningPaths
          .filter(path => path.topics.some(topic => topic.name === selectedConcept))
          .map(path => path.strand)
      : [learningPaths[0]?.strand || ""]
  );
  
  const [expandedTopics, setExpandedTopics] = useState<string[]>(
    selectedConcept ? [selectedConcept] : []
  );
  
  // Generate static random percentages for each strand
  const strandPercentages = useMemo(() => {
    const percentages: Record<string, number> = {};
    
    learningPaths.forEach(path => {
      percentages[path.strand] = Math.floor(Math.random() * (95 - 40 + 1) + 40);
    });
    
    return percentages;
  }, [learningPaths]);
  
  const toggleStrand = (strand: string) => {
    setExpandedStrands(
      expandedStrands.includes(strand)
        ? expandedStrands.filter(s => s !== strand)
        : [...expandedStrands, strand]
    );
  };
  
  const toggleTopic = (topicId: string) => {
    setExpandedTopics(
      expandedTopics.includes(topicId)
        ? expandedTopics.filter(id => id !== topicId)
        : [...expandedTopics, topicId]
    );
  };
  
  const strandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
    }
  };
  
  const topicVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
    }
  };
  
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Calculate strand completion percentage (using a random value for now)
  const getStrandPercentage = (strand: string) => {
    // This would ideally be calculated based on actual completion data
    // For now, generate a random percentage between 40 and 95
    return Math.floor(Math.random() * (95 - 40 + 1) + 40);
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
        Math Learning Pathway
      </h2>
      
      <div className="space-y-6">
        {learningPaths.map((path, index) => {
          const completionPercentage = strandPercentages[path.strand];
          return (
            <div 
              key={path.strand}
              className="glass-card rounded-xl overflow-hidden"
            >
              <motion.button
                className={`w-full flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 text-left ${
                  expandedStrands.includes(path.strand)
                    ? "bg-purple-50 dark:bg-purple-900/10"
                    : "bg-white dark:bg-gray-800"
                }`}
                onClick={() => toggleStrand(path.strand)}
                whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 flex items-center justify-center mr-3">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {path.strand} Strand
                  </h3>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-3">
                    <Percent className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-1" />
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      {completionPercentage}%
                    </span>
                  </div>
                  {expandedStrands.includes(path.strand) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </motion.button>
              
              <AnimatePresence>
                {expandedStrands.includes(path.strand) && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={strandVariants}
                    className="p-4"
                  >
                    <div className="space-y-4">
                      {path.topics.map(topic => (
                        <div 
                          key={topic.id}
                          className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
                            selectedConcept === topic.name 
                              ? "ring-2 ring-purple-500 dark:ring-purple-400" 
                              : ""
                          }`}
                        >
                          <motion.button
                            className={`w-full flex items-center justify-between p-4 text-left ${
                              expandedTopics.includes(topic.name)
                                ? "bg-purple-50 dark:bg-purple-900/10"
                                : "bg-white dark:bg-gray-800"
                            }`}
                            onClick={() => toggleTopic(topic.name)}
                            whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.05)" }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-center flex-1">
                              <div className="mr-3 text-purple-600 dark:text-purple-400">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-base font-medium text-gray-800 dark:text-gray-100 flex flex-wrap items-center">
                                  {topic.name}
                                  {selectedConcept === topic.name && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                      From Test Results
                                    </span>
                                  )}
                                </h4>
                                <div className="flex items-center mt-1">
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2 max-w-[120px]">
                                    <div 
                                      className="h-1.5 rounded-full bg-purple-600" 
                                      style={{ width: `${topic.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {topic.progress}% Complete
                                  </span>
                                </div>
                              </div>
                            </div>
                            {expandedTopics.includes(topic.name) ? (
                              <ChevronUp className="w-5 h-5 text-gray-400 ml-2" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 ml-2" />
                            )}
                          </motion.button>
                          
                          <AnimatePresence>
                            {expandedTopics.includes(topic.name) && (
                              <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={topicVariants}
                                className="px-4 pb-4"
                              >
                                <div className="mt-2 mb-4">
                                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Learning Objectives:
                                  </h5>
                                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    {topic.objectives.map((objective, i) => (
                                      <li key={i}>{objective}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                  Practice Exercises:
                                </h5>
                                
                                <div className="space-y-3">
                                  {topic.exercises.map(exercise => (
                                    <motion.div
                                      key={exercise.id}
                                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow"
                                      whileHover={{ y: -2 }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          {exercise.completed ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 mr-3" />
                                          ) : (
                                            <Clock className="w-5 h-5 text-gray-400 mr-3" />
                                          )}
                                          <div>
                                            <h6 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                              {exercise.title}
                                            </h6>
                                            <div className="flex items-center mt-1">
                                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyClass(exercise.difficulty)}`}>
                                                {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                                              </span>
                                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                {exercise.questions} questions
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <button
                                          className="inline-flex items-center justify-center p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-sm"
                                          aria-label="Start exercise"
                                        >
                                          <Play className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                                
                                <div className="mt-4 flex items-center justify-center">
                                  <button className="inline-flex items-center justify-center text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                                    <BarChart3 className="w-4 h-4 mr-1" />
                                    View Detailed Progress
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-center mt-8">
        <div className="glass-panel px-6 py-4 rounded-lg inline-flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-3" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Pro Tip:</span> Focus on topics where your test score was below 70% for maximum improvement.
          </p>
        </div>
      </div>
    </div>
  );
};
