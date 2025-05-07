
import React, { useState } from 'react';
import { HeatmapData } from '@/types';
import { 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid
} from 'recharts';
import { customTooltips } from '@/components/ui/custom-tooltips';
import { AlertTriangle } from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";

interface PerformanceHeatmapProps {
  data: HeatmapData[];
  onClassSelect: (className: string) => void;
}

// Custom heatmap component using Recharts
const HeatMap = ({ data, onClassSelect, filteredGrade, teacherClasses }: PerformanceHeatmapProps & { 
  filteredGrade: string;
  teacherClasses?: string[];
}) => {
  if (!data || data.length === 0) return null;
  
  // Filter data by grade
  const filteredData = data.filter(classData => classData.grade === filteredGrade);
  
  if (filteredData.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500 dark:text-gray-400">
        No data available for the selected filter
      </div>
    );
  }
  
  // Extract all unique topics across classes
  const allTopics = Array.from(
    new Set(filteredData.flatMap(classData => classData.topics.map(t => t.name)))
  );
  
  // Get the performance data in format for the heatmap
  const heatmapData = filteredData.map(classData => {
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
    if (value >= 65) return '#facc15'; // yellow for average performance
    return '#ef4444'; // red for poor performance
  };
  
  // Function to check if a class is taught by the current user
  const isTeacherClass = (className: string) => {
    return teacherClasses?.includes(className) || false;
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="w-full">
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
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
              className={`flex border-b border-gray-200 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                isTeacherClass(rowData.name) ? 'bg-purple-50 dark:bg-purple-900/20' : ''
              }`}
              onClick={() => onClassSelect(rowData.name)}
            >
              <div className={`w-32 p-2 text-sm flex items-center ${
                isTeacherClass(rowData.name) 
                  ? 'text-purple-700 dark:text-purple-300 font-medium' 
                  : 'text-gray-800 dark:text-gray-200'
              }`}>
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
                  >
                    <div 
                      className="w-full h-8 rounded relative" 
                      style={{ 
                        backgroundColor: getColorByValue(value),
                        opacity: value ? 0.8 : 0.3,
                        // Add a border for teacher's classes
                        border: isTeacherClass(rowData.name) ? '2px solid #9b87f5' : 'none',
                      }}
                      data-tooltip-id={`heatmap-tooltip-${i}-${j}`}
                      data-tooltip-content={`${topic}: ${value || 'N/A'}%`}
                    >
                      {value && value < 65 && (
                        <div className="absolute -top-1 -right-1">
                          <AlertTriangle className="w-4 h-4 text-white" />
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
          <span className="text-xs text-gray-600 dark:text-gray-400">Needs Improvement (&lt;65%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Average (65-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Excellent (≥80%)</span>
        </div>
      </div>
    </div>
  );
};

export const PerformanceHeatmap: React.FC<PerformanceHeatmapProps> = ({ data, onClassSelect }) => {
  const [filteredGrade, setFilteredGrade] = useState<string>("6"); // Default to Grade 6
  const { user } = useAuth();
  
  // Extract all unique grades
  const grades = Array.from(new Set(data.map(item => item.grade))).sort();
  
  // Mock data for teacher's classes - in a real app, this would come from user data
  const teacherClasses = ["Class 3A", "Class 6B", "Class 6D"];
  
  // Create four classes for each grade
  const enhancedData = [...data];
  
  // Create a set to track existing class names
  const existingClasses = new Set(data.map(item => item.className));
  
  // For each grade, ensure there are at least 4 classes (A, B, C, D)
  grades.forEach(grade => {
    // Add more class letters for grades 3, 4, and 5
    const classLetters = grade === "3" || grade === "4" || grade === "5" 
      ? ['A', 'B', 'C', 'D', 'E', 'F'] // More samples for grades 3, 4, and 5
      : ['A', 'B', 'C', 'D'];
    
    // Check if we need to add any classes for this grade
    classLetters.forEach(letter => {
      const className = `Class ${grade}${letter}`;
      
      // Only add if this class doesn't already exist
      if (!existingClasses.has(className)) {
        // Generate random performance data for the new class
        const topics = data[0].topics.map(topic => ({
          name: topic.name,
          performance: Math.floor(Math.random() * 35) + 60 // Random performance between 60-95%
        }));
        
        enhancedData.push({
          className,
          grade,
          topics
        });
        
        // Add to tracking set
        existingClasses.add(className);
      }
    });
  });
  
  // Add additional sample class data directly with more varied performance values for specific grades
  // Only add if they don't already exist
  const additionalSamples = [
    {
      className: "Class 3G",
      grade: "3",
      topics: data[0].topics.map(topic => ({
        name: topic.name,
        performance: Math.floor(Math.random() * 15) + 80 // Higher performance (80-95%)
      }))
    },
    {
      className: "Class 3H",
      grade: "3",
      topics: data[0].topics.map(topic => ({
        name: topic.name,
        performance: Math.floor(Math.random() * 20) + 70 // Good performance (70-90%)
      }))
    },
    {
      className: "Class 4G",
      grade: "4",
      topics: data[0].topics.map(topic => ({
        name: topic.name,
        performance: Math.floor(Math.random() * 25) + 65 // Above average (65-90%)
      }))
    },
    {
      className: "Class 4H",
      grade: "4",
      topics: data[0].topics.map(topic => ({
        name: topic.name,
        performance: Math.floor(Math.random() * 15) + 50 // Lower performance (50-65%)
      }))
    },
    {
      className: "Class 5G",
      grade: "5",
      topics: data[0].topics.map(topic => ({
        name: topic.name,
        performance: Math.floor(Math.random() * 20) + 75 // Good performance (75-95%)
      }))
    },
    {
      className: "Class 5H",
      grade: "5",
      topics: data[0].topics.map(topic => ({
        name: topic.name,
        performance: Math.floor(Math.random() * 30) + 55 // Mixed performance (55-85%)
      }))
    }
  ];
  
  additionalSamples.forEach(sample => {
    if (!existingClasses.has(sample.className)) {
      enhancedData.push(sample);
      existingClasses.add(sample.className);
    }
  });
  
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Performance Heatmap by Topic
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Classes taught by you are highlighted in purple
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Grade {filteredGrade}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {grades.map(grade => (
                <DropdownMenuItem 
                  key={grade}
                  onClick={() => setFilteredGrade(grade)}
                >
                  Grade {grade}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-x-auto">
        <HeatMap 
          data={enhancedData} 
          onClassSelect={onClassSelect} 
          filteredGrade={filteredGrade} 
          teacherClasses={teacherClasses}
        />
      </div>
      <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
        Click on a class row to view detailed performance data
      </div>
    </div>
  );
};
