
import React, { useState } from "react";
import { TestResult, ConceptResult, ErrorTypeResult } from "@/types";
import {
  PieChart,
  Pie,
  Bar,
  BarChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { motion } from "framer-motion";

interface ChartsSectionProps {
  result: TestResult;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ result }) => {
  const [selectedPieSegment, setSelectedPieSegment] = useState<string | null>(null);
  
  // Correct vs Incorrect data for pie chart
  const pieData = [
    { name: "Correct", value: result.correctAnswers, color: "#4ade80" },
    { name: "Incorrect", value: result.incorrectAnswers, color: "#f87171" }
  ];
  
  // Transform error types for bar chart
  const errorData = result.errorTypes.map(error => ({
    type: error.type,
    count: error.count,
    color: "#f87171"
  }));
  
  // Transform concepts for horizontal stacked bar chart, similar to the image
  const conceptData = result.concepts.map(concept => {
    // Calculate mean value (assuming mean is 70% of the total for demonstration)
    const meanValue = Math.round(concept.percentage * 0.7); 
    
    return {
      subject: concept.name,
      mastery: concept.percentage - meanValue, // This represents the actual performance segment
      mean: meanValue, // This represents the mean segment
      total: concept.percentage, // Total value for tooltip
    };
  });
  
  const handlePieClick = (entry: any) => {
    setSelectedPieSegment(entry.name === selectedPieSegment ? null : entry.name);
  };
  
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart - Correct vs Incorrect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
            Correct vs Incorrect Answers
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  onClick={handlePieClick}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      opacity={selectedPieSegment === null || selectedPieSegment === entry.name ? 1 : 0.5}
                      stroke="#fff"
                      strokeWidth={selectedPieSegment === entry.name ? 2 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} questions`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex justify-center gap-6">
            {pieData.map((entry, index) => (
              <div 
                key={`legend-${index}`} 
                className="flex items-center"
                onClick={() => handlePieClick(entry)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color, opacity: selectedPieSegment === null || selectedPieSegment === entry.name ? 1 : 0.5 }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Bar Chart - Error Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
            Common Error Types
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={errorData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 12 }} width={150} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {errorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      {/* Horizontal Stacked Bar Chart for Concept Mastery (similar to the image) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
          Concept Mastery Overview
        </h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={conceptData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis 
                dataKey="subject" 
                type="category" 
                tick={{ fontSize: 12 }}
                width={150}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === "mastery") return ["Performance", `${value}%`];
                  if (name === "mean") return ["Mean", `${value}%`];
                  return [name, `${value}%`];
                }}
                labelFormatter={(label) => `${label}`}
              />
              <Legend 
                payload={[
                  { value: 'Performance', type: 'rect', color: '#0EA5E9' },
                  { value: 'Mean', type: 'rect', color: '#8B5CF6' }
                ]}
              />
              {/* Using vivid colors: Ocean Blue for Performance and Vivid Purple for Mean */}
              <Bar 
                dataKey="mean" 
                name="Mean" 
                stackId="a" 
                fill="#8B5CF6" // Vivid Purple
              />
              <Bar 
                dataKey="mastery" 
                name="Performance" 
                stackId="a" 
                fill="#0EA5E9" // Ocean Blue
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-center mt-4 text-sm text-gray-500">
          <div className="flex justify-center items-center gap-5">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#0EA5E9] rounded-full mr-2" />
              <span>Performance</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#8B5CF6] rounded-full mr-2" />
              <span>Mean</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
