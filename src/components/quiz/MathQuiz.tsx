
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Target, ArrowRight, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  answer: number;
  options?: number[];
  explanation: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizResult {
  questionId: number;
  userAnswer: number | null;
  isCorrect: boolean;
  timeSpent: number;
}

interface MathQuizProps {
  topic: string;
  level: number;
  onClose: () => void;
  onComplete: (score: number, timeSpent: number) => void;
}

const MathQuiz: React.FC<MathQuizProps> = ({ topic, level, onClose, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const { toast } = useToast();

  const generateQuestions = (topic: string, level: number): Question[] => {
    const questionCount = 5;
    const questions: Question[] = [];

    for (let i = 0; i < questionCount; i++) {
      let question: Question;
      
      switch (topic.toLowerCase()) {
        case 'number operations':
          question = generateNumberOperationsQuestion(i + 1, level);
          break;
        case 'fractions':
          question = generateFractionsQuestion(i + 1, level);
          break;
        case 'decimals':
          question = generateDecimalsQuestion(i + 1, level);
          break;
        case 'measures strand':
        case 'length & weight':
          question = generateMeasuresQuestion(i + 1, level);
          break;
        default:
          question = generateNumberOperationsQuestion(i + 1, level);
      }
      
      questions.push(question);
    }
    
    return questions;
  };

  const generateNumberOperationsQuestion = (id: number, level: number): Question => {
    const operations = ['+', '-', '×', '÷'];
    const maxNum = level === 1 ? 20 : level === 2 ? 50 : level === 3 ? 100 : 200;
    
    const a = Math.floor(Math.random() * maxNum) + 1;
    const b = Math.floor(Math.random() * maxNum) + 1;
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let question: string;
    let answer: number;
    let explanation: string[];
    
    switch (operation) {
      case '+':
        question = `${a} + ${b} = ?`;
        answer = a + b;
        explanation = [
          `Step 1: Add ${a} + ${b}`,
          `Step 2: ${a} + ${b} = ${answer}`
        ];
        break;
      case '-':
        const larger = Math.max(a, b);
        const smaller = Math.min(a, b);
        question = `${larger} - ${smaller} = ?`;
        answer = larger - smaller;
        explanation = [
          `Step 1: Subtract ${smaller} from ${larger}`,
          `Step 2: ${larger} - ${smaller} = ${answer}`
        ];
        break;
      case '×':
        const factor1 = Math.floor(Math.random() * 12) + 1;
        const factor2 = Math.floor(Math.random() * 12) + 1;
        question = `${factor1} × ${factor2} = ?`;
        answer = factor1 * factor2;
        explanation = [
          `Step 1: Multiply ${factor1} × ${factor2}`,
          `Step 2: ${factor1} × ${factor2} = ${answer}`
        ];
        break;
      case '÷':
        const divisor = Math.floor(Math.random() * 10) + 2;
        const quotient = Math.floor(Math.random() * 15) + 1;
        const dividend = divisor * quotient;
        question = `${dividend} ÷ ${divisor} = ?`;
        answer = quotient;
        explanation = [
          `Step 1: Divide ${dividend} by ${divisor}`,
          `Step 2: ${dividend} ÷ ${divisor} = ${answer}`
        ];
        break;
      default:
        question = `${a} + ${b} = ?`;
        answer = a + b;
        explanation = [`${a} + ${b} = ${answer}`];
    }
    
    return {
      id,
      question,
      answer,
      explanation,
      difficulty: level <= 2 ? 'easy' : level === 3 ? 'medium' : 'hard'
    };
  };

  const generateFractionsQuestion = (id: number, level: number): Question => {
    if (level === 1) {
      const numerator = Math.floor(Math.random() * 5) + 1;
      const denominator = Math.floor(Math.random() * 8) + 2;
      return {
        id,
        question: `What is ${numerator}/${denominator} as a decimal? (Round to 2 decimal places)`,
        answer: Math.round((numerator / denominator) * 100) / 100,
        explanation: [
          `Step 1: Divide ${numerator} by ${denominator}`,
          `Step 2: ${numerator} ÷ ${denominator} = ${(numerator / denominator).toFixed(2)}`
        ],
        difficulty: 'easy'
      };
    } else {
      const num1 = Math.floor(Math.random() * 5) + 1;
      const den1 = Math.floor(Math.random() * 8) + 2;
      const num2 = Math.floor(Math.random() * 5) + 1;
      const den2 = den1; // Same denominator for simplicity
      const result = num1 + num2;
      
      return {
        id,
        question: `${num1}/${den1} + ${num2}/${den2} = ?/${den1} (Enter the numerator)`,
        answer: result,
        explanation: [
          `Step 1: Since denominators are the same, add numerators`,
          `Step 2: ${num1} + ${num2} = ${result}`,
          `Step 3: Result is ${result}/${den1}`
        ],
        difficulty: level === 2 ? 'medium' : 'hard'
      };
    }
  };

  const generateDecimalsQuestion = (id: number, level: number): Question => {
    const decimal1 = (Math.random() * 10).toFixed(1);
    const decimal2 = (Math.random() * 10).toFixed(1);
    const answer = parseFloat((parseFloat(decimal1) + parseFloat(decimal2)).toFixed(1));
    
    return {
      id,
      question: `${decimal1} + ${decimal2} = ?`,
      answer,
      explanation: [
        `Step 1: Line up the decimal points`,
        `Step 2: Add: ${decimal1} + ${decimal2}`,
        `Step 3: Result is ${answer}`
      ],
      difficulty: level <= 2 ? 'easy' : 'medium'
    };
  };

  const generateMeasuresQuestion = (id: number, level: number): Question => {
    const measurements = ['cm', 'm', 'kg', 'g', 'ml', 'l'];
    const values = [100, 1000, 500, 2000, 750, 1500];
    const randomIndex = Math.floor(Math.random() * values.length);
    const value = values[randomIndex];
    const unit = measurements[randomIndex];
    
    if (unit === 'cm') {
      return {
        id,
        question: `Convert ${value} cm to meters. (Answer in decimal form)`,
        answer: value / 100,
        explanation: [
          `Step 1: Remember that 100 cm = 1 m`,
          `Step 2: Divide ${value} by 100`,
          `Step 3: ${value} ÷ 100 = ${value / 100} m`
        ],
        difficulty: level <= 2 ? 'easy' : 'medium'
      };
    } else {
      return {
        id,
        question: `A ruler is ${value / 10} cm long. How many mm is this?`,
        answer: (value / 10) * 10,
        explanation: [
          `Step 1: Remember that 1 cm = 10 mm`,
          `Step 2: Multiply ${value / 10} by 10`,
          `Step 3: ${value / 10} × 10 = ${value} mm`
        ],
        difficulty: level <= 2 ? 'easy' : 'medium'
      };
    }
  };

  useEffect(() => {
    const generatedQuestions = generateQuestions(topic, level);
    setQuestions(generatedQuestions);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  }, [topic, level]);

  const handleSubmitAnswer = () => {
    if (userAnswer.trim() === '') {
      toast({
        title: "Please enter an answer",
        variant: "destructive"
      });
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const numericAnswer = parseFloat(userAnswer);
    const isCorrect = Math.abs(numericAnswer - currentQuestion.answer) < 0.01;
    const timeSpent = Date.now() - questionStartTime;

    const result: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer: numericAnswer,
      isCorrect,
      timeSpent
    };

    setResults(prev => [...prev, result]);
    setShowResult(true);
    setShowExplanation(!isCorrect);

    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Well done!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Check the explanation below",
        variant: "destructive"
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setShowResult(false);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const totalTime = Date.now() - startTime;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    setIsQuizComplete(true);
    onComplete(score, totalTime);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setShowExplanation(false);
    setResults([]);
    setIsQuizComplete(false);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    const generatedQuestions = generateQuestions(topic, level);
    setQuestions(generatedQuestions);
  };

  if (questions.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading questions...</div>
      </Card>
    );
  }

  if (isQuizComplete) {
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const score = Math.round((correctAnswers / questions.length) * 100);

    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold">Quiz Complete!</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{score}%</div>
              <div className="text-sm text-green-700">Score</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{correctAnswers}/{questions.length}</div>
              <div className="text-sm text-blue-700">Correct</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{totalTime}s</div>
              <div className="text-sm text-purple-700">Time</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={restartQuiz} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{topic}</h2>
            <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Exit
          </Button>
        </div>

        {/* Progress */}
        <Progress value={progress} className="h-2" />

        {/* Question */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Question {currentQuestion.id}</h3>
            <p className="text-xl">{currentQuestion.question}</p>
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Answer:</label>
              <Input
                type="number"
                step="0.01"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
                disabled={showResult}
                className="text-lg"
              />
            </div>

            {!showResult && (
              <Button onClick={handleSubmitAnswer} className="w-full">
                Submit Answer
              </Button>
            )}
          </div>

          {/* Result */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                results[results.length - 1]?.isCorrect 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
              }`}>
                {results[results.length - 1]?.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
                <div>
                  <p className="font-medium">
                    {results[results.length - 1]?.isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="text-sm">
                    The correct answer is: {currentQuestion.answer}
                  </p>
                </div>
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Step-by-step solution:</h4>
                  <ol className="space-y-1">
                    {currentQuestion.explanation.map((step, index) => (
                      <li key={index} className="text-sm">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <Button onClick={handleNextQuestion} className="w-full">
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  'Complete Quiz'
                )}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Card>
  );
};

export default MathQuiz;
