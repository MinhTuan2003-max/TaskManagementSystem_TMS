import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import {MemberInvitationComponent} from '../../components/member-invitation/member-invitation';
import {Project, ProjectMember} from '../../../../core/models';
import {InviteMemberRequest, ProjectStats} from '../../../../core/models/project-management.models';
import {ApiService} from '../../../../core/services/api.service';
import {NotificationService} from '../../../../core/services/notification.service';

@Component({
  selector: 'app-project-detail-container',
  template: `
    <div class="container mx-auto px-4 py-8" *ngIf="project">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-4">
              <button
                (click)="goBack()"
                class="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h1 class="text-3xl font-bold text-gray-900">{{ project.name }}</h1>
            </div>
            <p class="text-gray-600 mb-4">{{ project.description }}</p>

            <div class="flex items-center space-x-6 text-sm text-gray-500">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Tạo: {{ formatDate(project.createdAt) }}
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {{ members.length }} thành viên
              </div>
            </div>
          </div>

          <div class="flex space-x-3">
            <button
              (click)="showInviteMember = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Mời thành viên
            </button>
            <button
              (click)="viewTasks()"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              Xem Tasks
            </button>
          </div>
        </div>
      </div>

      <!-- Project Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" *ngIf="stats">
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-blue-600 mb-2">{{ stats.totalTasks }}</div>
          <div class="text-gray-500">Tổng Tasks</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">{{ stats.completedTasks }}</div>
          <div class="text-gray-500">Hoàn thành</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-yellow-600 mb-2">{{ stats.inProgressTasks }}</div>
          <div class="text-gray-500">Đang làm</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-red-600 mb-2">{{ stats.overdueTasks }}</div>
          <div class="text-gray-500">Quá hạn</div>
        </div>
      </div>

      <!-- Members List -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Thành viên dự án</h2>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành viên</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tham gia</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let member of members">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img
                      [src]="member.user?.avatarUrl || '/assets/default-avatar.png'"
                      [alt]="member.user?.fullName"
                      class="h-10 w-10 rounded-full mr-3">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ member.user?.fullName }}</div>
                      <div class="text-sm text-gray-500">{{ member.user?.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    [ngClass]="getRoleClass(member.role)">
                    {{ getRoleDisplay(member.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(member.joinedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    *ngIf="canManageMember(member)"
                    (click)="removeMember(member)"
                    class="text-red-600 hover:text-red-900">
                    Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Member Invitation Modal -->
      <div *ngIf="showInviteMember"
           class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative mx-auto p-4 max-w-2xl w-full">
          <app-member-invitation
            [projectId]="project.id"
            [isSubmitting]="isInviting"
            (submit)="onInviteMember($event)"
            (cancel)="showInviteMember = false">
          </app-member-invitation>
        </div>
      </div>
    </div>
  `,
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
    this.route.paramMap.pipe(
      switchMap(params => {
        this.projectId = +params.get('id')!;
        return this.apiService.getProject(this.projectId);
      })
    ).subscribe({
      next: (project) => {
        this.project = project;
        this.loadMembers();
        this.loadStats();
      },
      error: (error) => {
        this.notificationService.showError('Không thể tải thông tin dự án');
        this.goBack();
      }
    });
  }

  private loadMembers(): void {
    this.apiService.getProjectMembers(this.projectId).subscribe({
      next: (members) => {
        this.members = members;
      },
      error: (error) => {
        this.notificationService.showError('Không thể tải danh sách thành viên');
      }
    });
  }

  private loadStats(): void {
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
    this.isInviting = true;
    this.apiService.inviteMember(request).subscribe({
      next: () => {
        this.notificationService.showSuccess('Lời mời đã được gửi thành công');
        this.showInviteMember = false;
        this.loadMembers();
        this.isInviting = false;
      },
      error: (error) => {
        this.notificationService.showError('Không thể gửi lời mời');
        this.isInviting = false;
      }
    });
  }

  removeMember(member: ProjectMember): void {
    if (confirm(`Bạn có chắc muốn xóa ${member.user?.fullName} khỏi dự án?`)) {
      this.apiService.removeMember(this.projectId, member.userId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Đã xóa thành viên khỏi dự án');
          this.loadMembers();
        },
        error: (error) => {
          this.notificationService.showError('Không thể xóa thành viên');
        }
      });
    }
  }

  canManageMember(member: ProjectMember): boolean {
    // Logic to check if current user can manage this member
    return member.role !== 'OWNER'; // Can't remove project owner
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'OWNER': return 'bg-purple-100 text-purple-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      case 'MEMBER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleDisplay(role: string): string {
    switch (role) {
      case 'OWNER': return 'Chủ sở hữu';
      case 'MANAGER': return 'Quản lý';
      case 'MEMBER': return 'Thành viên';
      case 'VIEWER': return 'Người xem';
      default: return role;
    }
  }

  viewTasks(): void {
    this.router.navigate(['/projects', this.projectId, 'tasks']);
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('vi-VN');
  }
}
