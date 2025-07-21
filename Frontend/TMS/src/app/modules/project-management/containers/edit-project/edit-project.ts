import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { switchMap } from 'rxjs';
import { ProjectFormComponent } from '../../components/project-form/project-form';
import { Project } from '../../../../core/models';
import { ProjectFormData } from '../../../../core/models/project-management.models';
import { ApiService } from '../../../../core/services/api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {DateFormatPipe} from '../../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-edit-project-container',
  templateUrl: './edit-project.html',
  standalone: true,
  imports: [CommonModule, ProjectFormComponent, RouterLink],
  providers: [DateFormatPipe]
})
export class EditProjectContainer implements OnInit {
  project?: Project;
  originalProject?: Project;
  projectId!: number;
  isLoading = false;
  isSubmitting = false;
  hasUnsavedFormChanges = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private pipeDate: DateFormatPipe,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProject();
  }

  public loadProject(): void {
    this.isLoading = true;

    this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        const id = Number(idParam);

        if (!idParam || isNaN(id) || id <= 0) {
          this.notificationService.showError('ID dự án không hợp lệ');
          this.router.navigate(['/projects']);
          throw new Error('Invalid project id');
        }

        this.projectId = id;
        return this.apiService.getProject(id);
      })
    ).subscribe({
      next: (project) => {
        this.project = project;
        this.originalProject = { ...project };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.notificationService.showError('Không thể tải thông tin dự án');
        this.isLoading = false;
      }
    });
  }

  onFormChangesDetected(hasChanges: boolean): void {
    this.hasUnsavedFormChanges = hasChanges;
  }

  onFormSubmit(formData: ProjectFormData): void {
    if (!this.project || !this.originalProject) return;

    const hasChanges = this.hasProjectChanges(formData);

    if (!hasChanges) {
      this.notificationService.showWarning('Không có thay đổi nào để lưu');
      return;
    }

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      this.notificationService.showError('Tên dự án phải có ít nhất 3 ký tự');
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      this.notificationService.showError('Mô tả dự án phải có ít nhất 10 ký tự');
      return;
    }

    this.isSubmitting = true;

    this.apiService.updateProject(this.project.id, formData).subscribe({
      next: (updatedProject) => {
        this.notificationService.showSuccess('Dự án đã được cập nhật thành công');
        this.project = updatedProject;
        this.originalProject = { ...updatedProject };
        this.hasUnsavedFormChanges = false;
        this.isSubmitting = false;
        this.router.navigate(['/projects', updatedProject.id]);
      },
      error: (error) => {
        console.error('Update project error:', error);
        let errorMessage = 'Có lỗi xảy ra khi cập nhật dự án';

        if (error.status === 400) {
          errorMessage = error.error?.message || 'Dữ liệu gửi lên không hợp lệ';
        } else if (error.status === 403) {
          errorMessage = 'Bạn không có quyền chỉnh sửa dự án này';
        } else if (error.status === 404) {
          errorMessage = 'Dự án không tồn tại';
        }

        this.notificationService.showError(errorMessage);
        this.isSubmitting = false;
      }
    });
  }

  private hasProjectChanges(formData: ProjectFormData): boolean {
    if (!this.originalProject) return true;

    const nameChanged = formData.name.trim() !== this.originalProject.name.trim();
    const descriptionChanged = formData.description.trim() !== this.originalProject.description.trim();

    return nameChanged || descriptionChanged;
  }

  formatDate(date: string): string {
    return this.pipeDate.transform(date);
  }

  viewProjectDetail(): void {
    if (this.projectId) {
      this.router.navigate(['/projects', this.projectId]);
    }
  }

  openProjectSettings(): void {
    if (this.projectId) {
      this.router.navigate(['/projects', this.projectId, 'settings']);
    }
  }

  onCancel(): void {
    this.goBack();
  }

  goBack(): void {
    if (this.projectId) {
      this.router.navigate(['/projects', this.projectId]);
    } else {
      this.router.navigate(['/projects']);
    }
  }
}
