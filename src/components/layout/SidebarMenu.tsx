
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from '@/hooks/use-translation';
import { MenuItem } from "@/types";

interface SidebarMenuProps {
  menuItems: MenuItem[];
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ menuItems }) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                location.pathname === item.path 
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{t(item.title.toLowerCase().replace(' ', '.'))}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
