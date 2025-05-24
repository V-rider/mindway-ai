
import React, { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Clock, 
  Trophy,
  Target,
  BarChart3,
  Rocket,
  Star,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningPath } from "@/types";
import { useSearchParams } from "react-router-dom";

const ELearning = () => {
  const [searchParams] = useSearchParams();
  const selectedConcept = searchParams.get("concept") || undefined;
  
  const [activeStrand, setActiveStrand] = useState<string>("Number");
  const [completedExercises, setCompletedExercises] = useState<string[]>([
    "ex-1", "ex-2", "ex-4", "ex-5", "ex-8", "ex-9", "ex-11", "ex-12", "ex-18", "ex-19", "ex-21", "ex-24", "ex-27", "ex-30", "ex-33"
  ]);

  // Mock data for learning paths (same as before but organized for E-Learning)
  const learningPaths: LearningPath[] = [
    {
      strand: "Number",
      topics: [
        {
          id: "number-operations",
          name: "Number Operations",
          description: "Master arithmetic operations with whole numbers.",
          objectives: [
            "Recognize and use the commutative and associative properties",
            "Perform four arithmetic operations of whole numbers",
            "Use numbers to formulate and solve simple problems"
          ],
          progress: 85,
          exercises: [
            { id: "ex-1", title: "Basic Operations Practice", difficulty: "easy", questions: 10, completed: true },
            { id: "ex-2", title: "Word Problems with Operations", difficulty: "medium", questions: 8, completed: true },
            { id: "ex-3", title: "Mixed Operations Challenge", difficulty: "hard", questions: 5, completed: false }
          ]
        },
        {
          id: "fractions",
          name: "Fractions",
          description: "Understanding and working with fractions.",
          objectives: [
            "Recognize the concepts of fractions",
            "Compare and order fractions",
            "Perform operations with fractions"
          ],
          progress: 62,
          exercises: [
            { id: "ex-4", title: "Introduction to Fractions", difficulty: "easy", questions: 8, completed: true },
            { id: "ex-5", title: "Comparing Fractions", difficulty: "medium", questions: 6, completed: true },
            { id: "ex-6", title: "Fraction Operations", difficulty: "medium", questions: 10, completed: false },
            { id: "ex-7", title: "Word Problems with Fractions", difficulty: "hard", questions: 5, completed: false }
          ]
        },
        {
          id: "decimals",
          name: "Decimals",
          description: "Understanding and working with decimal numbers.",
          objectives: [
            "Recognize the concepts of decimals",
            "Compare and order decimals",
            "Perform operations with decimals"
          ],
          progress: 75,
          exercises: [
            { id: "ex-8", title: "Introduction to Decimals", difficulty: "easy", questions: 8, completed: true },
            { id: "ex-9", title: "Decimal Operations", difficulty: "medium", questions: 12, completed: true },
            { id: "ex-10", title: "Word Problems with Decimals", difficulty: "hard", questions: 6, completed: false }
          ]
        }
      ]
    },
    {
      strand: "Measures",
      topics: [
        {
          id: "length-weight-capacity",
          name: "Length, Weight and Capacity",
          description: "Learn about measurement units and how to use them.",
          objectives: [
            "Recognize the concepts of length, distance, weight and capacity",
            "Use different ways to compare measurements",
            "Choose and use appropriate measuring tools"
          ],
          progress: 80,
          exercises: [
            { id: "ex-11", title: "Units of Measurement", difficulty: "easy", questions: 10, completed: true },
            { id: "ex-12", title: "Converting Between Units", difficulty: "medium", questions: 8, completed: true },
            { id: "ex-13", title: "Measurement Word Problems", difficulty: "hard", questions: 5, completed: false }
          ]
        },
        {
          id: "area-perimeter",
          name: "Area and Perimeter",
          description: "Learn to calculate the area and perimeter of shapes.",
          objectives: [
            "Recognize the concepts of perimeter and area",
            "Use formulas to calculate perimeter and area",
            "Solve real-world measurement problems"
          ],
          progress: 70,
          exercises: [
            { id: "ex-14", title: "Perimeter Basics", difficulty: "easy", questions: 8, completed: true },
            { id: "ex-15", title: "Area of Rectangles", difficulty: "easy", questions: 6, completed: true },
            { id: "ex-16", title: "Area of Complex Shapes", difficulty: "medium", questions: 8, completed: false }
          ]
        }
      ]
    },
    {
      strand: "Shape and Space",
      topics: [
        {
          id: "2d-3d-shapes",
          name: "2D and 3D Shapes",
          description: "Learn about different shapes and their properties.",
          objectives: [
            "Identify and describe 2-D and 3-D shapes",
            "Recognize the properties of shapes",
            "Make 2-D shapes and appreciate geometric beauty"
          ],
          progress: 75,
          exercises: [
            { id: "ex-18", title: "Identifying Shapes", difficulty: "easy", questions: 10, completed: true },
            { id: "ex-19", title: "Properties of 2D Shapes", difficulty: "medium", questions: 8, completed: true },
            { id: "ex-20", title: "Properties of 3D Shapes", difficulty: "medium", questions: 6, completed: false }
          ]
        }
      ]
    }
  ];

  const currentStrand = learningPaths.find(path => path.strand === activeStrand);
  
  const overallProgress = useMemo(() => {
    const totalExercises = learningPaths.reduce((total, path) => 
      total + path.topics.reduce((topicTotal, topic) => topicTotal + topic.exercises.length, 0), 0);
    const completedCount = completedExercises.length;
    return Math.round((completedCount / totalExercises) * 100);
  }, [learningPaths, completedExercises]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "hard": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleStartExercise = (exerciseId: string) => {
    console.log(`Starting exercise: ${exerciseId}`);
    // Here you would implement the exercise start logic
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            E-Learning Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive learning experiences tailored to your progress
          </p>
        </div>

        {/* Progress Overview */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Your Learning Progress</h2>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-yellow-600 dark:text-yellow-400">{overallProgress}% Complete</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
            <motion.div 
              className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedExercises.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Exercises Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{learningPaths.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Learning Strands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {learningPaths.reduce((total, path) => total + path.topics.length, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Topics Available</div>
            </div>
          </div>
        </div>

        {/* Strand Navigation */}
        <div className="flex flex-wrap gap-2 justify-center">
          {learningPaths.map((path) => (
            <Button
              key={path.strand}
              variant={activeStrand === path.strand ? "default" : "outline"}
              onClick={() => setActiveStrand(path.strand)}
              className={`${
                activeStrand === path.strand 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
              }`}
            >
              {path.strand}
            </Button>
          ))}
        </div>

        {/* Current Strand Content */}
        <AnimatePresence mode="wait">
          {currentStrand && (
            <motion.div
              key={activeStrand}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {currentStrand.strand} Strand
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Master the fundamentals of {currentStrand.strand.toLowerCase()} concepts
                </p>
              </div>

              {/* Topics */}
              <div className="grid gap-6">
                {currentStrand.topics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    className="glass-card rounded-xl p-6"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                            {topic.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {topic.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {topic.progress}%
                        </div>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-purple-600"
                            style={{ width: `${topic.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Learning Objectives */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Learning Objectives:
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {topic.objectives.map((objective, i) => (
                          <li key={i} className="flex items-start">
                            <Target className="w-3 h-3 text-purple-500 mt-1 mr-2 flex-shrink-0" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exercises */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Practice Exercises:
                      </h4>
                      <div className="grid gap-3">
                        {topic.exercises.map((exercise) => {
                          const isCompleted = completedExercises.includes(exercise.id);
                          return (
                            <div
                              key={exercise.id}
                              className={`border rounded-lg p-3 transition-all ${
                                isCompleted 
                                  ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" 
                                  : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                                  ) : (
                                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                                  )}
                                  <div>
                                    <h5 className="font-medium text-gray-800 dark:text-gray-100">
                                      {exercise.title}
                                    </h5>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                                        {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                                      </span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {exercise.questions} questions
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <Button
                                  size="sm"
                                  variant={isCompleted ? "outline" : "default"}
                                  onClick={() => handleStartExercise(exercise.id)}
                                  className={isCompleted ? "text-green-600 border-green-600 hover:bg-green-50" : ""}
                                >
                                  {isCompleted ? (
                                    <>
                                      <Award className="w-4 h-4 mr-1" />
                                      Review
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4 mr-1" />
                                      Start
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Continue Learning
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-3"
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            View Progress Report
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ELearning;
