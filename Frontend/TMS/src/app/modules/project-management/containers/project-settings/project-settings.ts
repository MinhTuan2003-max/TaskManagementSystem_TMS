import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { switchMap } from 'rxjs';

import { Project } from '../../../../core/models';
import { ProjectFormData } from '../../../../core/models/project-management.models';
import { ApiService } from '../../../../core/services/api.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class ProjectSettingsContainer implements OnInit {
  project?: Project;
  settingsForm!: FormGroup;
  activeTab = 'general';
  isUpdating = false;
  projectId!: number;

  projectSettings = {
    isPublic: false,
    allowMemberInvite: true
  };

  tabs = [
    { id: 'general', label: 'Chung' },
    { id: 'permissions', label: 'Quyền truy cập' },
    { id: 'danger', label: 'Vùng nguy hiểm' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProject();
  }

  private initForm(): void {
    this.settingsForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  private loadProject(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.projectId = +params.get('id')!;
        return this.apiService.getProject(this.projectId);
      })
    ).subscribe({
      next: (project) => {
        this.project = project;
        this.settingsForm.patchValue({
          name: project.name,
          description: project.description
        });
      },
      error: (error) => {
        this.notificationService.showError('Không thể tải thông tin dự án');
        this.goBack();
      }
    });
  }

  onUpdateProject(): void {
    if (this.settingsForm.valid) {
      this.isUpdating = true;
      const formData: ProjectFormData = {
        name: this.settingsForm.value.name.trim(),
        description: this.settingsForm.value.description.trim()
      };

      this.apiService.updateProject(this.projectId, formData).subscribe({
        next: (project) => {
          this.project = project;
          this.notificationService.showSuccess('Dự án đã được cập nhật');
          this.isUpdating = false;
        },
        error: (error) => {
          this.notificationService.showError('Không thể cập nhật dự án');
          this.isUpdating = false;
        }
      });
    }
  }

  onTogglePublic(): void {
    // Implement API call to update project visibility
    this.notificationService.showInfo('Tính năng này đang được phát triển');
  }

  onToggleMemberInvite(): void {
    // Implement API call to update member invite permission
    this.notificationService.showInfo('Tính năng này đang được phát triển');
  }

  onArchiveProject(): void {
    if (confirm('Bạn có chắc muốn lưu trữ dự án này?')) {
      // Implement archive functionality
      this.notificationService.showInfo('Tính năng lưu trữ đang được phát triển');
    }
  }

  onDeleteProject(): void {
    if (confirm(`Bạn có chắc muốn xóa vĩnh viễn dự án "${this.project?.name}"? Hành động này không thể hoàn tác!`)) {
      this.apiService.deleteProject(this.projectId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Dự án đã được xóa');
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          this.notificationService.showError('Không thể xóa dự án');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/projects', this.projectId]);
  }
}
