
import React, { createContext, useState, useContext, useEffect } from "react";
import { multiProjectAuth } from "@/lib/auth/multi-project-auth";
import { dynamicSupabase } from "@/lib/supabase/dynamic-client";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  students: User[];
  currentProject: string | null;
  currentDomain: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  students: [],
  currentProject: null,
  currentDomain: null
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
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);

  useEffect(() => {
    // Initialize from localStorage and restore project context
    const initializeAuth = async () => {
      try {
        // Try to restore project from storage first
        dynamicSupabase.initializeFromStorage();
        
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem("pathwayUser");
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setCurrentProject(parsedUser.project || null);
          setCurrentDomain(parsedUser.domain || null);
          
          // If admin, load students in their class
          if (parsedUser.role === "admin" && parsedUser.classId) {
            setStudents(mockStudents.filter(student => student.classId === parsedUser.classId));
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log("Attempting multi-project login with email:", email);
      
      const userResult = await multiProjectAuth.signIn(email, password);
      const project = multiProjectAuth.getCurrentProject();
      
      console.log("Multi-project login successful:", userResult);
      
      const userObj: User = {
        id: userResult.id,
        name: userResult.name,
        email: userResult.email,
        role: userResult.role,
        avatar: userResult.role === "admin" 
          ? "/lovable-uploads/7aff8652-12ca-4080-b580-d23a64527cd3.png"
          : "/lovable-uploads/8ee1bdd6-bfc2-4782-a9d1-7ba12b2146e7.png",
        classId: userResult.classId,
        project: userResult.project,
        domain: userResult.domain
      };
      
      // If admin, load students in their class
      if (userObj.role === "admin" && userObj.classId) {
        setStudents(mockStudents.filter(student => student.classId === userObj.classId));
      }
      
      localStorage.setItem("pathwayUser", JSON.stringify(userObj));
      setUser(userObj);
      setCurrentProject(project?.projectName || null);
      setCurrentDomain(project?.domain || null);
      
    } catch (error) {
      console.error("Multi-project login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    multiProjectAuth.signOut();
    setUser(null);
    setStudents([]);
    setCurrentProject(null);
    setCurrentDomain(null);
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
        students,
        currentProject,
        currentDomain
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
