import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MemberInvitationComponent } from '../../components/member-invitation/member-invitation';
import { Project, ProjectMember } from '../../../../core/models';
import { InviteMemberRequest, ProjectStats, ProjectRole } from '../../../../core/models/project-management.models';
import { ApiService } from '../../../../core/services/api.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-project-detail-container',
  templateUrl: './project-detail.html',
  standalone: true,
  imports: [CommonModule, MemberInvitationComponent]
})
export class ProjectDetailContainer implements OnInit {
  project?: Project;
  members: ProjectMember[] = [];
  stats?: ProjectStats;
  showInviteMember = false;
  isInviting = false;
  projectId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const idParam = params.get('id');
          const id = Number(idParam);

          if (!idParam || isNaN(id) || id <= 0) {
            this.notificationService.showError('ID dự án không hợp lệ');
            this.goBack();
            throw new Error('Invalid project id');
          }

          this.projectId = id;
          return this.apiService.getProject(id);
        })
      )
      .subscribe({
        next: project => {
          this.project = project;
          if (!this.projectId && project.id) {
            this.projectId = project.id;
          }
          this.loadMembers();
          this.loadStats();
        },
        error: () => {
          this.notificationService.showError('Không thể tải thông tin dự án');
          this.goBack();
        }
      });
  }

  private loadMembers(): void {
    if (!this.projectId) {
      console.error('ProjectId is not set');
      return;
    }

    this.apiService.getProjectMembers(this.projectId).subscribe({
      next: (members) => {
        this.members = members;
      },
      error: (error) => {
        console.error('Load members error:', error);
        this.notificationService.showError('Không thể tải danh sách thành viên');
      }
    });
  }

  private loadStats(): void {
    if (!this.projectId) {
      console.error('ProjectId is not set');
      return;
    }

    this.apiService.getProjectStats(this.projectId).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Failed to load project stats', error);
      }
    });
  }

  onInviteMember(request: InviteMemberRequest): void {
    console.log('Inviting member with request:', request);

    this.isInviting = true;
    this.apiService.inviteMember(request).subscribe({
      next: (member) => {
        console.log('Member invited successfully:', member);
        this.notificationService.showSuccess('Lời mời đã được gửi thành công');
        this.showInviteMember = false;
        this.loadMembers();
        this.isInviting = false;
      },
      error: (error) => {
        console.error('Invite member error:', error);
        console.error('Error status:', error.status);
        console.error('Error details:', error.error);

        this.isInviting = false;

        let errorMessage = 'Không thể gửi lời mời';

        if (error.status === 404) {
          errorMessage = 'API endpoint không tồn tại. Vui lòng kiểm tra backend.';
        } else if (error.status === 400) {
          const backendMessage = error.error?.message || '';
          if (backendMessage.includes('already')) {
            errorMessage = 'Người dùng đã là thành viên của dự án này';
          } else {
            errorMessage = `Dữ liệu không hợp lệ: ${backendMessage}`;
          }
        } else if (error.status === 403) {
          errorMessage = 'Bạn không có quyền mời thành viên';
        }

        this.notificationService.showError(errorMessage);
      }
    });
  }

  removeMember(member: ProjectMember): void {
    if (!member.user || !member.user.id) {
      this.notificationService.showError('Thông tin thành viên không hợp lệ');
      return;
    }

    if (confirm(`Bạn có chắc muốn xóa ${member.user.fullName} khỏi dự án?`)) {
      this.apiService.removeMember(this.projectId, member.user.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Đã xóa thành viên khỏi dự án');
          this.loadMembers();
        },
        error: (error) => {
          console.error('Remove member error:', error);
          this.notificationService.showError('Không thể xóa thành viên');
        }
      });
    }
  }

  canManageMember(member: ProjectMember): boolean {
    if (!member || !member.role) return false;

    const role = String(member.role).toUpperCase();
    return role !== 'ADMIN';
  }

  getRoleClass(role: ProjectRole | string): string {
    if (!role) return 'bg-gray-100 text-gray-800';

    const roleStr = String(role).toUpperCase();
    switch (roleStr) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      case 'MEMBER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleDisplay(role: ProjectRole | string): string {
    if (!role) return 'Không xác định';

    const roleStr = String(role).toUpperCase();
    switch (roleStr) {
      case 'ADMIN': return 'Quản trị viên';
      case 'MANAGER': return 'Quản lý';
      case 'MEMBER': return 'Thành viên';
      default: return String(role);
    }
  }

  viewTasks(): void {
    this.router.navigate(['/projects', this.projectId, 'tasks']);
  }

  goBack(): void {
    this.router.navigate(['/projects/list']);
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getUserId(member: ProjectMember): number | null {
    return member?.user?.id || null;
  }

  getUserName(member: ProjectMember): string {
    return member?.user?.fullName || 'Không xác định';
  }

  getUserEmail(member: ProjectMember): string {
    return member?.user?.email || '';
  }
}
