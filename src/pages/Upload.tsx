
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { UploadForm } from "@/components/ui/UploadForm";
import { motion } from "framer-motion";
import { FileText, Upload as UploadIcon, AlertCircle, Lightbulb } from "lucide-react";

const Upload = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Upload Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload a scanned math test to receive detailed analysis and personalized learning recommendations.
            </p>
          </motion.div>
        </div>
        
        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              How it works
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Upload your test",
                  description: "Take a clear photo or scan of your math test and upload it.",
                  icon: UploadIcon,
                  color: "bg-purple-500",
                },
                {
                  step: 2,
                  title: "AI Analysis",
                  description: "Our AI system will analyze your test, identify concepts, and detect error patterns.",
                  icon: FileText,
                  color: "bg-indigo-500",
                },
                {
                  step: 3,
                  title: "Review Results",
                  description: "Get detailed feedback on your performance and areas for improvement.",
                  icon: AlertCircle,
                  color: "bg-blue-500",
                },
              ].map((step, index) => (
                <div key={index} className="flex items-start">
                  <div
                    className={`flex-shrink-0 w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <UploadForm />
        </motion.div>
        
        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                  Tips for Best Results
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Ensure the image is well-lit and all questions are clearly visible</li>
                  <li>Include all pages of the test in a single file if possible</li>
                  <li>Make sure teacher markings and corrections are visible</li>
                  <li>PNG, JPEG, and PDF formats are supported</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Upload;
