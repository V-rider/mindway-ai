
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Timer, 
  Trophy, 
  Zap, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Target,
  Crown,
  Star,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const MathChallenge = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const challengerName = searchParams.get("challenger") || "Sarah Chen";
  
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is 24 + 37?",
      options: ["59", "61", "63", "65"],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "If a rectangle has length 8cm and width 5cm, what is its area?",
      options: ["40 cm²", "35 cm²", "45 cm²", "30 cm²"],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "What is 3/4 + 1/8?",
      options: ["4/12", "7/8", "5/6", "11/12"],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "If 5x = 35, what is x?",
      options: ["6", "7", "8", "9"],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "What is 15% of 80?",
      options: ["10", "12", "15", "18"],
      correctAnswer: 1
    }
  ];

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      finishChallenge();
    }
  }, [timeLeft, gameStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswered) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = selectedAnswer;
      setUserAnswers(newAnswers);
      
      setIsAnswered(false);
      setSelectedAnswer(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        finishChallenge();
      }
    }
  };

  const finishChallenge = () => {
    setShowResult(true);
  };

  const calculateScore = () => {
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === questions[index]?.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const startChallenge = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-100">
          <Card className="p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Math Challenge</h1>
              <p className="text-gray-600">Challenge with {challengerName}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium">Time Limit</span>
                </div>
                <span className="text-blue-600 font-bold">5:00</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium">Questions</span>
                </div>
                <span className="text-green-600 font-bold">{questions.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium">Challenger</span>
                </div>
                <span className="text-purple-600 font-bold">{challengerName}</span>
              </div>
            </div>
            
            <Button onClick={startChallenge} className="w-full bg-primary hover:bg-primary/90">
              <Zap className="w-4 h-4 mr-2" />
              Start Challenge
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (showResult) {
    const score = calculateScore();
    const isWinner = score >= Math.ceil(questions.length / 2);
    
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-100">
          <Card className="p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isWinner ? 'bg-yellow-400' : 'bg-gray-400'
              }`}>
                {isWinner ? (
                  <Crown className="w-10 h-10 text-white" />
                ) : (
                  <Trophy className="w-10 h-10 text-white" />
                )}
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {isWinner ? 'Congratulations!' : 'Good Try!'}
              </h1>
              <p className="text-gray-600">Challenge completed</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {score}/{questions.length}
                </div>
                <p className="text-gray-600">Correct Answers</p>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Time Used</span>
                <span className="text-blue-600 font-bold">{formatTime(300 - timeLeft)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Accuracy</span>
                <span className="text-green-600 font-bold">{Math.round((score / questions.length) * 100)}%</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/e-learning')}
                className="flex-1"
              >
                Back to Learning
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Play Again
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-purple-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/e-learning')}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Exit
              </Button>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">vs {challengerName}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                timeLeft <= 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <Timer className="w-4 h-4" />
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 mb-6">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {currentQ.question}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQ.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                          selectedAnswer === index
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-300'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Next Button */}
          <div className="text-center">
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="px-8 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Challenge' : 'Next Question'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MathChallenge;
