
import React from "react";
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
        {/* Sidebar Toggle Button with Morphing Icon */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-8 w-8"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <div className="w-4 h-4 flex flex-col justify-center items-center">
            <span
              className={`block h-0.5 w-4 bg-current transform transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'rotate-45 translate-y-1' : 'translate-y-0'
              }`}
            />
            <span
              className={`block h-0.5 w-4 bg-current transform transition-all duration-300 ease-in-out mt-1 ${
                sidebarOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-0.5 w-4 bg-current transform transition-all duration-300 ease-in-out mt-1 ${
                sidebarOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0'
              }`}
            />
          </div>
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
