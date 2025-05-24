
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
  Award,
  Calendar,
  Gift,
  Coins,
  Users,
  ChevronRight,
  Zap,
  Crown,
  Medal,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LearningPath } from "@/types";
import { useSearchParams } from "react-router-dom";

const ELearning = () => {
  const [searchParams] = useSearchParams();
  const selectedConcept = searchParams.get("concept") || undefined;
  
  const [activeStrand, setActiveStrand] = useState<string>("Number");
  const [completedExercises, setCompletedExercises] = useState<string[]>([
    "ex-1", "ex-2", "ex-4", "ex-5", "ex-8", "ex-9", "ex-11", "ex-12", "ex-18", "ex-19", "ex-21", "ex-24", "ex-27", "ex-30", "ex-33"
  ]);

  // Mock data for learning paths
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

  const currentLevel = Math.floor(overallProgress / 25) + 1;
  const coinsEarned = completedExercises.length * 10;

  const todaysSchedule = [
    { time: "12:45", activity: "Vocabulary Test", type: "test", color: "bg-blue-500" },
    { time: "2:30", activity: "Speaking Session", type: "session", color: "bg-green-500" },
    { time: "4:50", activity: "Learning Games", type: "game", color: "bg-pink-500" }
  ];

  const levels = [
    { level: 1, name: "Beginner", color: "from-purple-400 to-purple-600", icon: "🛡️", unlocked: currentLevel >= 1 },
    { level: 2, name: "Explorer", color: "from-orange-400 to-red-600", icon: "⚔️", unlocked: currentLevel >= 2 },
    { level: 3, name: "Master", color: "from-pink-400 to-purple-600", icon: "👑", unlocked: currentLevel >= 3 },
    { level: 4, name: "Champion", color: "from-yellow-400 to-orange-500", icon: "🏆", unlocked: currentLevel >= 4 }
  ];

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
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header with Greeting */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 text-white">
          <div className="relative z-10">
            <p className="text-sm opacity-90 mb-2">GOOD MORNING, STUDENT</p>
            <h1 className="text-4xl font-bold mb-4">
              Start <span className="text-yellow-300">Learning</span>
            </h1>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">{coinsEarned} Coins Earned</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Star className="w-8 h-8 text-yellow-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Monthly Progress */}
              <Card className="p-6 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 border-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">Be up to date</p>
                    <h3 className="text-lg font-bold text-pink-900 dark:text-pink-100">Monthly Progress</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">+{overallProgress}%</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {['Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, i) => (
                    <div key={month} className="flex items-center justify-between text-xs">
                      <span className="text-pink-700 dark:text-pink-300">{month}</span>
                      <div className="w-16 h-1 bg-pink-300 dark:bg-pink-700 rounded">
                        <div 
                          className="h-1 bg-pink-600 dark:bg-pink-400 rounded"
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button size="sm" className="mt-4 bg-white text-pink-600 hover:bg-pink-50 w-8 h-8 rounded-full p-0">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>

              {/* Rewards */}
              <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-indigo-200 text-sm">See achievements</p>
                    <h3 className="text-lg font-bold">Your Rewards</h3>
                  </div>
                  <div className="relative">
                    <Trophy className="w-12 h-12 text-yellow-300" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full flex items-center justify-center">
                      <Star className="w-2 h-2 text-indigo-600" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 3 ? 'text-yellow-300 fill-current' : 'text-indigo-300'}`} />
                  ))}
                </div>
              </Card>
            </div>

            {/* Level Progress */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                Your Learning Journey
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {levels.map((levelData) => (
                  <motion.div
                    key={levelData.level}
                    className={`relative p-4 rounded-xl text-center ${
                      levelData.unlocked 
                        ? `bg-gradient-to-br ${levelData.color} text-white shadow-lg` 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}
                    whileHover={levelData.unlocked ? { scale: 1.05 } : {}}
                    whileTap={levelData.unlocked ? { scale: 0.95 } : {}}
                  >
                    <div className="text-3xl mb-2">{levelData.icon}</div>
                    <p className="font-bold text-sm">Level {levelData.level}</p>
                    <p className="text-xs opacity-90">{levelData.name}</p>
                    {levelData.unlocked && (
                      <Button size="sm" className="mt-2 bg-white/20 hover:bg-white/30 text-white text-xs">
                        Continue
                      </Button>
                    )}
                    {!levelData.unlocked && (
                      <div className="absolute inset-0 bg-gray-900/50 rounded-xl flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-gray-400 rounded border-dashed" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Challenge Game */}
            <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm mb-1">Challenge friends</p>
                  <h3 className="text-xl font-bold mb-2">Start Game</h3>
                  <Button className="bg-white text-orange-500 hover:bg-orange-50">
                    <Rocket className="w-4 h-4 mr-2" />
                    Launch Challenge
                  </Button>
                </div>
                <div className="text-6xl opacity-50">🚀</div>
              </div>
            </Card>

            {/* Learning Topics */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Continue Learning</h3>
              
              {/* Strand Navigation */}
              <div className="flex flex-wrap gap-2 mb-6">
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

              {/* Topics */}
              <AnimatePresence mode="wait">
                {currentStrand && (
                  <motion.div
                    key={activeStrand}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {currentStrand.topics.map((topic) => (
                      <div key={topic.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <BookOpen className="w-5 h-5 text-purple-600 mr-3" />
                            <div>
                              <h4 className="font-medium">{topic.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-purple-600">{topic.progress}%</div>
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-purple-600"
                                style={{ width: `${topic.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          {topic.exercises.slice(0, 2).map((exercise) => {
                            const isCompleted = completedExercises.includes(exercise.id);
                            return (
                              <div
                                key={exercise.id}
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                  isCompleted 
                                    ? "bg-green-50 border-green-200 dark:bg-green-900/20" 
                                    : "bg-gray-50 dark:bg-gray-800"
                                }`}
                              >
                                <div className="flex items-center">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                  )}
                                  <span className="text-sm font-medium">{exercise.title}</span>
                                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                                    {exercise.difficulty}
                                  </span>
                                </div>
                                <Button size="sm" variant={isCompleted ? "outline" : "default"}>
                                  {isCompleted ? "Review" : "Start"}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Right Column - Schedule & Activity */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Today's Schedule</h3>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-4">13 May</p>
              
              <div className="space-y-3">
                {todaysSchedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-sm font-medium text-gray-500 w-12">{item.time}</div>
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <div className="flex-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm font-medium">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm">Completed Today</span>
                  </div>
                  <span className="font-bold">5</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mr-3">
                      <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="text-sm">Streak Days</span>
                  </div>
                  <span className="font-bold">12</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                      <Trophy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm">Current Level</span>
                  </div>
                  <span className="font-bold">{currentLevel}</span>
                </div>
              </div>
            </Card>

            {/* Challenge Invitations */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Challenge Invitations
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Sarah Chen", avatar: "👩", time: "2 min ago" },
                  { name: "Mike Johnson", avatar: "👨", time: "5 min ago" }
                ].map((invite, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                        {invite.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{invite.name}</p>
                        <p className="text-xs text-gray-500">{invite.time}</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      Accept
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ELearning;
