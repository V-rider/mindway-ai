
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  BarChart3,
  BookOpen,
  FileText,
  X,
  GraduationCap,
  Mail,
  UserCheck
} from "lucide-react";
import { classApi } from "@/lib/api/classes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Students = () => {
  const { isAdmin, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  
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
          console.log('Fetching students for class ID:', classItem.class_id);
          const classStudents = await classApi.getStudentsByClass(classItem.class_id);
          console.log('Students in class', classItem.class_name, ':', classStudents);
          
          // Add class name to each student for display
          const studentsWithClassName = classStudents.map(student => ({
            ...student,
            className: classItem.class_name
          }));
          
          allStudents.push(...studentsWithClassName);
        }
        
        console.log('All students found:', allStudents);
        
        // Transform students data to match expected format
        const formattedStudents = allStudents.map(student => ({
          id: student.SID.toString(),
          name: student.name || '',
          email: student.email || '',
          className: student.className || 'Unknown Class'
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

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'ST';
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
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-2"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              Students
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor all students in your classes
            </p>
          </div>
          
          {/* Stats Card */}
          <Card className="min-w-[200px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{students.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
              
              {/* Search Results Info */}
              {searchTerm && (
                <Badge variant="secondary" className="text-sm">
                  {filteredStudents.length} of {students.length} students
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Students Table */}
        {filteredStudents.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Student Directory
              </CardTitle>
              <CardDescription>
                Complete list of students in your classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]"></TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {student.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {student.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {student.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
                          {student.className}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/reports?studentId=${student.id}`}
                            className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            title="View Reports"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/analytics?studentId=${student.id}`}
                            className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            title="View Analytics"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/learning-pathway?studentId=${student.id}`}
                            className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            title="View Learning Pathway"
                          >
                            <BookOpen className="w-4 h-4" />
                          </Link>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                  {searchTerm ? "No students found" : "No students available"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  {searchTerm
                    ? `No students match "${searchTerm}". Try a different search term.`
                    : "You don't have any students in your classes yet."}
                </p>
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm("")}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Students;
