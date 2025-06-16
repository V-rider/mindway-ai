
import React from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from '@/hooks/use-translation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from "@/components/ui/button";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  userName,
}) => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-8 w-8"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <X className="h-4 w-4 transition-all duration-300" />
          ) : (
            <Menu className="h-4 w-4 transition-all duration-300" />
          )}
        </Button>
        
        <div className="ml-auto flex items-center gap-4">
          <LanguageSwitcher />
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('welcome')}, {userName}
          </div>
        </div>
      </div>
    </header>
  );
};
