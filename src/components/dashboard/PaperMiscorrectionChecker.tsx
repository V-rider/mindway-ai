
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MiscorrectionResult {
  id: string;
  questionNumber: number;
  studentAnswer: string;
  markedPoints: number;
  correctPoints: number;
  confidence: number;
  explanation: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const PaperMiscorrectionChecker: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [results, setResults] = useState<MiscorrectionResult[]>([]);
  
  // Mock function to handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          simulateAnalysis();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  // Simulate the analysis process
  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setResults([
            {
              id: '1',
              questionNumber: 3,
              studentAnswer: '3/4 + 2/6 = 5/10 + 5/15 = 10/30',
              markedPoints: 0,
              correctPoints: 2,
              confidence: 92,
              explanation: "Student\'s approach is correct. They converted to equivalent fractions with a common denominator correctly. Final simplification was not required in the question.",
              status: 'pending'
            },
            {
              id: '2',
              questionNumber: 7,
              studentAnswer: '12 × 5/6 = 60/6 = 10',
              markedPoints: 5,
              correctPoints: 5,
              confidence: 97,
              explanation: 'Correct answer, properly marked.',
              status: 'pending'
            },
            {
              id: '3',
              questionNumber: 12,
              studentAnswer: '3.75 × 4 = 15',
              markedPoints: 0,
              correctPoints: 0,
              confidence: 99,
              explanation: "Student\'s answer is incorrect. The correct answer is 3.75 × 4 = 15.0, marking is accurate.",
              status: 'pending'
            },
            {
              id: '4',
              questionNumber: 15,
              studentAnswer: '(3 + 5) × 2 = 8 × 2 = 16',
              markedPoints: 1,
              correctPoints: 5,
              confidence: 89,
              explanation: "Student\'s work correctly follows order of operations. Final answer 16 is correct. Appears points were deducted in error.",
              status: 'pending'
            }
          ]);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };
  
  // Handle accept/reject correction
  const handleAction = (id: string, action: 'accept' | 'reject') => {
    setResults(prev => prev.map(result => 
      result.id === id 
        ? {...result, status: action === 'accept' ? 'accepted' : 'rejected'} 
        : result
    ));
  };
  
  // Calculate stats
  const acceptedCorrections = results.filter(r => r.status === 'accepted').length;
  const totalPossiblePoints = results.reduce((sum, r) => sum + r.correctPoints - r.markedPoints, 0);
  
  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Upload Student Papers
        </h3>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
            <input 
              type="file" 
              id="paper-upload" 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={handleFileUpload}
              multiple
            />
            <label 
              htmlFor="paper-upload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                Upload Student Papers
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Drag and drop files here or click to browse
              </p>
              <Button>Select Files</Button>
            </label>
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                <span className="text-gray-800 dark:text-gray-200">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
          
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Analyzing papers for miscorrections...</span>
                <span className="text-gray-800 dark:text-gray-200">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} />
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Results Section */}
      {results.length > 0 && (
        <motion.div
          className="glass-card rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Potential Miscorrections Found
            </h3>
            
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Items Found:</span>
                <span className="ml-2 font-bold text-purple-600 dark:text-purple-400">{results.length}</span>
              </div>
              
              <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Points Adjustment:</span>
                <span className="ml-2 font-bold text-green-600 dark:text-green-400">
                  +{totalPossiblePoints}
                </span>
              </div>
              
              <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Resolved:</span>
                <span className="ml-2 font-bold text-blue-600 dark:text-blue-400">
                  {acceptedCorrections + results.filter(r => r.status === 'rejected').length}/{results.length}
                </span>
              </div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {results.map((result) => (
              <AccordionItem 
                key={result.id} 
                value={result.id} 
                className={`border rounded-lg overflow-hidden ${
                  result.status === 'accepted' 
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30' 
                    : result.status === 'rejected'
                    ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        result.confidence >= 90 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : result.confidence >= 75
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        <span className="text-xs font-bold">{result.confidence}%</span>
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">
                          Question {result.questionNumber}
                        </h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Points: {result.markedPoints} → {result.correctPoints}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {result.status === 'accepted' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Accepted
                        </span>
                      )}
                      {result.status === 'rejected' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          <XCircle className="w-3 h-3 mr-1" />
                          Rejected
                        </span>
                      )}
                      {result.status === 'pending' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Student&apos;s Answer:
                      </div>
                      <div className="text-gray-800 dark:text-gray-200 font-mono bg-white dark:bg-gray-900/50 p-2 rounded border border-gray-200 dark:border-gray-700">
                        {result.studentAnswer}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        AI Analysis:
                      </div>
                      <p className="text-gray-800 dark:text-gray-200">
                        {result.explanation}
                      </p>
                    </div>
                    
                    {result.status === 'pending' && (
                      <div className="flex justify-end gap-3 mt-2">
                        <Button 
                          variant="outline"
                          onClick={() => handleAction(result.id, 'reject')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          variant="default"
                          onClick={() => handleAction(result.id, 'accept')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      )}
    </div>
  );
};
