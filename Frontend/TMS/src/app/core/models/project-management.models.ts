export interface ProjectFormData {
  name: string;
  description: string;
}

export interface InviteMemberRequest {
  projectId: number;
  userId: number;
  role: ProjectRole;
}

export interface ProjectMemberInvitation {
  id?: number;
  projectId: number;
  inviteeEmail?: string;
  inviteeUserId?: number;
  role: ProjectRole;
  status: InvitationStatus;
  invitedBy: number;
  createdAt?: string;
  expiresAt?: string;
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED'
}

export enum ProjectRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER'
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  activeMembers: number;
}
