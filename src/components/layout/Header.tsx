
import React from "react";
import { Menu } from "lucide-react";
import { useTranslation } from '@/hooks/use-translation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        )}
        
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
