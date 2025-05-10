
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
  LabelList,
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
  
  // Transform concepts for horizontal bar chart with colors like the reference image
  const conceptData = result.concepts.map(concept => {
    // For the reference image style, we'll show the full mastery as the main bar
    // and use a grey background to represent the "remaining" percentage
    
    return {
      subject: concept.name,
      mastery: concept.percentage,
      remaining: 100 - concept.percentage, // This represents the grey background area
      // Color the bar based on performance tier (like in the reference image)
      color: concept.percentage >= 75 ? "#10b981" : // Green for ≥75%
             concept.percentage >= 65 ? "#facc15" : // Yellow for 65-74%
             "#ef4444" // Red for <65%
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
      
      {/* Horizontal Bar Chart for Topic Mastery Overview (matching the reference image) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
          Topic Mastery Overview
        </h3>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={conceptData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              barGap={2}
              barSize={18}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                horizontal={true} 
                vertical={false}
                opacity={0.3}
              />
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                dataKey="subject" 
                type="category" 
                tick={{ fontSize: 13 }}
                width={150}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === "mastery") {
                    return [`${value}%`, `Mastery`];
                  }
                  return [`${value}%`, name];
                }}
                cursor={{ fill: 'transparent' }}
              />
              {/* Background "remainder" bar in light grey */}
              <Bar 
                dataKey="remaining" 
                stackId="a"
                fill="#e5e7eb" // Light grey color for the background
                radius={[0, 4, 4, 0]}
              />
              {/* Mastery bar with dynamic colors */}
              <Bar 
                dataKey="mastery" 
                name="Mastery" 
                stackId="a" 
                radius={[0, 4, 4, 0]}
              >
                {conceptData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList 
                  dataKey="mastery" 
                  position="right" 
                  formatter={(value) => `${value}%`}
                  style={{ fill: '#666', fontSize: '12px', fontWeight: 'bold' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
