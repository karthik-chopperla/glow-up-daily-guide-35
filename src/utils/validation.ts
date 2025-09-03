// Input validation and sanitization utilities

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  
  if (email.length > 254) {
    return { isValid: false, error: "Email address is too long" };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: "Password is too long" };
  }
  
  // Check for complexity requirements
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return { 
      isValid: false, 
      error: "Password must include uppercase, lowercase, number, and special character" 
    };
  }
  
  return { isValid: true };
};

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }
  
  // International phone number regex
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return { isValid: false, error: "Please enter a valid phone number" };
  }
  
  return { isValid: true };
};

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: "Name is required" };
  }
  
  if (name.length < 1 || name.length > 100) {
    return { isValid: false, error: "Name must be between 1 and 100 characters" };
  }
  
  // Allow letters, spaces, apostrophes, and hyphens
  const nameRegex = /^[a-zA-Z\s\'\-]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: "Name can only contain letters, spaces, apostrophes, and hyphens" };
  }
  
  return { isValid: true };
};

export const validateUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url) {
    return { isValid: true }; // URL is optional
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Please enter a valid URL" };
  }
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
};

// Rate limiting helper for client-side
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get existing attempts for this key
    const keyAttempts = this.attempts.get(key) || [];
    
    // Filter out attempts outside the window
    const recentAttempts = keyAttempts.filter(time => time > windowStart);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  getRemainingTime(key: string, windowMs: number = 15 * 60 * 1000): number {
    const keyAttempts = this.attempts.get(key) || [];
    if (keyAttempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...keyAttempts);
    const remainingTime = (oldestAttempt + windowMs) - Date.now();
    
    return Math.max(0, remainingTime);
  }
}

export const authRateLimiter = new RateLimiter();

// Audit logging function
export const logSecurityEvent = async (eventType: string, eventData: any = {}) => {
  try {
    // Only log in production or when explicitly enabled
    if (process.env.NODE_ENV === 'development') {
      console.log('Security Event:', { eventType, eventData });
      return;
    }
    
    // Get basic client info
    const clientInfo = {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...eventData
    };
    
    // In a real app, send this to your security monitoring service
    console.log('Security Event Logged:', { eventType, ...clientInfo });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};