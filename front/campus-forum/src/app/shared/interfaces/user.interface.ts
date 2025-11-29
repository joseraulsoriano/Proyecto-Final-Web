export enum UserRole {
  ADMIN = 'ADMIN',
  PROFESSOR = 'PROFESSOR',
  STUDENT = 'STUDENT'
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  profile_picture?: string;
  date_joined: string;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  role: UserRole.PROFESSOR | UserRole.STUDENT;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  profile_picture?: File;
}

