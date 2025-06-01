
import React, { createContext, useState, useContext, useEffect } from "react";
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

// Mock student data
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
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: User[] = [
        {
          id: "1",
          name: "Student User",
          email: "student@example.com",
          role: "student",
          avatar: "/lovable-uploads/8ee1bdd6-bfc2-4782-a9d1-7ba12b2146e7.png",
          classId: "class-1"
        },
        {
          id: "2",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          avatar: "/lovable-uploads/7aff8652-12ca-4080-b580-d23a64527cd3.png",
          classId: "class-1"
        }
      ];
      
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // If admin, load students in their class
      if (foundUser.role === "admin" && foundUser.classId) {
        setStudents(mockStudents.filter(student => student.classId === foundUser.classId));
      }
      
      // Store in localStorage for persistence
      localStorage.setItem("pathwayUser", JSON.stringify(foundUser));
      setUser(foundUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
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
