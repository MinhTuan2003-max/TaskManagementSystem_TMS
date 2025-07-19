import {User} from './user.model';

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface UserRole {
  userId: number;
  roleId: number;
  user?: User;
  role?: Role;
}
