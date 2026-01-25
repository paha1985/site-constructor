export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  siteCount?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

