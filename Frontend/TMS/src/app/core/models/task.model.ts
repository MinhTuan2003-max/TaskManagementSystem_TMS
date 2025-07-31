// interfaces/task.interface.ts
import {Project} from './project.model';
import {User} from './user.model';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  deadline: string;
  projectId: number;
  assigneeId?: number;
  creatorId: number;
  createdAt: string;
  updatedAt: string;

  // Populated objects
  project?: Project;
  assignee?: User;
  creator?: User;
  comments?: Comment[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  deadline?: string;
  projectId: number;
  assigneeId?: number;
}

export interface KanbanBoard {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}

export interface TaskSearchFilters {
  keyword?: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: number;
  projectId?: number;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  deadline?: string | null;
  assigneeId?: number | null;
  projectId: number;  // Thường projectId không đổi, nhưng tùy yêu cầu bạn có thể loại bỏ
}

export interface UpdateTaskStatusRequest {
  status: string;  // hoặc enum, nếu bạn có enum status trong TS
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}
