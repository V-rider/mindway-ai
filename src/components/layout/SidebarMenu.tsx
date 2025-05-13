
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

type SidebarMenuItemProps = {
  to: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type SidebarMenuProps = {
  items?: {
    title: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
  }[];
};

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ 
  to, 
  label, 
  icon, 
  onClick 
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative',
        isActive 
          ? 'text-primary-foreground bg-primary' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
    >
      {icon && (
        <span className="w-5 h-5">
          {icon}
        </span>
      )}
      <span>{label}</span>
      {isActive && (
        <motion.div
          layoutId="sidebar-indicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-full"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ items = [] }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  // Display only the menu items that user should see
  return (
    <nav className="space-y-1 py-2">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <SidebarMenuItem 
            key={i} 
            to={item.path} 
            label={item.title} 
            icon={Icon ? <Icon className="w-5 h-5" /> : undefined}
            onClick={item.onClick}
          />
        );
      })}
    </nav>
  );
};

export default SidebarMenu;
