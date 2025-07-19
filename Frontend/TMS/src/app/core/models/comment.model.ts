import { User } from './user.model';
import { Task } from './task.model';

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  authorId: number;
  task?: Task;
  author?: User;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
  taskId: number;
}

export interface UpdateCommentRequest {
  content: string;
}
