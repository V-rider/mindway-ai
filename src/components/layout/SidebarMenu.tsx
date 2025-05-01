
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types";

interface SidebarMenuProps {
  items: MenuItem[];
  currentYear?: number;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ items, currentYear = 2023 }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="mt-6">
      <nav>
        <ul className="space-y-1">
          {items?.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group transition-colors",
                    isActive && "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium"
                  )
                }
              >
                {item.icon && React.createElement(item.icon, { className: "w-5 h-5 mr-3" })}
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
