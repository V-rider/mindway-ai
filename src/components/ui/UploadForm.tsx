
import React, { useState } from "react";
import { Upload, Check, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { TestMeta } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [testMeta, setTestMeta] = useState<Omit<TestMeta, "id" | "userId" | "createdAt">>({
    name: "",
    subject: "Math",
    date: new Date().toISOString().split("T")[0]
  });
  const [uploading, setUploading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    // Check if file is an image or PDF
    if (!file.type.match("image/*") && file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload an image or PDF file",
        variant: "destructive"
      });
      return;
    }
    
    setFile(file);
    
    // If it's an image, create a preview
    if (file.type.match("image/*")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, just show a placeholder
      setPreview("/lovable-uploads/2db89c37-4f84-417c-878f-11c576a5afea.png");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Missing file",
        description: "Please upload a test image or PDF",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // In a real app, this would upload to a server
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to the analysis page with a mock test ID
      const mockTestId = "test-" + Date.now();
      const params = new URLSearchParams({
        name: testMeta.name,
        subject: testMeta.subject,
        date: testMeta.date
      });
      
      toast({
        title: "Upload successful",
        description: "Your test is being analyzed",
        variant: "default"
      });
      
      navigate(`/reports/${mockTestId}?${params.toString()}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your test",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="testName" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Test Name
            </label>
            <input
              id="testName"
              type="text"
              required
              value={testMeta.name}
              onChange={e => setTestMeta({...testMeta, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              placeholder="e.g. Math Midterm Exam"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="subject" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Subject
              </label>
              <select
                id="subject"
                value={testMeta.subject}
                onChange={e => setTestMeta({...testMeta, subject: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              >
                <option value="Math">Mathematics</option>
                <option value="Algebra">Algebra</option>
                <option value="Geometry">Geometry</option>
                <option value="Arithmetic">Arithmetic</option>
                <option value="Calculus">Calculus</option>
              </select>
            </div>
            
            <div>
              <label 
                htmlFor="testDate" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Test Date
              </label>
              <input
                id="testDate"
                type="date"
                value={testMeta.date}
                onChange={e => setTestMeta({...testMeta, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              />
            </div>
          </div>
        </div>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive 
              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              : "border-gray-300 dark:border-gray-600"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {!preview ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Test Image or PDF
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                Drag and drop your file here, or click to browse.
                Supported formats: JPEG, PNG, GIF, PDF
              </p>
              
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer px-6 py-2.5 bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 text-white font-medium rounded-lg text-sm transition-colors"
              >
                Browse files
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={handleChange}
                />
              </label>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md mx-auto">
                <img 
                  src={preview} 
                  alt="Test preview" 
                  className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-md"
                />
                <div className="absolute top-2 right-2">
                  <div className="bg-green-500 text-white p-1 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {file?.name}
                </p>
                
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
        
        <motion.button
          type="submit"
          disabled={uploading || !file}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 text-white font-medium rounded-lg text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </span>
          ) : (
            "Upload and Analyze"
          )}
        </motion.button>
      </form>
    </div>
  );
};
