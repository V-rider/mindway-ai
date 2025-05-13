
import React from "react";
import { TestResult } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { motion } from "framer-motion";

interface ChartsSectionProps {
  result: TestResult;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ result }) => {
  // Transform concepts for horizontal bar chart with mean representation
  const conceptData = result.concepts.map(concept => {
    const mean = 72; // Example mean value - this would ideally come from your data source
    
    return {
      subject: concept.name,
      mastery: concept.percentage,
      mean: mean, // Add mean data point
      // Color the bar based on performance tier
      color: concept.percentage >= 75 ? "#10b981" : // Green for ≥75%
             concept.percentage >= 65 ? "#facc15" : // Yellow for 65-74%
             "#ef4444" // Red for <65%
    };
  });
  
  return (
    <div className="space-y-10">
      {/* Horizontal Bar Chart for Topic Mastery Overview with Mean comparison */}
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
              margin={{ top: 5, right: 80, left: 130, bottom: 5 }}
              barGap={0}
              barSize={16}
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
                width={120}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "mastery") {
                    return [`${value}%`, 'Performance'];
                  }
                  if (name === "mean") {
                    return [`${value}%`, 'Mean'];
                  }
                  return [`${value}%`, name];
                }}
                cursor={{ fill: 'transparent' }}
              />
              <Legend verticalAlign="top" height={36} />
              
              {/* Mastery bar */}
              <Bar 
                dataKey="mastery" 
                name="Performance" 
                stackId="a" 
                fill="#0EA5E9" // Ocean Blue for performance as shown in the image
                radius={[0, 4, 4, 0]}
              >
                <LabelList 
                  dataKey="mastery" 
                  position="right" 
                  formatter={(value) => `${value}%`}
                  style={{ fill: '#666', fontSize: '12px', fontWeight: 'bold' }}
                  offset={15}
                />
              </Bar>
              
              {/* Mean bar */}
              <Bar 
                dataKey="mean" 
                name="Mean" 
                stackId="b" 
                fill="#8B5CF6" // Vivid Purple for mean as shown in the image
                radius={[0, 4, 4, 0]}
              >
                <LabelList 
                  dataKey="mean" 
                  position="insideRight" 
                  formatter={(value) => `${value}%`}
                  style={{ fill: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
