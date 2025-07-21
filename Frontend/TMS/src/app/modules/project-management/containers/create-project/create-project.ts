import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectFormComponent } from '../../components/project-form/project-form';
import { ProjectFormData } from '../../../../core/models/project-management.models';
import { ApiService } from '../../../../core/services/api.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-create-project-container',
  templateUrl: './create-project.html',
  standalone: true,
  imports: [CommonModule, ProjectFormComponent]
})
export class CreateProjectContainer {
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  onFormSubmit(formData: ProjectFormData): void {
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      this.notificationService.showError('Tên dự án phải có ít nhất 3 ký tự');
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      this.notificationService.showError('Mô tả dự án phải có ít nhất 10 ký tự');
      return;
    }

    this.isSubmitting = true;

    this.apiService.createProject({
      name: formData.name.trim(),
      description: formData.description.trim()
    }).subscribe({
      next: (project) => {
        this.notificationService.showSuccess('Dự án mới đã được tạo thành công');
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/projects', project.id]);
        }, 1000);
      },
      error: (error) => {
        this.isSubmitting = false;
        let errorMessage = 'Có lỗi xảy ra khi tạo dự án';

        if (error.status === 400) {
          const backendMessage = error.error?.message || '';
          if (backendMessage.includes('name') && backendMessage.includes('không được để trống')) {
            errorMessage = 'Lỗi validation: Tên dự án không hợp lệ';
          } else if (backendMessage.includes('description')) {
            errorMessage = 'Mô tả dự án không hợp lệ';
          } else {
            errorMessage = `Lỗi validation: ${backendMessage}`;
          }
        } else if (error.status === 401) {
          errorMessage = 'Bạn không có quyền tạo dự án. Vui lòng đăng nhập lại';
        } else if (error.status === 403) {
          errorMessage = 'Bạn không có quyền tạo dự án';
        } else if (error.status === 500) {
          errorMessage = 'Lỗi server nội bộ. Vui lòng thử lại sau';
        }

        this.notificationService.showError(errorMessage);
      }
    });
  }

  onCancel(): void {
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['/projects/list']);
  }
}
