
import React, { useState } from "react";
import { Upload, Check, AlertCircle, Loader2, Users, Plus, Trash2, CheckSquare, Square } from "lucide-react";
import { motion } from "framer-motion";
import { TestMeta } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";

export const UploadForm: React.FC = () => {
  // State management for form data
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
  
  // Hooks
  const navigate = useNavigate();
  const { toast } = useToast();
  const { students } = useAuth();
  
  // Check if all students are selected
  const allStudentsSelected = students.length > 0 && selectedStudents.length === students.length;
  const someStudentsSelected = selectedStudents.length > 0 && selectedStudents.length < students.length;
  
  // Drag and drop handlers
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
  
  // Enhanced file handling with better validation
  const handleFiles = (newFiles: File[]) => {
    // Filter valid files with size check
    const validFiles = newFiles.filter(file => {
      const isValidType = file.type.match("image/*") || file.type === "application/pdf";
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });
    
    // Show feedback for rejected files
    const rejectedFiles = newFiles.length - validFiles.length;
    if (rejectedFiles > 0) {
      toast({
        title: "Some files were rejected",
        description: `${rejectedFiles} files were skipped. Only images and PDFs under 10MB are supported.`,
        variant: "destructive"
      });
    }
    
    if (validFiles.length === 0) return;
    
    // Add files to state
    setFiles(prev => [...prev, ...validFiles]);
    
    // Create previews for new files
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
    
    // Show success message for batch upload
    if (validFiles.length > 1) {
      toast({
        title: "Batch upload successful",
        description: `${validFiles.length} files added successfully`,
        variant: "default"
      });
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // Clear all files
  const clearAllFiles = () => {
    setFiles([]);
    setPreviews([]);
    toast({
      title: "Files cleared",
      description: "All uploaded files have been removed",
      variant: "default"
    });
  };
  
  // Student selection handlers
  const toggleSelectAllStudents = () => {
    if (allStudentsSelected) {
      // Deselect all
      setSelectedStudents([]);
    } else {
      // Select all
      setSelectedStudents(students.map(student => student.id));
    }
  };
  
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };
  
  // Auto-assign mode: match number of files to number of students
  const handleAutoAssign = () => {
    if (files.length === students.length) {
      setSelectedStudents(students.map(student => student.id));
      toast({
        title: "Auto-assignment complete",
        description: `${files.length} files matched to ${students.length} students`,
        variant: "default"
      });
    } else {
      toast({
        title: "Cannot auto-assign",
        description: `You have ${files.length} files but ${students.length} students. Numbers must match for auto-assignment.`,
        variant: "destructive"
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (files.length === 0) {
      toast({
        title: "Missing files",
        description: "Please upload at least one test image or PDF",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedStudents.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student",
        variant: "destructive"
      });
      return;
    }
    
    if (!testMeta.name.trim()) {
      toast({
        title: "Missing test name",
        description: "Please enter a name for this test",
        variant: "destructive"
      });
      return;
    }
    
    // For batch upload, allow one-to-many or many-to-many matching
    const isBatchUpload = files.length > 1;
    const isOneToMany = files.length === 1 && selectedStudents.length > 1;
    const isManyToMany = files.length === selectedStudents.length;
    
    if (!isOneToMany && !isManyToMany) {
      toast({
        title: "File-student mismatch",
        description: "Upload either 1 file for multiple students, or the same number of files as students selected",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // Simulate upload with progress
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const uploadType = isOneToMany ? "shared" : "individual";
      
      toast({
        title: "Upload successful",
        description: `${files.length} test(s) uploaded for ${selectedStudents.length} student(s) (${uploadType} mode)`,
        variant: "default"
      });
      
      navigate("/reports");
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the tests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Test Information Section */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Test Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label 
                htmlFor="testName" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Test Name *
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
        
        {/* File Upload Section */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Upload Test Files
            </h3>
            {files.length > 0 && (
              <button
                type="button"
                onClick={clearAllFiles}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear All Files
              </button>
            )}
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
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Batch Upload Test Files
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                  Drag and drop multiple files here, or click to browse.
                  Supported: JPEG, PNG, GIF, PDF (max 10MB each)
                </p>
                
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer px-6 py-2.5 bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 text-white font-medium rounded-lg text-sm transition-colors"
                >
                  Browse Files
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
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Uploaded Files ({files.length})
                  </h4>
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
                
                {/* File Grid for better batch viewing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-2">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 group"
                    >
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove file"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      
                      <img 
                        src={previews[index]} 
                        alt={`Preview ${index}`} 
                        className="w-full h-20 object-contain rounded-md mb-2"
                      />
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Student Selection Section */}
        {students.length > 0 && (
          <div className="glass-card rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Assign to Students
              </h3>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedStudents.length} of {students.length} selected
                </span>
                
                {files.length > 0 && files.length === students.length && (
                  <button
                    type="button"
                    onClick={handleAutoAssign}
                    className="text-sm px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
                  >
                    Auto-assign
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={toggleSelectAllStudents}
                  className="inline-flex items-center text-sm px-3 py-1.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg transition-colors"
                >
                  {allStudentsSelected ? (
                    <>
                      <CheckSquare className="w-4 h-4 mr-1" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 mr-1" />
                      Select All
                    <//>
                  )}
                </button>
              </div>
            </div>
            
            {/* Master checkbox for select all */}
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
              <Checkbox
                id="select-all"
                checked={allStudentsSelected}
                ref={(el) => {
                  if (el) {
                    el.indeterminate = someStudentsSelected;
                  }
                }}
                onCheckedChange={toggleSelectAllStudents}
                className="mr-3"
              />
              <label htmlFor="select-all" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                {allStudentsSelected ? "All students selected" : someStudentsSelected ? "Some students selected" : "Select all students"}
              </label>
            </div>
            
            {/* Student list with improved layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
              {students.map((student) => (
                <div 
                  key={student.id}
                  className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedStudents.includes(student.id)
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => toggleStudentSelection(student.id)}
                >
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleStudentSelection(student.id)}
                    className="mr-3"
                  />
                  
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-100 dark:bg-gray-700 flex-shrink-0 mr-3">
                    {student.avatar ? (
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 m-auto mt-2" />
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {student.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced validation feedback */}
            {files.length > 0 && selectedStudents.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">Upload Configuration:</p>
                    {files.length === 1 && selectedStudents.length > 1 ? (
                      <p>The same test will be assigned to {selectedStudents.length} students.</p>
                    ) : files.length === selectedStudents.length ? (
                      <p>Each of the {files.length} files will be assigned to a different student.</p>
                    ) : (
                      <p className="text-amber-800 dark:text-amber-300">
                        Mismatch: {files.length} files for {selectedStudents.length} students. 
                        Upload 1 file for multiple students, or match the number of files to students.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={uploading || files.length === 0 || selectedStudents.length === 0 || 
            (files.length !== 1 && files.length !== selectedStudents.length)}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 text-white font-medium rounded-lg text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading {files.length} file(s) for {selectedStudents.length} student(s)...
            </span>
          ) : (
            `Upload and Analyze ${files.length} Test(s) for ${selectedStudents.length} Student(s)`
          )}
        </motion.button>
      </form>
    </div>
  );
};
