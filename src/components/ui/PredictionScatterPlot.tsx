
import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface StudentScoreData {
  studentName: string;
  actualScore: number;
  predictedScore: number;
  performance: 'above' | 'below' | 'on-target';
}

interface PredictionScatterPlotProps {
  data: StudentScoreData[];
  testName: string;
}

export const PredictionScatterPlot: React.FC<PredictionScatterPlotProps> = ({ data, testName }) => {
  // Custom tooltip to show student details
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 dark:text-gray-200">{data.studentName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Actual: {data.actualScore}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Predicted: {data.predictedScore}%
          </p>
          <p className="text-sm font-medium">
            <span className={
              data.performance === 'above' ? 'text-green-600' :
              data.performance === 'below' ? 'text-red-600' :
              'text-blue-600'
            }>
              {data.performance === 'above' ? 'Outperformed' :
               data.performance === 'below' ? 'Underperformed' :
               'As Expected'}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Get color based on performance
  const getPointColor = (performance: string) => {
    switch (performance) {
      case 'above': return '#22c55e'; // green
      case 'below': return '#ef4444'; // red
      default: return '#3b82f6'; // blue
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Prediction Accuracy Analysis
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {testName}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Outperformed prediction</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Underperformed prediction</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600 dark:text-gray-400">As expected</span>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
              data={data}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="actualScore" 
                name="Actual Score"
                domain={[0, 100]}
                label={{ value: 'Actual Score (%)', position: 'insideBottom', offset: -10 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                type="number" 
                dataKey="predictedScore" 
                name="Predicted Score"
                domain={[0, 100]}
                label={{ value: 'Predicted Score (%)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Perfect prediction line (y = x) */}
              <ReferenceLine 
                segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]} 
                stroke="#6b7280" 
                strokeDasharray="5 5"
                opacity={0.7}
              />
              
              {/* Scatter points for each performance category */}
              {['above', 'below', 'on-target'].map(performance => (
                <Scatter
                  key={performance}
                  data={data.filter(d => d.performance === performance)}
                  fill={getPointColor(performance)}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Points on the diagonal line indicate perfect predictions. 
            Points above the line show students who outperformed expectations.
          </p>
        </div>
      </div>
    </div>
  );
};
