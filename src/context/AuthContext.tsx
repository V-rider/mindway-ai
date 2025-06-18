
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  students: User[];
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  students: []
});

// Mock student data for admin users
const mockStudents: User[] = [
  {
    id: "3",
    name: "Alex Chen",
    email: "alex@example.com",
    role: "student",
    avatar: "/lovable-uploads/8ee1bdd6-bfc2-4782-a9d1-7ba12b2146e7.png",
    classId: "class-1"
  },
  {
    id: "4",
    name: "Sarah Wong",
    email: "sarah@example.com",
    role: "student",
    avatar: "/lovable-uploads/8ee1bdd6-bfc2-4782-a9d1-7ba12b2146e7.png",
    classId: "class-1"
  },
  {
    id: "5",
    name: "Michael Lee",
    email: "michael@example.com",
    role: "student",
    avatar: "/lovable-uploads/8ee1bdd6-bfc2-4782-a9d1-7ba12b2146e7.png",
    classId: "class-1"
  },
  {
    id: "6",
    name: "Emily Tan",
    email: "emily@example.com",
    role: "student",
    avatar: "/lovable-uploads/8ee1bdd6-bfc2-4782-a9d1-7ba12b2146e7.png",
    classId: "class-2"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("pathwayUser");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // If admin, load students in their class
      if (parsedUser.role === "admin" && parsedUser.classId) {
        setStudents(mockStudents.filter(student => student.classId === parsedUser.classId));
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log("Attempting login with email:", email);
      console.log("Password length:", password?.length || 0);
      
      // First, try to find the user in the Students table
      console.log("Querying Students table...");
      const { data: studentData, error: studentError } = await supabase
        .from('Students')
        .select('*')
        .eq('email', email)
        .eq('password', password);

      console.log("Student query result:", { 
        data: studentData, 
        error: studentError,
        count: studentData?.length || 0 
      });

      if (studentError) {
        console.error("Student query error:", studentError);
      }

      if (!studentError && studentData && studentData.length > 0) {
        const student = studentData[0];
        console.log("Student found:", student);
        const userObj: User = {
          id: student.sid,
          name: student.name,
          email: student.email,
          role: "student",
          avatar: "/lovable-uploads/8ee1bdd6-bfc2-4782-a9d1-7ba12b2146e7.png",
          classId: student.class
        };
        
        localStorage.setItem("pathwayUser", JSON.stringify(userObj));
        setUser(userObj);
        setIsLoading(false);
        return;
      }

      // If not found in Students, try Teachers table
      console.log("Querying Teachers table...");
      const { data: teacherData, error: teacherError } = await supabase
        .from('Teachers')
        .select('*')
        .eq('email', email)
        .eq('password', password);

      console.log("Teacher query result:", { 
        data: teacherData, 
        error: teacherError,
        count: teacherData?.length || 0 
      });

      if (teacherError) {
        console.error("Teacher query error:", teacherError);
      }

      if (!teacherError && teacherData && teacherData.length > 0) {
        const teacher = teacherData[0];
        console.log("Teacher found:", teacher);
        const userObj: User = {
          id: teacher.email, // Using email as ID since no specific ID field
          name: teacher.name,
          email: teacher.email,
          role: "admin",
          avatar: "/lovable-uploads/7aff8652-12ca-4080-b580-d23a64527cd3.png",
          classId: teacher.classes
        };
        
        // If admin, load students in their class
        setStudents(mockStudents.filter(student => student.classId === teacher.classes));
        
        localStorage.setItem("pathwayUser", JSON.stringify(userObj));
        setUser(userObj);
        setIsLoading(false);
        return;
      }

      // If neither student nor teacher found, throw error
      console.log("No user found with provided credentials");
      console.log("Email searched:", email);
      console.log("Password searched:", password);
      throw new Error("Invalid email or password");
      
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("pathwayUser");
    setUser(null);
    setStudents([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        students
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
