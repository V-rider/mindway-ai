import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, BookOpen, ArrowRight, CheckCircle2, Eye, EyeOff, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getProjectByDomain, PROJECT_CONFIGS } from "@/config/projects";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get project info based on current email input
  const currentProject = email ? getProjectByDomain(email) : null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Check if domain is supported
    if (!getProjectByDomain(email)) {
      toast({
        title: "Unsupported domain",
        description: `Email domain not supported. Supported domains: ${PROJECT_CONFIGS.map(c => c.domain).join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: `Login successful to ${currentProject?.projectName}. Redirecting to dashboard...`,
        variant: "default"
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please check your credentials.",
        variant: "destructive"
      });
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
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
              Sign in to your account
            </h2>
            
            {/* Project Indicator */}
            {currentProject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Connecting to: {currentProject.projectName}
                  </span>
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Domain: {currentProject.domain}
                </p>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your school email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label 
                    htmlFor="remember-me" 
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                
                <a 
                  href="#" 
                  className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Forgot password?
                </a>
              </div>
              
              <motion.button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 text-white font-medium rounded-lg text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoggingIn ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Supported Schools
                  </span>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                {PROJECT_CONFIGS.map((project) => (
                  <div key={project.domain} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {project.projectName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        @{project.domain}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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

export default Login;
