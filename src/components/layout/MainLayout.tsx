
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  BarChart3, 
  BookOpen, 
  Users
} from "lucide-react";
import { MenuItem } from "@/types";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

// Create a function to get menu items based on user role
const getMenuItems = (isAdmin: boolean, isStudent: boolean) => {
  const baseItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    }
  ];
  
  // Admin-specific menu items
  if (isAdmin) {
    baseItems.push(
      {
        title: "Upload Tests",
        path: "/upload",
        icon: Upload
      },
      {
        title: "Students",
        path: "/students",
        icon: Users
      },
      {
        title: "Reports",
        path: "/reports",
        icon: FileText
      }
    );
  }
  
  // Student-specific menu items
  if (isStudent) {
    baseItems.push(
      {
        title: "Analytics",
        path: "/analytics",
        icon: BarChart3
      },
      {
        title: "Learning Pathway",
        path: "/learning-pathway",
        icon: BookOpen
      }
      // Reports removed from student menu
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Determine if the user is a student (not an admin)
  const isStudent = user && user.role === 'student';
  
  const menuItems = getMenuItems(isAdmin, isStudent);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <div className="flex-1 transition-all duration-300" style={{ marginLeft: sidebarOpen ? '16rem' : '0' }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
        user={user}
        onLogout={handleLogout}
      />
      
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
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
  );
};
