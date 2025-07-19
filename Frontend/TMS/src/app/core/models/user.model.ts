import { Role } from './role.model';

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Chỉ dùng khi tạo user
  fullName: string;
  avatarUrl?: string;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  roles: string[]; // Hoặc Role[] nếu muốn full object
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  roles: string[];
}

export interface MessageResponse {
  message: string;
}

