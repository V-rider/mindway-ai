
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

export const ProjectIndicator: React.FC = () => {
  const { currentProject, currentDomain } = useAuth();

  if (!currentProject || !currentDomain) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
      <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200">
        {currentProject}
      </Badge>
      <span className="text-sm text-purple-600 dark:text-purple-400">
        {currentDomain}
      </span>
    </div>
  );
};
