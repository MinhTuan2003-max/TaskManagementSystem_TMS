import { User } from './user.model';
import { Task } from './task.model';
import { ProjectMember } from './project-member.model';

export interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  owner?: User;
  tasks?: Task[];
  members?: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface UpdateProjectRequest {
  name: string;
  description: string;
}
