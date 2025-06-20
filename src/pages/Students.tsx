
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
  X,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { classApi } from "@/lib/api/classes";

const Students = () => {
  const { isAdmin, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [expandedClasses, setExpandedClasses] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("students"); // "students" or "classes"
  
  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Fetch students and classes for the teacher
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) {
        console.log('No user email available');
        setError('No user email available');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Starting to fetch data for user:', user.email);
        setLoading(true);
        setError(null);
        
        const teacherData = await classApi.getTeacherClasses(user.email);
        console.log('Teacher data received:', teacherData);
        
        if (!teacherData.classes || teacherData.classes.length === 0) {
          console.log('No classes found for teacher');
          setStudents([]);
          setClasses([]);
          setLoading(false);
          return;
        }
        
        // Get all students from all teacher's classes and organize by class
        const allStudents = [];
        const classesWithStudents = [];
        
        for (const classItem of teacherData.classes) {
          console.log('Fetching students for class ID:', classItem.class_id);
          const classStudents = await classApi.getStudentsByClass(classItem.class_id);
          console.log('Students in class', classItem.class_name, ':', classStudents);
          
          // Add class name to each student for display
          const studentsWithClassName = classStudents.map(student => ({
            ...student,
            className: classItem.class_name
          }));
          
          allStudents.push(...studentsWithClassName);
          
          // Create class object with students
          classesWithStudents.push({
            id: classItem.class_id,
            name: classItem.class_name,
            academic_year: classItem.academic_year,
            students: classStudents.map(student => ({
              id: student.SID.toString(),
              name: student.name || '',
              email: student.email || '',
              classId: student.class_id
            }))
          });
        }
        
        console.log('All students found:', allStudents);
        console.log('Classes with students:', classesWithStudents);
        
        // Transform students data to match expected format
        const formattedStudents = allStudents.map(student => ({
          id: student.SID.toString(),
          name: student.name || '',
          email: student.email || '',
          className: student.className || 'Unknown Class'
        }));
        
        console.log('Formatted students:', formattedStudents);
        setStudents(formattedStudents);
        setClasses(classesWithStudents);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email]);
  
  // Filter students based on search term - case insensitive and handles empty values
  const filteredStudents = students.filter(student => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    const name = (student.name || '').toLowerCase();
    const email = (student.email || '').toLowerCase();
    const className = (student.className || '').toLowerCase();
    
    return name.includes(searchLower) || 
           email.includes(searchLower) || 
           className.includes(searchLower);
  });

  // Filter classes based on search term
  const filteredClasses = classes.filter(classItem => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    const className = (classItem.name || '').toLowerCase();
    const academicYear = (classItem.academic_year || '').toLowerCase();
    
    // Also search through students in the class
    const hasMatchingStudent = classItem.students.some(student => {
      const name = (student.name || '').toLowerCase();
      const email = (student.email || '').toLowerCase();
      return name.includes(searchLower) || email.includes(searchLower);
    });
    
    return className.includes(searchLower) || 
           academicYear.includes(searchLower) ||
           hasMatchingStudent;
  });

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Toggle class expansion
  const toggleClassExpansion = (classId) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(classId)) {
      newExpanded.delete(classId);
    } else {
      newExpanded.add(classId);
    }
    setExpandedClasses(newExpanded);
  };
  
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
            Manage and monitor all students in your classes ({students.length} total students across {classes.length} classes).
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("students")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "students"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              All Students
            </button>
            <button
              onClick={() => setViewMode("classes")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "classes"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              By Classes
            </button>
          </div>
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
              placeholder={viewMode === "students" ? "Search students by name, email, or class..." : "Search classes or students..."}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Search Results Info */}
          {searchTerm && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {viewMode === "students" 
                ? `Showing ${filteredStudents.length} of ${students.length} students`
                : `Showing ${filteredClasses.length} of ${classes.length} classes`
              }
            </div>
          )}
        </div>
        
        {/* Content based on view mode */}
        {viewMode === "students" ? (
          /* Student List View */
          <div className="space-y-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  className="glass-card rounded-xl p-4 hover:shadow-md transition-all"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
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
                    {searchTerm ? "No students found" : "No students available"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm
                      ? `No students match "${searchTerm}". Try a different search term.`
                      : "You don't have any students in your classes yet."}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="mt-4 px-4 py-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Classes View */
          <div className="space-y-4">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((classItem) => (
                <motion.div
                  key={classItem.id}
                  className="glass-card rounded-xl p-6 hover:shadow-md transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {classItem.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Academic Year: {classItem.academic_year}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        {classItem.students.length} students enrolled
                      </p>
                    </div>
                    <button
                      onClick={() => toggleClassExpansion(classItem.id)}
                      className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                      {expandedClasses.has(classItem.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Expanded student list */}
                  {expandedClasses.has(classItem.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-200 dark:border-gray-700 pt-4"
                    >
                      <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                        Students in this class:
                      </h4>
                      {classItem.students.length > 0 ? (
                        <div className="grid gap-3">
                          {classItem.students.map((student) => (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                                  <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-100">
                                    {student.name}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {student.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/reports?studentId=${student.id}`}
                                  className="p-1.5 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                                  title="View Reports"
                                >
                                  <FileText className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/analytics?studentId=${student.id}`}
                                  className="p-1.5 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                                  title="View Analytics"
                                >
                                  <BarChart3 className="w-4 h-4" />
                                </Link>
                                <Link
                                  to={`/learning-pathway?studentId=${student.id}`}
                                  className="p-1.5 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                                  title="View Learning Pathway"
                                >
                                  <BookOpen className="w-4 h-4" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                          No students enrolled in this class yet.
                        </p>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="glass-card rounded-xl p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    {searchTerm ? "No classes found" : "No classes available"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm
                      ? `No classes match "${searchTerm}". Try a different search term.`
                      : "You don't have any classes assigned yet."}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="mt-4 px-4 py-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Students;
