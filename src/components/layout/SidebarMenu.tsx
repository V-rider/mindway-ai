
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
              className={`nav-link flex items-center gap-3 ${
                location.pathname === item.path ? "active" : ""
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
