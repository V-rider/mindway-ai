
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Upload from "./pages/Upload";
import LearningPathway from "./pages/LearningPathway";
import ELearning from "./pages/ELearning";
import MathChallenge from "./pages/MathChallenge";
import Achievements from "./pages/Achievements";
import StudentProfile from "./pages/StudentProfile";
import TestAnalytics from "./pages/TestAnalytics";
import NotFound from "./pages/NotFound";
import MigratePasswords from "./pages/MigratePasswords";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/learning-pathway" element={<LearningPathway />} />
            <Route path="/e-learning" element={<ELearning />} />
            <Route path="/math-challenge" element={<MathChallenge />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/student/:id" element={<StudentProfile />} />
            <Route path="/test-analytics" element={<TestAnalytics />} />
            <Route path="/migrate-passwords" element={<MigratePasswords />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
