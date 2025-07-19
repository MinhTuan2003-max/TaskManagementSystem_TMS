export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  recipientId: number;
  actorId?: number;
  entityType?: EntityType;
  entityId?: number;
  actionType?: string;
  metadata?: string;
  actor?: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  PROJECT_MEMBER_ADDED = 'PROJECT_MEMBER_ADDED'
}

export enum EntityType {
  TASK = 'TASK',
  PROJECT = 'PROJECT',
  COMMENT = 'COMMENT',
  USER = 'USER'
}

export interface NotificationPage {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
