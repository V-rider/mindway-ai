
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Star, 
  Award, 
  Crown, 
  Medal, 
  Target,
  Zap,
  Clock,
  BookOpen,
  Brain,
  TrendingUp,
  Users,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  requirement: string;
  color: string;
}

const Achievements = () => {
  const navigate = useNavigate();

  const achievements: Achievement[] = [
    {
      id: "daily-double",
      name: "Daily Double",
      description: "Complete 2 exercises in one day",
      icon: <Trophy className="w-8 h-8" />,
      category: "Daily",
      earned: true,
      earnedDate: "2024-05-20",
      requirement: "2 exercises in 1 day",
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600"
    },
    {
      id: "speedy-solver",
      name: "Speedy Solver",
      description: "Complete an exercise in under 3 minutes",
      icon: <Zap className="w-8 h-8" />,
      category: "Speed",
      earned: true,
      earnedDate: "2024-05-18",
      requirement: "Complete exercise < 3 min",
      color: "bg-gradient-to-br from-orange-400 to-red-500"
    },
    {
      id: "book-wizard",
      name: "Book Wizard",
      description: "Master your first learning topic",
      icon: <BookOpen className="w-8 h-8" />,
      category: "Learning",
      earned: true,
      earnedDate: "2024-05-15",
      requirement: "Complete 1 topic",
      color: "bg-gradient-to-br from-purple-400 to-purple-600"
    },
    {
      id: "librarian",
      name: "Librarian",
      description: "Complete 50 exercises",
      icon: <Star className="w-8 h-8" />,
      category: "Progress",
      earned: true,
      earnedDate: "2024-05-22",
      requirement: "50 exercises completed",
      color: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    {
      id: "gold-circle",
      name: "Gold Circle",
      description: "Achieve 90% accuracy rate",
      icon: <Target className="w-8 h-8" />,
      category: "Accuracy",
      earned: true,
      earnedDate: "2024-05-10",
      requirement: "90% accuracy rate",
      color: "bg-gradient-to-br from-yellow-300 to-yellow-500"
    },
    {
      id: "daily-reader",
      name: "Daily Reader",
      description: "Study for 7 consecutive days",
      icon: <Clock className="w-8 h-8" />,
      category: "Streak",
      earned: true,
      earnedDate: "2024-05-23",
      requirement: "7-day streak",
      color: "bg-gradient-to-br from-green-400 to-green-600"
    },
    {
      id: "perfectionist",
      name: "Perfectionist",
      description: "Get 100% on 5 exercises",
      icon: <Crown className="w-8 h-8" />,
      category: "Perfect",
      earned: false,
      progress: 3,
      requirement: "100% on 5 exercises",
      color: "bg-gray-300"
    },
    {
      id: "marathon-runner",
      name: "Marathon Runner",
      description: "Study for 2 hours in one session",
      icon: <TrendingUp className="w-8 h-8" />,
      category: "Endurance",
      earned: false,
      requirement: "2-hour study session",
      color: "bg-gray-300"
    },
    {
      id: "social-butterfly",
      name: "Social Butterfly",
      description: "Win 10 challenges against friends",
      icon: <Users className="w-8 h-8" />,
      category: "Social",
      earned: false,
      progress: 2,
      requirement: "Win 10 challenges",
      color: "bg-gray-300"
    },
    {
      id: "genius",
      name: "Genius",
      description: "Complete all topics in Number strand",
      icon: <Brain className="w-8 h-8" />,
      category: "Mastery",
      earned: false,
      requirement: "Complete Number strand",
      color: "bg-gray-300"
    },
    {
      id: "champion",
      name: "Champion",
      description: "Reach Level 4",
      icon: <Medal className="w-8 h-8" />,
      category: "Level",
      earned: false,
      requirement: "Reach Level 4",
      color: "bg-gray-300"
    },
    {
      id: "scholar",
      name: "Scholar",
      description: "Complete 100 exercises",
      icon: <Award className="w-8 h-8" />,
      category: "Progress",
      earned: false,
      progress: 15,
      requirement: "100 exercises completed",
      color: "bg-gray-300"
    }
  ];

  const categories = ["All", "Daily", "Speed", "Learning", "Progress", "Accuracy", "Streak", "Perfect", "Endurance", "Social", "Mastery", "Level"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredAchievements = selectedCategory === "All" 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/e-learning')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Learning
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Achievements</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {earnedCount} of {totalCount} achievements unlocked
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">{Math.round((earnedCount / totalCount) * 100)}%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Complete</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="h-3 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(earnedCount / totalCount) * 100}%` }}
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`p-6 text-center relative overflow-hidden ${
                achievement.earned ? 'border-primary/50 shadow-lg' : 'border-gray-200 dark:border-gray-700'
              }`}>
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white ${
                  achievement.earned ? achievement.color : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {achievement.earned ? (
                    achievement.icon
                  ) : (
                    <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">?</div>
                  )}
                </div>
                
                <h3 className={`font-bold mb-2 ${
                  achievement.earned ? 'text-foreground' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {achievement.earned ? achievement.name : "???"}
                </h3>
                
                <p className={`text-sm mb-3 ${
                  achievement.earned ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {achievement.earned ? achievement.description : "Complete more exercises to unlock"}
                </p>
                
                <Badge 
                  variant={achievement.earned ? "default" : "secondary"}
                  className="text-xs"
                >
                  {achievement.category}
                </Badge>
                
                {achievement.earned && achievement.earnedDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Earned {achievement.earnedDate}
                  </p>
                )}
                
                {!achievement.earned && achievement.progress && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Progress: {achievement.progress}/
                      {achievement.requirement.match(/\d+/)?.[0] || "?"}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(achievement.progress! / parseInt(achievement.requirement.match(/\d+/)?.[0] || "1")) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {achievement.earned && (
                  <div className="absolute top-2 right-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Achievements;
