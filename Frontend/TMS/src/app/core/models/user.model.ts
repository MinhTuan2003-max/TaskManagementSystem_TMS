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

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  lockedUsers: number;
  newUsersThisMonth: number;
  usersByRole: {
    admin: number;
    manager: number;
    user: number;
  }
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  enabled?: boolean;
  roles?: string[];
}

export interface UserPageResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  roles?: string[];
}

export interface ResetPasswordResponse {
  message: string;
  temporaryPassword: string;
}
