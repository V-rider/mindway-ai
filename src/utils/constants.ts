
export const APP_CONFIG = {
  name: 'Mindway AI',
  description: 'Analytics & Insights',
  version: '1.0.0'
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  UPLOAD: '/upload',
  STUDENTS: '/students',
  STUDENT_PROFILE: '/students/profile',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
  LEARNING_PATHWAY: '/learning-pathway',
  E_LEARNING: '/e-learning',
  ACHIEVEMENTS: '/achievements',
  MATH_CHALLENGE: '/math-challenge'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student'
} as const;

export const STORAGE_KEYS = {
  SIDEBAR_OPEN: 'sidebar-open',
  THEME: 'theme',
  LANGUAGE: 'language'
} as const;
