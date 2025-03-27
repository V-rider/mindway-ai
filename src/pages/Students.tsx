
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  ChevronRight, 
  BarChart3,
  BookOpen,
  FileText,
  User,
  X,
  PlusCircle
} from "lucide-react";

const Students = () => {
  const { isAdmin, students } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Students
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor all students in your class.
          </p>
        </div>
        
        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <button
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 rounded-lg"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Student
          </button>
        </div>
        
        {/* Student List */}
        <div className="space-y-4">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                className="glass-card rounded-xl p-4 hover:shadow-md transition-all"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                    {student.avatar ? (
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/reports?studentId=${student.id}`}
                      className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                      title="View Reports"
                    >
                      <FileText className="w-5 h-5" />
                    </Link>
                    <Link
                      to={`/analytics?studentId=${student.id}`}
                      className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                      title="View Analytics"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </Link>
                    <Link
                      to={`/learning-pathway?studentId=${student.id}`}
                      className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                      title="View Learning Pathway"
                    >
                      <BookOpen className="w-5 h-5" />
                    </Link>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass-card rounded-xl p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                  No students found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm
                    ? "No students match your search criteria. Try a different search term."
                    : "You don't have any students in your class yet."}
                </p>
                <button
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add First Student
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Students;
