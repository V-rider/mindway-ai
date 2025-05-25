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
  ArrowRight,
  Timer,
  Brain,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, ComposedChart } from "recharts";
import { LearningPath } from "@/types";
import { useSearchParams, useNavigate } from "react-router-dom";

const ELearning = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
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

  // Monthly progress data for chart
  const monthlyProgressData = [
    { month: 'Apr', progress: 45, exercises: 23 },
    { month: 'May', progress: 62, exercises: 31 },
    { month: 'Jun', progress: 58, exercises: 29 },
    { month: 'Jul', progress: 71, exercises: 36 },
    { month: 'Aug', progress: overallProgress, exercises: completedExercises.length }
  ];

  const levels = [
    { level: 1, name: "Number Operations", color: "from-blue-400 to-blue-600", icon: "🔢", unlocked: currentLevel >= 1 },
    { level: 3, name: "Fractions", color: "from-orange-400 to-orange-600", icon: "½", unlocked: currentLevel >= 3 },
    { level: 2, name: "Decimals", color: "from-cyan-400 to-cyan-600", icon: "🔸", unlocked: currentLevel >= 2 },
    { level: 4, name: "Measures Strand", color: "from-green-400 to-green-600", icon: "📏", unlocked: currentLevel >= 4 },
    { level: 1, name: "Length & Weight", color: "from-emerald-400 to-emerald-600", icon: "⚖️", unlocked: currentLevel >= 1 },
    { level: 3, name: "Area & Perimeter", color: "from-teal-400 to-teal-600", icon: "📐", unlocked: currentLevel >= 3 },
    { level: 2, name: "Shape and Space", color: "from-purple-400 to-purple-600", icon: "🔺", unlocked: currentLevel >= 2 },
    { level: 4, name: "2D & 3D Shapes", color: "from-violet-400 to-violet-600", icon: "🎲", unlocked: currentLevel >= 4 },
    { level: 1, name: "Angles", color: "from-indigo-400 to-indigo-600", icon: "📐", unlocked: currentLevel >= 1 },
    { level: 3, name: "Data Handling", color: "from-yellow-400 to-orange-500", icon: "📊", unlocked: currentLevel >= 3 },
    { level: 2, name: "Statistics", color: "from-pink-400 to-pink-600", icon: "📈", unlocked: currentLevel >= 2 },
    { level: 4, name: "Algebra", color: "from-red-400 to-red-600", icon: "🧮", unlocked: currentLevel >= 4 }
  ];

  const chartConfig = {
    progress: {
      label: "Progress",
      color: "hsl(var(--primary))",
    },
    exercises: {
      label: "Exercises",
      color: "hsl(var(--muted-foreground))",
    },
  };

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

  const handleAcceptChallenge = (challengerName: string) => {
    navigate(`/math-challenge?challenger=${encodeURIComponent(challengerName)}`);
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header with Greeting */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-blue-500 p-8 text-white">
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
              {/* Monthly Progress Chart */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-0">
                <div className="mb-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Track your journey</p>
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">Monthly Progress</h3>
                </div>
                <div className="h-40">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={monthlyProgressData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="progress" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                          fillOpacity={0.8}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="progress" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <Button size="sm" className="mt-4 bg-white text-blue-600 hover:bg-blue-50 w-8 h-8 rounded-full p-0">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>

              {/* Rewards - Make it clickable */}
              <Card 
                className="p-6 bg-gradient-to-br from-primary to-purple-600 text-white border-0 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/achievements')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-primary-foreground/80 text-sm">See achievements</p>
                    <h3 className="text-lg font-bold">Your Rewards</h3>
                  </div>
                  <div className="relative">
                    <Trophy className="w-12 h-12 text-yellow-300" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full flex items-center justify-center">
                      <Star className="w-2 h-2 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 3 ? 'text-yellow-300 fill-current' : 'text-primary-foreground/50'}`} />
                  ))}
                </div>
              </Card>
            </div>

            {/* Level Progress */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Crown className="w-6 h-6 text-primary mr-2" />
                Your Learning Journey
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {levels.map((levelData, index) => (
                  <motion.div
                    key={index}
                    className={`relative p-3 rounded-xl text-center ${
                      levelData.unlocked 
                        ? `bg-gradient-to-br ${levelData.color} text-white shadow-lg` 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}
                    whileHover={levelData.unlocked ? { scale: 1.05 } : {}}
                    whileTap={levelData.unlocked ? { scale: 0.95 } : {}}
                  >
                    <div className="text-2xl mb-1">{levelData.icon}</div>
                    <p className="font-bold text-xs">Level {levelData.level}</p>
                    <p className="text-xs opacity-90 leading-tight">{levelData.name}</p>
                    {levelData.unlocked && (
                      <Button size="sm" className="mt-2 bg-white/20 hover:bg-white/30 text-white text-xs h-6 px-2">
                        Start
                      </Button>
                    )}
                    {!levelData.unlocked && (
                      <div className="absolute inset-0 bg-gray-900/50 rounded-xl flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-gray-400 rounded border-dashed" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>

            
            {/* Challenge Game */}
            <Card className="p-6 bg-gradient-to-br from-green-400 to-blue-500 text-white border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Challenge friends</p>
                  <h3 className="text-xl font-bold mb-2">Start Game</h3>
                  <Button className="bg-white text-green-600 hover:bg-green-50">
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
                        ? "bg-primary hover:bg-primary/90" 
                        : "hover:bg-primary/10"
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
                            <BookOpen className="w-5 h-5 text-primary mr-3" />
                            <div>
                              <h4 className="font-medium">{topic.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-primary">{topic.progress}%</div>
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-primary"
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

          
          {/* Right Column - Enhanced Stats & Activity */}
          <div className="space-y-6">
            {/* Enhanced Quick Stats */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Learning Analytics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">Completed Today</span>
                      <p className="text-xs text-gray-500">+2 from yesterday</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-600">5</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mr-3">
                      <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">Streak Days</span>
                      <p className="text-xs text-gray-500">Keep it up!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-yellow-600">12</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                      <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">Online Time</span>
                      <p className="text-xs text-gray-500">This week</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">2h 45m</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                      <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">Exercise Time</span>
                      <p className="text-xs text-gray-500">Average per day</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-purple-600">35 min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3">
                      <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">Accuracy Rate</span>
                      <p className="text-xs text-gray-500">Last 10 exercises</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-orange-600">87%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Challenge Invitations */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Challenge Invitations
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Sarah Chen", avatar: "👩", time: "2 min ago", subject: "Math Quiz" },
                  { name: "Mike Johnson", avatar: "👨", time: "5 min ago", subject: "Vocabulary" }
                ].map((invite, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mr-3">
                        {invite.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{invite.name}</p>
                        <p className="text-xs text-gray-500">{invite.subject} • {invite.time}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => handleAcceptChallenge(invite.name)}
                    >
                      Accept
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Study Goals */}
            <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <h3 className="font-bold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Weekly Goals
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Complete 15 exercises</span>
                    <span className="text-primary font-medium">12/15</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Study 5 hours</span>
                    <span className="text-primary font-medium">3.2/5h</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ELearning;
