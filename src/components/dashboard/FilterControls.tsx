
import React from 'react';
import { Input } from '@/components/ui/input';

interface FilterControlsProps {
  filters: {
    grade: string;
    subject: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
  grades: string[];
  subjects: string[];
  onFilterChange: (key: string, value: string) => void;
  onDateChange: (key: 'start' | 'end', value: string) => void;
  onClose: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  grades,
  subjects,
  onFilterChange,
  onDateChange,
  onClose,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Grade Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Grade
        </label>
        <select
          value={filters.grade}
          onChange={(e) => onFilterChange('grade', e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2"
        >
          <option value="">All Grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              Grade {grade}
            </option>
          ))}
        </select>
      </div>
      
      {/* Subject Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subject
        </label>
        <select
          value={filters.subject}
          onChange={(e) => onFilterChange('subject', e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2"
        >
          <option value="">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>
      
      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          From Date
        </label>
        <Input
          type="date"
          value={filters.dateRange.start}
          onChange={(e) => onDateChange('start', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          To Date
        </label>
        <Input
          type="date"
          value={filters.dateRange.end}
          onChange={(e) => onDateChange('end', e.target.value)}
        />
      </div>
    </div>
  );
};
