
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Upload from "@/pages/Upload";
import Students from "@/pages/Students";
import ELearning from "@/pages/ELearning";
import LearningPathway from "@/pages/LearningPathway";
import StudentProfile from "@/pages/StudentProfile";
import MathChallenge from "@/pages/MathChallenge";
import TestAnalytics from "@/pages/TestAnalytics";
import Analytics from "@/pages/Analytics";
import Reports from "@/pages/Reports";
import Achievements from "@/pages/Achievements";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Admin Only Routes */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute requireAdmin>
                  <MainLayout>
                    <Upload />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute requireAdmin>
                  <MainLayout>
                    <Students />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Student Routes */}
            <Route
              path="/e-learning"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ELearning />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning-pathway"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <LearningPathway />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <StudentProfile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/math-challenge"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <MathChallenge />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-analytics"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TestAnalytics />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Analytics />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Achievements />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
