// Define types and interfaces
interface User {
    password: string;
    role: UserRole;
    name: string;
  }
  
  interface UserData {
    role: UserRole;
    name: string;
    username: string;
  }
  
  type UserRole = 'admin' | 'user';
  
  interface AuthSuccess {
    success: true;
    user: UserData;
  }
  
  interface AuthError {
    success: false;
    error: string;
  }
  
  type AuthResult = AuthSuccess | AuthError;
  
  // Type-safe user records
  const USERS: Record<string, User> = {
    'Admin@123': {
      password: 'admin123',
      role: 'admin',
      name: 'Admin User',
    },
    'UserVi@123': {
      password: 'user123',
      role: 'user',
      name: 'Regular User',
    },
  };
  
  /**
   * Validate user credentials
   * @param username - User's email/username
   * @param password - User's password
   * @returns User data or null if invalid
   */
  export function validateCredentials(
    username: string,
    password: string
  ): UserData | null {
    const user = USERS[username];
    if (user && user.password === password) {
      // Don't send password back in the response
      const { password: _, ...userData } = user;
      return { ...userData, username };
    }
    return null;
  }
  
  /**
   * Check if user is authenticated
   * @returns Boolean indicating authentication status
   */
  export function checkAuth(): boolean {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('user_session');
      return !!session;
    }
    return false;
  }
  
  /**
   * Get current user data
   * @returns Current user data or null if not authenticated
   */
  export function getCurrentUser(): UserData | null {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('user_session');
      try {
        return session ? (JSON.parse(session) as UserData) : null;
      } catch (error) {
        console.error('Error parsing user session:', error);
        return null;
      }
    }
    return null;
  }
  
  /**
   * Login user
   * @param username - User's email/username
   * @param password - User's password
   * @returns Authentication result with success status and user data or error
   */
  export function loginUser(username: string, password: string): AuthResult {
    try {
      const userData = validateCredentials(username, password);
  
      if (userData) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_session', JSON.stringify(userData));
        }
        return { success: true, user: userData };
      }
  
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { 
        success: false, 
        error: `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Logout user
   * @throws Error if logout fails
   */
  export function logoutUser(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_session');
      }
    } catch (error) {
      throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Check if user has specific role
   * @param requiredRole - Role to check for
   * @returns Boolean indicating if user has the required role
   */
  export function hasRole(requiredRole: UserRole): boolean {
    const user = getCurrentUser();
    return user?.role === requiredRole;
  }