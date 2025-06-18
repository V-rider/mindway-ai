import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { TranslationProvider } from "@/hooks/use-translation";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import LearningPathway from "./pages/LearningPathway";
import ELearning from "./pages/ELearning";
import MathChallenge from "./pages/MathChallenge";
import NotFound from "./pages/NotFound";
import Students from "./pages/Students";
import TestAnalytics from "./pages/TestAnalytics";
import StudentProfile from "./pages/StudentProfile";
import Achievements from "./pages/Achievements";

// Create a new QueryClient
const queryClient = new QueryClient();

// Protected route component with role checking
const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  requireStudent = false,
  allowFromNavigation = false
}: { 
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireStudent?: boolean;
  allowFromNavigation?: boolean; 
}) => {
  const { isAuthenticated, isLoading, isAdmin, user } = useAuth();
  const isStudent = user?.role === 'student';
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Check if admin is required but user is not an admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check if student is required but user is not a student
  if (requireStudent && !isStudent) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute requireAdmin>
              <Upload />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/students" 
          element={
            <ProtectedRoute requireAdmin>
              <Students />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/students/profile" 
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/reports/:testId" 
          element={
            <ProtectedRoute>
              <TestAnalytics />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute requireStudent>
              <Analytics />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/learning-pathway" 
          element={
            <ProtectedRoute requireStudent>
              <LearningPathway />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/e-learning" 
          element={
            <ProtectedRoute requireStudent>
              <ELearning />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/achievements" 
          element={
            <ProtectedRoute requireStudent>
              <Achievements />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/math-challenge" 
          element={
            <ProtectedRoute requireStudent>
              <MathChallenge />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TranslationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </TranslationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
