import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectCardComponent } from '../../components/project-card/project-card';
import { Project } from '../../../../core/models';
import { ProjectFormData, ProjectStats } from '../../../../core/models/project-management.models';
import { ApiService } from '../../../../core/services/api.service';
import { ProjectFormComponent } from '../../components/project-form/project-form';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-project-list-container',
  templateUrl: './project-list.html',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, ProjectFormComponent]
})
export class ProjectListContainer implements OnInit {
  projects: Project[] = [];
  projectStats: Map<number, ProjectStats> = new Map();
  isLoading = false;
  isSubmitting = false;
  showForm = false;
  selectedProject?: Project;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.apiService.getMyProjects().subscribe({
      next: (projects) => {
        console.log('Raw projects data:', projects);

        this.projects = projects.filter(p => {
          const isValid = p && p.id && !isNaN(p.id) && p.id > 0;
          if (!isValid) {
            console.warn('Invalid project filtered out:', p);
          }
          return isValid;
        });

        console.log('Valid projects loaded:', this.projects.length);
        this.loadProjectStats();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.notificationService.showError('Không thể tải danh sách dự án');
        this.isLoading = false;
      }
    });
  }

  private loadProjectStats(): void {
    this.projects.forEach(project => {
      if (!project.id || isNaN(project.id)) {
        console.error('Invalid project ID for stats:', project.id);
        return;
      }

      this.apiService.getProjectStats(project.id).subscribe({
        next: (stats) => {
          this.projectStats.set(project.id, stats);
        },
        error: (error) => {
          console.error(`Failed to load stats for project ${project.id}`, error);
        }
      });
    });
  }

  toggleCreateForm(): void {
    this.selectedProject = undefined;
    this.showForm = !this.showForm;
  }

  onFormSubmit(formData: ProjectFormData): void {
    console.log('Submitting project form:', formData);

    if (!formData.name || formData.name.trim().length < 3) {
      this.notificationService.showError('Tên dự án phải có ít nhất 3 ký tự');
      return;
    }

    this.isSubmitting = true;

    const operation = this.selectedProject
      ? this.apiService.updateProject(this.selectedProject.id, formData)
      : this.apiService.createProject(formData);

    operation.subscribe({
      next: (project) => {
        console.log('Project operation success:', project);

        const message = this.selectedProject
          ? 'Dự án đã được cập nhật thành công'
          : 'Dự án mới đã được tạo thành công';

        this.notificationService.showSuccess(message);
        this.loadProjects();
        this.onFormCancel();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Project operation error:', error);
        console.error('Error details:', error.error);

        const errorMessage = error.error?.message || 'Có lỗi xảy ra khi xử lý dự án';
        this.notificationService.showError(errorMessage);
        this.isSubmitting = false;
      }
    });
  }

  onFormCancel(): void {
    this.showForm = false;
    this.selectedProject = undefined;
  }

  onEditProject(project: Project): void {
    if (!project || !project.id) {
      this.notificationService.showError('Dự án không hợp lệ');
      return;
    }

    this.selectedProject = project;
    this.showForm = true;
  }

  onDeleteProject(project: Project): void {
    if (!project || !project.id) {
      this.notificationService.showError('Dự án không hợp lệ');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa dự án "${project.name}"?`)) {
      return;
    }

    this.apiService.deleteProject(project.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Dự án đã được xóa thành công');
        this.loadProjects();
      },
      error: (error) => {
        console.error('Delete project error:', error);
        const errorMessage = error.error?.message || 'Không thể xóa dự án';
        this.notificationService.showError(errorMessage);
      }
    });
  }

  onViewDetail(project: Project): void {
    if (!project?.id || isNaN(project.id)) {
      console.error('Invalid project for detail view:', project);
      this.notificationService.showError('Dự án không có ID hợp lệ');
      return;
    }

    console.log('Navigating to project detail:', project.id); // ✅ Debug log
    this.router.navigate(['/projects', project.id]);
  }

  getProjectStats(projectId: number): ProjectStats | undefined {
    if (!projectId || isNaN(projectId)) {
      return undefined;
    }

    return this.projectStats.get(projectId);
  }

  canEditProject(project: Project): boolean {
    // ✅ Basic validation + future role-based logic
    if (!project || !project.id) {
      return false;
    }

    // TODO: Implement role-based logic
    // Example: return this.authService.canManageProject(project);
    return true;
  }

  canDeleteProject(project: Project): boolean {
    if (!project || !project.id) {
      return false;
    }

    // TODO: Implement role-based logic
    // Example: return this.authService.canDeleteProject(project);
    return true;
  }

  refreshProjectStats(projectId: number): void {
    if (!projectId || isNaN(projectId)) {
      return;
    }

    this.apiService.getProjectStats(projectId).subscribe({
      next: (stats) => {
        this.projectStats.set(projectId, stats);
      },
      error: (error) => {
        console.error(`Failed to refresh stats for project ${projectId}`, error);
      }
    });
  }

  get hasValidProjects(): boolean {
    return this.projects.length > 0;
  }

  get loadingMessage(): string {
    return this.isLoading ? 'Đang tải danh sách dự án...' : '';
  }
}
