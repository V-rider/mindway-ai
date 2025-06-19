
import React from 'react';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  filters: {
    grade: string;
    subject: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
  onFilterChange: (key: string, value: string) => void;
  onDateChange: (key: 'start' | 'end', value: string) => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onFilterChange,
  onDateChange,
}) => {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {filters.grade && (
        <div className="inline-flex items-center bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 text-sm px-3 py-1 rounded-full">
          Grade: {filters.grade}
          <button
            onClick={() => onFilterChange('grade', '')}
            className="ml-1 text-purple-600 dark:text-purple-400 focus:outline-none"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      
      {filters.subject && (
        <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full">
          Subject: {filters.subject}
          <button
            onClick={() => onFilterChange('subject', '')}
            className="ml-1 text-blue-600 dark:text-blue-400 focus:outline-none"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      
      {filters.dateRange.start && (
        <div className="inline-flex items-center bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm px-3 py-1 rounded-full">
          From: {new Date(filters.dateRange.start).toLocaleDateString()}
          <button
            onClick={() => onDateChange('start', '')}
            className="ml-1 text-green-600 dark:text-green-400 focus:outline-none"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      
      {filters.dateRange.end && (
        <div className="inline-flex items-center bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm px-3 py-1 rounded-full">
          To: {new Date(filters.dateRange.end).toLocaleDateString()}
          <button
            onClick={() => onDateChange('end', '')}
            className="ml-1 text-green-600 dark:text-green-400 focus:outline-none"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
