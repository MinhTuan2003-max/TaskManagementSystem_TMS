import { User } from './user.model';
import { Project } from './project.model';
import { Comment } from './comment.model';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: string;
  projectId: number;
  assigneeId?: number;
  creatorId: number;
  project?: Project;
  assignee?: User;
  creator?: User;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  deadline?: string;
  projectId: number;
  assigneeId?: number;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  deadline?: string;
  projectId: number;
  assigneeId?: number;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface KanbanBoard {
  todoTasks: Task[];
  inProgressTasks: Task[];
  doneTasks: Task[];
}
