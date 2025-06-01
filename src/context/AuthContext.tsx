import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { auth } from '@/lib/auth/auth';
import { mockAuth } from '@/lib/auth/mockAuth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData?: { full_name?: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for mock user first
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      const userData = JSON.parse(mockUser);
      // Create a mock User object that matches Supabase's User interface
      const mockUserObj: User = {
        id: userData.id,
        email: userData.email,
        user_metadata: { role: userData.role, full_name: userData.full_name },
        app_metadata: { role: userData.role },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        role: 'authenticated',
        updated_at: new Date().toISOString(),
        confirmation_sent_at: null,
        confirmed_at: null,
        email_confirmed_at: null,
        invited_at: null,
        last_sign_in_at: null,
        phone: null,
        recovery_sent_at: null
      };
      setUser(mockUserObj);
      setIsLoading(false);
      return;
    }

    // Set up auth state listener for real Supabase auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Check if it's a demo account first
      if ((email === 'admin@example.com' || email === 'student@example.com') && password === 'password') {
        const mockUser = await mockAuth.signIn(email, password);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        
        // Create a mock User object
        const mockUserObj: User = {
          id: mockUser.id,
          email: mockUser.email,
          user_metadata: { role: mockUser.role, full_name: mockUser.full_name },
          app_metadata: { role: mockUser.role },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          role: 'authenticated',
          updated_at: new Date().toISOString(),
          confirmation_sent_at: null,
          confirmed_at: null,
          email_confirmed_at: null,
          invited_at: null,
          last_sign_in_at: null,
          phone: null,
          recovery_sent_at: null
        };
        setUser(mockUserObj);
        console.log('Mock login successful:', mockUser);
        return;
      }

      // Otherwise use real Supabase auth
      const profile = await auth.signIn(email, password);
      console.log('Login successful:', profile);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData?: { full_name?: string }): Promise<void> => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) throw error;
      
      console.log('Signup successful:', data);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear mock user if it exists
      localStorage.removeItem('mockUser');
      
      // Also sign out from Supabase
      await auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Determine if user is admin by checking their role in user metadata
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';

  const contextValue: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
