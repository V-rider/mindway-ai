
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from "framer-motion";
import { Loader2, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/dashboard');
      } else {
        await signup(email, password, { full_name: fullName });
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4">
              <BookOpen className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Mindway AI
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Math Test Analysis & Learning Pathways
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  minLength={6}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (isLogin ? 'Sign In' : 'Sign Up')}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Demo Accounts
                  </span>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-100 dark:bg-gray-700 flex-shrink-0">
                    <img 
                      src="/lovable-uploads/8ee1bdd6-bfc2-4782-a9d1-7ba12b2146e7.png" 
                      alt="Student" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Student Account
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      student@example.com
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("student@example.com");
                      setPassword("password");
                    }}
                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-100 dark:bg-gray-700 flex-shrink-0">
                    <img 
                      src="/lovable-uploads/7aff8652-12ca-4080-b580-d23a64527cd3.png" 
                      alt="Admin" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Admin Account
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      admin@example.com
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("admin@example.com");
                      setPassword("password");
                    }}
                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Right panel - Banner */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="flex flex-col justify-center px-12 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Revolutionize Math Education with Mindway AI
            </h2>
            
            <p className="text-lg text-purple-100 mb-8">
              Analyze test performance, identify learning gaps, and create personalized learning pathways.
            </p>
            
            <div className="space-y-4">
              {[
                "Upload and analyze math tests automatically",
                "Identify concept mastery and common error patterns",
                "Generate personalized learning paths for students",
                "Track progress with detailed analytics"
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                >
                  <CheckCircle2 className="w-5 h-5 text-purple-200 mt-0.5 mr-3" />
                  <p className="text-purple-100">{feature}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
