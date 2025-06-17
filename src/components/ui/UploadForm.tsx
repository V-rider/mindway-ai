import React, { useState } from "react";
import { Upload, Check, AlertCircle, Loader2, Users, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { TestMeta } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { documentStorageService } from "@/lib/services/document-storage";
import { aiAnalysisService } from "@/lib/services/ai-analysis";
import { extractTextFromFile } from "@/lib/services/content-extraction";

export const UploadForm: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [testMeta, setTestMeta] = useState<Omit<TestMeta, "id" | "userId" | "createdAt">>({
    name: "",
    subject: "Math",
    date: new Date().toISOString().split("T")[0]
  });
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { students } = useAuth();
  
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };
  
  const handleFiles = (newFiles: File[]) => {
    // Filter valid files
    const validFiles = newFiles.filter(file => 
      file.type.match("image/*") || file.type === "application/pdf"
    );
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Some files were skipped. Please upload only images or PDF files",
        variant: "destructive"
      });
    }
    
    if (validFiles.length === 0) return;
    
    // Add files to state
    setFiles(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      if (file.type.match("image/*")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, show a placeholder
        setPreviews(prev => [...prev, "/lovable-uploads/2db89c37-4f84-417c-878f-11c576a5afea.png"]);
      }
    });
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle select all/deselect all students
  const handleSelectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      // Deselect all
      setSelectedStudents([]);
    } else {
      // Select all
      setSelectedStudents(students.map(student => student.id));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ... (existing validation for files and selectedStudents) ...
    if (files.length === 0 || selectedStudents.length === 0 || files.length !== selectedStudents.length) {
        // Existing toast messages for these errors
        if (files.length === 0) {
          toast({ title: "Missing files", description: "Please upload at least one test image or PDF", variant: "destructive" });
        } else if (selectedStudents.length === 0) {
          toast({ title: "No students selected", description: "Please select at least one student", variant: "destructive" });
        } else {
          toast({ title: "Mismatch between files and students", description: "Please ensure the number of files matches the number of selected students", variant: "destructive" });
        }
        return;
    }

    setUploading(true);
    const { user, currentClassId } = useAuth(); // Assuming currentClassId is available

    if (!user || !currentClassId) {
      toast({
        title: "Authentication Error",
        description: "User or class information is missing. Please log in again.",
        variant: "destructive",
      });
      setUploading(false);
      return;
    }
    const userId = user.id;

    let successfulUploads = 0;
    let failedUploads = 0;

    // Use a for...of loop to handle async operations correctly within the loop
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const studentId = selectedStudents[i]; // Assuming one file per student, and order matches

      try {
        toast({
          title: `Processing file ${i + 1} of ${files.length}`,
          description: `Uploading ${file.name}...`,
          variant: "default",
        });

        // 1. Upload document
        const document = await documentStorageService.uploadDocument(file, currentClassId, userId);
        // Associate student with document if necessary.
        // The current 'documents' table schema doesn't directly link to a single student,
        // but rather to a class and uploaded_by. This might need further thought if a
        // direct student-document link (for this specific test instance) is required beyond class enrollment.
        // For now, we proceed with upload and analysis.

        toast({
          title: `File ${i + 1}: ${file.name} uploaded`,
          description: `Extracting content and starting AI analysis...`,
          variant: "default",
        });

        // 2. Extract text (placeholder)
        // This will be properly implemented in the next plan step
        const textContent = await extractTextFromFile(file);

        // 3. Analyze document
        await aiAnalysisService.analyzeDocument(document.id, textContent);
        // We might also want to associate studentId with the analysis if the backend supports it,
        // or store this association in another table if needed.

        successfulUploads++;
        toast({
          title: `File ${i + 1}: Analysis initiated`,
          description: `${file.name} is being analyzed.`,
          variant: "default", // Changed to success, but could be "default"
        });
      } catch (error) {
        failedUploads++;
        console.error(`Error processing file ${file.name}:`, error);
        toast({
          title: `Error processing file ${file.name}`,
          description: error instanceof Error ? error.message : "An unknown error occurred.",
          variant: "destructive",
        });
      }
    }

    setUploading(false);

    if (failedUploads > 0) {
      toast({
        title: "Uploads Complete with Errors",
        description: `${successfulUploads} tests processed successfully, ${failedUploads} failed.`,
        variant: "destructive", // Or "warning"
      });
    } else {
      toast({
        title: "All Tests Processed",
        description: `${successfulUploads} tests have been uploaded and sent for analysis.`,
        variant: "default", // Changed to success
      });
    }

    if (successfulUploads > 0) {
      navigate("/reports"); // Navigate if at least one upload was successful
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        {/* File Upload */}
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
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Test Images or PDFs
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                Drag and drop multiple files here, or click to browse.
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
                  multiple
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Uploaded Tests ({files.length})
                </h3>
                <label 
                  htmlFor="add-more-files" 
                  className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add More
                  <input
                    id="add-more-files"
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={handleChange}
                    multiple
                  />
                </label>
              </div>
              
              {/* File List */}
              <div className="space-y-3 max-h-80 overflow-y-auto p-2">
                {files.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                  >
                    <img 
                      src={previews[index]} 
                      alt={`Preview ${index}`} 
                      className="w-16 h-16 object-contain rounded-md mr-4"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                      aria-label="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Student Selection */}
        {students.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Assign Tests to Students
              </h3>
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedStudents.length} of {students.length} selected
                </p>
                <button
                  type="button"
                  onClick={handleSelectAllStudents}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                >
                  {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-4">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {students.map((student) => (
                  <div 
                    key={student.id}
                    className={`flex items-center p-3 rounded-lg border transition-colors cursor-pointer ${
                      selectedStudents.includes(student.id)
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      setSelectedStudents(prev => 
                        prev.includes(student.id)
                          ? prev.filter(id => id !== student.id)
                          : [...prev, student.id]
                      );
                    }}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-100 dark:bg-gray-700 flex-shrink-0">
                      {student.avatar ? (
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 m-auto" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {student.email}
                      </p>
                    </div>
                    <div className="ml-2">
                      {selectedStudents.includes(student.id) ? (
                        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {students.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    No students found in this class
                  </p>
                </div>
              )}
            </div>
            
            {/* Warning if number doesn't match */}
            {files.length > 0 && selectedStudents.length > 0 && files.length !== selectedStudents.length && (
              <div className="flex items-start p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  The number of files ({files.length}) doesn't match the number of selected students ({selectedStudents.length}). 
                  Please ensure each student has exactly one test file.
                </p>
              </div>
            )}
          </div>
        )}
        
        <motion.button
          type="submit"
          disabled={uploading || files.length === 0 || selectedStudents.length === 0 || files.length !== selectedStudents.length}
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
            "Upload and Analyze Tests"
          )}
        </motion.button>
      </form>
    </div>
  );
};
