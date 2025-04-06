
import React from 'react';
import { motion } from 'framer-motion';

export const customTooltips = {
  renderHeatmapTooltip: ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }
    
    const topic = payload[0].name;
    const value = payload[0].value;
    
    return (
      <motion.div
        className="bg-white shadow-lg rounded-md p-3 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
          {label} — {topic}
        </div>
        <div className={`text-base font-bold ${
          value >= 80 
            ? "text-green-600 dark:text-green-400" 
            : value >= 70 
            ? "text-blue-600 dark:text-blue-400"
            : value >= 60
            ? "text-yellow-600 dark:text-yellow-400"
            : value >= 50
            ? "text-orange-600 dark:text-orange-400"
            : "text-red-600 dark:text-red-400"
        }`}>
          {value}% mastery
        </div>
      </motion.div>
    );
  },
  
  renderLineChartTooltip: ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }
    
    return (
      <motion.div
        className="bg-white shadow-lg rounded-md p-3 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
          {label}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </motion.div>
    );
  }
};
