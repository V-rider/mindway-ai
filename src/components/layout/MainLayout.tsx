
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  BarChart3, 
  BookOpen, 
  Users,
  GraduationCap
} from "lucide-react";
import { MenuItem } from "@/types";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ROUTES, USER_ROLES, STORAGE_KEYS, APP_CONFIG } from "@/utils/constants";

// Create a function to get menu items based on user role
const getMenuItems = (isAdmin: boolean, isStudent: boolean) => {
  const baseItems: MenuItem[] = [
    {
      title: "Dashboard",
      path: ROUTES.DASHBOARD,
      icon: LayoutDashboard
    }
  ];
  
  // Admin-specific menu items
  if (isAdmin) {
    baseItems.push(
      {
        title: "Upload Tests",
        path: ROUTES.UPLOAD,
        icon: Upload
      },
      {
        title: "Students",
        path: ROUTES.STUDENTS,
        icon: Users
      }
    );
  }
  
  // Student-specific menu items
  if (isStudent) {
    baseItems.push(
      {
        title: "E-Learning",
        path: ROUTES.E_LEARNING,
        icon: GraduationCap
      },
      {
        title: "Learning Pathway",
        path: ROUTES.LEARNING_PATHWAY,
        icon: BookOpen
      }
    );
  }
  
  return baseItems;
};

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize sidebar state from localStorage or default based on current route
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_OPEN);
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Default to open only on dashboard
    return location.pathname === ROUTES.DASHBOARD;
  });
  
  // Determine if the user is a student (not an admin)
  const isStudent = user && user.role === USER_ROLES.STUDENT;
  
  const menuItems = getMenuItems(isAdmin, !!isStudent);
  
  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };
  
  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_OPEN, JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);
  
  // Prevent keyboard shortcuts from interfering
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Disable Ctrl+B or Cmd+B shortcuts that might trigger sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const handleSidebarToggle = (open: boolean) => {
    setSidebarOpen(open);
  };
  
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => handleSidebarToggle(false)}
        menuItems={menuItems}
        user={user}
        onLogout={handleLogout}
        appConfig={APP_CONFIG}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={handleSidebarToggle}
          userName={user?.name}
        />
        
        <main className="p-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
