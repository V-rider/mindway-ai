
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  return { valid: true };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"'/\\]/g, '');
};

export const validateFileUpload = (file: File): { valid: boolean; message?: string } => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'File type not allowed. Please upload PDF, JPEG, PNG, or TXT files.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, message: 'File size too large. Maximum size is 10MB.' };
  }
  
  return { valid: true };
};
