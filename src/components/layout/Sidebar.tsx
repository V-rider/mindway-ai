
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { SidebarMenu } from "./SidebarMenu";
import { UserProfile } from "./UserProfile";
import { MenuItem } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  menuItems,
  user,
  onLogout,
}) => {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/81e0cb63-c50b-4e64-826e-e52133b0f5e9.png" 
              alt="Cortex Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Cortex
            </span>
          </Link>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <SidebarMenu menuItems={menuItems} />
        <UserProfile user={user} onLogout={onLogout} />
      </div>
    </motion.div>
  );
};
