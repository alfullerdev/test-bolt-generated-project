import { UserType } from '../types';

// Mock user data
const MOCK_USERS = {
  'admin@bev.merch.food': {
    password: 'Global@5991',
    type: 'admin' as UserType,
    name: 'Admin User'
  },
  'sharif@hawaiifest.com': {
    password: '3Sasdfm3221@@',
    type: 'admin' as UserType,
    name: 'Sharif Admin'
  },
  'vendor@example.com': {
    password: 'Vendor@123',
    type: 'vendor' as UserType,
    name: 'Test Vendor'
  }
};

export interface AuthResponse {
  type: UserType;
  user: any;
}

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = MOCK_USERS[email];
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }

  // Store auth in localStorage
  localStorage.setItem('auth', JSON.stringify({
    type: user.type,
    user: { email, name: user.name }
  }));

  return {
    type: user.type,
    user: { email, name: user.name }
  };
};

export const signOut = async () => {
  localStorage.removeItem('auth');
};

export const getCurrentUser = async (): Promise<AuthResponse | null> => {
  const auth = localStorage.getItem('auth');
  if (!auth) return null;
  
  return JSON.parse(auth);
};
