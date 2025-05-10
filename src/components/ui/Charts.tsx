
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
  
  // Transform concepts for radar chart - adding a mean value for stacked bar display
  const conceptData = result.concepts.map(concept => ({
    subject: concept.name,
    performance: concept.percentage * 0.6, // First part of the bar (light color)
    mean: concept.percentage * 0.4, // Second part of the bar (darker color)
    total: concept.percentage, // Total value for tooltip
  }));
  
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
      
      {/* Stacked Bar Chart - Concept Mastery (replacing the radar chart) */}
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
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === "performance") return ["Performance", `${value.toFixed(1)}%`];
                  if (name === "mean") return ["Mean", `${value.toFixed(1)}%`];
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
              <Bar dataKey="performance" name="Performance" stackId="a" fill="#0EA5E9" />
              <Bar dataKey="mean" name="Mean" stackId="a" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
