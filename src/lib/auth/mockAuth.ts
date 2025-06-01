
// Mock authentication for demo accounts
interface MockUser {
  id: string;
  email: string;
  role: 'admin' | 'student';
  full_name: string;
}

const mockUsers: MockUser[] = [
  {
    id: 'admin-demo-id',
    email: 'admin@example.com',
    role: 'admin',
    full_name: 'Admin User'
  },
  {
    id: 'student-demo-id',
    email: 'student@example.com',
    role: 'student',
    full_name: 'Student User'
  }
];

export const mockAuth = {
  async signIn(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password') {
      throw new Error('Invalid credentials');
    }
    
    return user;
  },

  async signUp(email: string, password: string, userData: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, just return success
    return {
      id: 'new-user-id',
      email,
      role: 'student',
      full_name: userData.full_name || ''
    };
  },

  async signOut() {
    // Clear any stored auth data
    localStorage.removeItem('mockUser');
  }
};
