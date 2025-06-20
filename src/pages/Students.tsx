
import React, { useState, useEffect } from "react";
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
  X
} from "lucide-react";
import { classApi } from "@/lib/api/classes";

const Students = () => {
  const { isAdmin, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Fetch students for the teacher's classes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.email) {
        console.log('No user email available');
        setError('No user email available');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Starting to fetch students for user:', user.email);
        setLoading(true);
        setError(null);
        
        const teacherData = await classApi.getTeacherClasses(user.email);
        console.log('Teacher data received:', teacherData);
        
        if (!teacherData.classes || teacherData.classes.length === 0) {
          console.log('No classes found for teacher');
          setStudents([]);
          setLoading(false);
          return;
        }
        
        // Get all students from all teacher's classes
        const allStudents = [];
        for (const classItem of teacherData.classes) {
          console.log('Fetching students for class:', classItem.class_name);
          const classStudents = await classApi.getStudentsByClass(classItem.class_name);
          console.log('Students in class', classItem.class_name, ':', classStudents);
          allStudents.push(...classStudents);
        }
        
        console.log('All students found:', allStudents);
        
        // Transform students data to match expected format
        const formattedStudents = allStudents.map(student => ({
          id: student.SID.toString(),
          name: student.name,
          email: student.email,
          className: student.class || 'Unknown Class'
        }));
        
        console.log('Formatted students:', formattedStudents);
        setStudents(formattedStudents);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(`Failed to load students: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user?.email]);
  
  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Students
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Loading students...
            </p>
          </div>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Students
            </h1>
            <p className="text-red-600 mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Students
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor all students in your classes ({students.length} total).
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
              placeholder="Search students by name, email, or class..."
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
                    <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.email}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      Class: {student.className}
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
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm
                    ? "No students match your search criteria. Try a different search term."
                    : "You don't have any students in your classes yet."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Students;
