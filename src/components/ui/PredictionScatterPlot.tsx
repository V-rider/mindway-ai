
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

interface StudentScoreData {
  studentId: string;
  name: string;
  actualScore: number;
  predictedScore: number;
}

interface PredictionScatterPlotProps {
  data: StudentScoreData[];
  testName: string;
}

export const PredictionScatterPlot: React.FC<PredictionScatterPlotProps> = ({ data, testName }) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const difference = data.actualScore - data.predictedScore;
      const performanceType = difference > 0 ? 'Outperformed' : difference < 0 ? 'Underperformed' : 'As Expected';
      
      return (
        <motion.div
          className="bg-white shadow-lg rounded-md p-3 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
            {data.name}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600 dark:text-gray-400">Actual Score:</span>
              <span className="font-medium">{data.actualScore}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600 dark:text-gray-400">Predicted Score:</span>
              <span className="font-medium">{data.predictedScore}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600 dark:text-gray-400">Difference:</span>
              <span className={`font-medium ${
                difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {difference > 0 ? '+' : ''}{difference}%
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className={`text-xs font-medium ${
                difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {performanceType}
              </span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Color function based on performance relative to prediction
  const getPointColor = (actual: number, predicted: number) => {
    const difference = actual - predicted;
    if (difference > 5) return '#10b981'; // Green - significantly outperformed
    if (difference > 0) return '#3b82f6'; // Blue - slightly outperformed  
    if (difference > -5) return '#f59e0b'; // Yellow - slightly underperformed
    return '#ef4444'; // Red - significantly underperformed
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Prediction Accuracy Analysis
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {testName}
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Each point represents a student's actual vs predicted performance. Points above the diagonal line indicate students who outperformed predictions.
          </p>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Significantly Outperformed (+5%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Slightly Outperformed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Slightly Underperformed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Significantly Underperformed (-5%)</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                type="number" 
                dataKey="actualScore" 
                name="Actual Score"
                domain={[0, 100]}
                label={{ value: 'Actual Score (%)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="predictedScore" 
                name="Predicted Score"
                domain={[0, 100]}
                label={{ value: 'Predicted Score (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Perfect prediction line (y = x) */}
              <ReferenceLine 
                segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]} 
                stroke="#6b7280" 
                strokeDasharray="5 5"
                label="Perfect Prediction"
              />
              
              <Scatter 
                data={data} 
                fill="#8884d8"
                shape={(props: any) => {
                  const { cx, cy, payload } = props;
                  const color = getPointColor(payload.actualScore, payload.predictedScore);
                  return (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={6} 
                      fill={color}
                      stroke="#fff"
                      strokeWidth={2}
                      className="transition-all duration-300 ease-in-out hover:scale-150 hover:r-8 cursor-pointer transform-gpu"
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        transformOrigin: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.5)';
                        e.target.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
                      }}
                    />
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
