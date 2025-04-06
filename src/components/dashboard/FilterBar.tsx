
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, X, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FilterBarProps {
  onFilterChange: (filters: {
    grade?: string;
    subject?: string;
    dateRange?: { start: string; end: string };
    search?: string;
  }) => void;
  grades: string[];
  subjects: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  grades,
  subjects,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    grade: '',
    subject: '',
    dateRange: {
      start: '',
      end: '',
    },
    search: '',
  });
  
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleDateChange = (key: 'start' | 'end', value: string) => {
    const newFilters = { 
      ...filters, 
      dateRange: { 
        ...filters.dateRange, 
        [key]: value 
      } 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const clearFilters = () => {
    const emptyFilters = {
      grade: '',
      subject: '',
      dateRange: {
        start: '',
        end: '',
      },
      search: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };
  
  const hasActiveFilters = 
    filters.grade || 
    filters.subject || 
    filters.dateRange.start || 
    filters.dateRange.end;
  
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            className="pl-10 pr-10"
            placeholder="Search students, classes, topics..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 dark:text-gray-400"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Grade Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Grade
              </label>
              <select
                value={filters.grade}
                onChange={(e) => handleFilterChange('grade', e.target.value)}
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
                onChange={(e) => handleFilterChange('subject', e.target.value)}
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
                onChange={(e) => handleDateChange('start', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To Date
              </label>
              <Input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setIsOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </motion.div>
      )}
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.grade && (
            <div className="inline-flex items-center bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 text-sm px-3 py-1 rounded-full">
              Grade: {filters.grade}
              <button
                onClick={() => handleFilterChange('grade', '')}
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
                onClick={() => handleFilterChange('subject', '')}
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
                onClick={() => handleDateChange('start', '')}
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
                onClick={() => handleDateChange('end', '')}
                className="ml-1 text-green-600 dark:text-green-400 focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
