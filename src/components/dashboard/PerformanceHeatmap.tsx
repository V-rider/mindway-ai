import React from 'react';
import { HeatmapData } from '@/types';
import { 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid
} from 'recharts';
import { customTooltips } from '@/components/ui/custom-tooltips';

interface PerformanceHeatmapProps {
  data: HeatmapData[];
  onClassSelect: (className: string) => void;
}

// Custom heatmap component using Recharts
const HeatMap = ({ data, onClassSelect }: PerformanceHeatmapProps) => {
  if (!data || data.length === 0) return null;
  
  // Extract all unique topics across classes
  const allTopics = Array.from(
    new Set(data.flatMap(classData => classData.topics.map(t => t.name)))
  );
  
  // Get the performance data in format for the heatmap
  const heatmapData = data.map(classData => {
    const result: Record<string, any> = {
      name: classData.className,
      grade: classData.grade,
    };
    
    // Add topic performances
    classData.topics.forEach(topic => {
      result[topic.name] = topic.performance;
    });
    
    return result;
  });
  
  // Get color based on performance value
  const getColorByValue = (value?: number) => {
    if (value === undefined) return '#f1f5f9'; // light gray for missing data
    if (value >= 80) return '#10b981'; // green for high performance
    if (value >= 70) return '#60a5fa'; // blue for good performance
    if (value >= 60) return '#facc15'; // yellow for average performance
    if (value >= 50) return '#f97316'; // orange for below average
    return '#ef4444'; // red for poor performance
  };
  
  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={400}>
        <div className="recharts-wrapper">
          <div className="recharts-heatmap">
            {/* Header row with topic names */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <div className="w-32 p-2 font-medium text-gray-700 dark:text-gray-300">
                Class
              </div>
              {allTopics.map((topic, i) => (
                <div key={i} className="flex-1 p-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300 min-w-[80px]">
                  {topic}
                </div>
              ))}
            </div>
            
            {/* Data rows */}
            <div className="flex flex-col">
              {heatmapData.map((rowData, i) => (
                <div 
                  key={i} 
                  className="flex border-b border-gray-200 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => onClassSelect(rowData.name)}
                >
                  <div className="w-32 p-2 text-sm text-gray-800 dark:text-gray-200 flex items-center">
                    <div>
                      <div>{rowData.name}</div>
                      <div className="text-xs text-gray-500">Grade {rowData.grade}</div>
                    </div>
                  </div>
                  
                  {allTopics.map((topic, j) => {
                    const value = rowData[topic];
                    return (
                      <div 
                        key={j} 
                        className="flex-1 p-2 min-w-[80px] flex items-center justify-center"
                        data-tooltip-id={`heatmap-tooltip-${i}-${j}`}
                        data-tooltip-content={`${topic}: ${value || 'N/A'}%`}
                      >
                        <div 
                          className="w-full h-8 rounded" 
                          style={{ 
                            backgroundColor: getColorByValue(value),
                            opacity: value ? 0.8 : 0.3
                          }}
                        >
                          {value && (
                            <div className="h-full flex items-center justify-center text-xs font-medium text-white">
                              {value}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Color legend */}
          <div className="flex justify-end items-center gap-4 mt-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Performance:
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Poor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Below Avg</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Average</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Excellent</span>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export const PerformanceHeatmap: React.FC<PerformanceHeatmapProps> = ({ data, onClassSelect }) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
        Performance Heatmap by Topic
      </h3>
      <div className="overflow-x-auto">
        <HeatMap data={data} onClassSelect={onClassSelect} />
      </div>
      <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
        Click on a class row to view detailed performance data
      </div>
    </div>
  );
};
