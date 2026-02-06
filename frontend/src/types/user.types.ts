export interface User {
  id: number;
  login: string;
  role_id: number;
  staff_id?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserData {
  role_id: number;
}

export interface DecodedToken {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}
