
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ChevronLeft } from "lucide-react";
import { SidebarMenu } from "./SidebarMenu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: any;
  user: any;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, menuItems, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && isOpen) {
      onClose();
    }
  }, [location.pathname, isMobile, isOpen, onClose]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-transform duration-300 transform",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col py-4">
          {/* Close/Collapse button */}
          <div className="absolute top-2 right-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8"
            >
              {isMobile ? <X className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Logo and App Name */}
          <div className="px-6 mb-6 mt-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Mindway AI
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Analytics & Insights
            </p>
          </div>

          {/* Sidebar Menu */}
          <SidebarMenu items={menuItems} />

          {/* User Profile and Logout */}
          <div className="mt-auto px-6 pt-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <Avatar className="mr-3 h-8 w-8">
                    <AvatarImage src={user?.imageUrl} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" forceMount className="w-48">
                <DropdownMenuItem onClick={handleLogout} className="focus:bg-gray-100 dark:focus:bg-gray-800">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};
