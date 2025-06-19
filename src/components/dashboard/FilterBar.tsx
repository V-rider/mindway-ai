
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterControls } from './FilterControls';
import { ActiveFilters } from './ActiveFilters';

interface FilterBarProps {
  onFilterChange: (filters: {
    grade?: string;
    subject?: string;
    dateRange?: { start: string; end: string };
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
        <div className="flex-1"></div>
        
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
          <FilterControls
            filters={filters}
            grades={grades}
            subjects={subjects}
            onFilterChange={handleFilterChange}
            onDateChange={handleDateChange}
            onClose={() => setIsOpen(false)}
          />
          
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </motion.div>
      )}
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <ActiveFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onDateChange={handleDateChange}
        />
      )}
    </div>
  );
};
