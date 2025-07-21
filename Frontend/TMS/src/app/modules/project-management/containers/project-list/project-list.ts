import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectCardComponent } from '../../components/project-card/project-card';
import { Project } from '../../../../core/models';
import { ProjectStats } from '../../../../core/models/project-management.models';
import { ApiService } from '../../../../core/services/api.service';
import { ProjectFormComponent } from '../../components/project-form/project-form';
import { NotificationService } from '../../../../core/services/notification.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-project-list-container',
  templateUrl: './project-list.html',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, FormsModule]
})
export class ProjectListContainer implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  projectStats: Map<number, ProjectStats> = new Map();
  isLoading = false;

  viewMode: 'grid' | 'list' = 'grid';
  searchTerm = '';
  sortBy = 'name';
  showFilters = false;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjectStatsAsync(): void {
    setTimeout(() => {
      this.loadProjectStats();
    }, 100);
  }


  loadProjects(): void {
    this.isLoading = true;
    this.apiService.getMyProjects().subscribe({
      next: (projects) => {
        this.projects = projects.filter(p => p && p.id && !isNaN(p.id) && p.id > 0);
        this.filterProjects(); // Apply filters
        this.loadProjectStatsAsync();
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
          // Set default stats instead of failing
          this.projectStats.set(project.id, {
            totalTasks: 0,
            completedTasks: 0,
            inProgressTasks: 0,
            overdueTasks: 0,
            activeMembers: 0
          });
        }
      });
    });
  }

  onEditProject(project: Project): void {
    if (!project || !project.id) {
      this.notificationService.showError('Dự án không hợp lệ');
      return;
    }
    this.router.navigate(['/projects', project.id, 'edit']);
  }

  navigateToCreateProject(): void {
    this.router.navigate(['/projects/create']);
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
    const id = Number(project?.id);
    if (!id || isNaN(id) || id <= 0) {
      this.notificationService.showError('ID dự án không hợp lệ');
      return;
    }
    this.router.navigate(['/projects', id]);
  }


  getProjectStats(projectId: number): ProjectStats | undefined {
    if (!projectId || isNaN(projectId)) {
      return undefined;
    }

    return this.projectStats.get(projectId);
  }

  onSearch(): void {
    this.filterProjects();
  }

  onSort(): void {
    this.filterProjects();
  }

  private filterProjects(): void {
    let filtered = [...this.projects];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

    this.filteredProjects = filtered;
  }

  getProgressPercentage(projectId: number): number {
    const stats = this.getProjectStats(projectId);
    if (!stats || stats.totalTasks === 0) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  canEditProject(project: Project): boolean {
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

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard/owner']);
  }

}
