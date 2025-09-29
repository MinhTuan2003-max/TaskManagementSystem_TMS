import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgForOf } from '@angular/common';
import { Priority, CreateTaskRequest, Task, User, Project } from '../../../../core/models';
import { AuthService } from '../../../../core/services/auth.service';
import { TaskService } from '../../../../core/services/task.service';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.scss'],
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgForOf]
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId?: number;
  projectId?: number;

  priorities = Object.values(Priority);
  users: User[] = [];
  projects: Project[] = [];

  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.taskId = +(this.route.snapshot.paramMap.get('taskId') || 0);
    this.isEditMode = !!this.taskId;

    const parentId = this.route.parent?.snapshot.paramMap.get('projectId');
    this.projectId = parentId ? +parentId : undefined;

    if (!this.projectId) {
      this.projectService.getMyProjects().subscribe({
        next: (projects) => this.projects = projects,
        error: () => this.projects = []
      });
    }

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: [Priority.MEDIUM, Validators.required],
      deadline: [''],
      projectId: [this.projectId ?? null, Validators.required],
      assigneeId: [null],
    });

    if (this.projectId) {
      this.loadProjectMembers(this.projectId);
    }

    if (this.isEditMode) {
      this.taskService.getTask(this.taskId!).subscribe(task => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          priority: task.priority,
          deadline: task.deadline ? task.deadline.substring(0, 16) : '',
          projectId: task.projectId,
          assigneeId: task.assigneeId ?? null,
        });
        this.projectId = task.projectId;
        this.loadProjectMembers(this.projectId);
      });
    }

    this.taskForm.get('projectId')?.valueChanges.subscribe((newProjectId: number) => {
      if (newProjectId) {
        this.projectId = newProjectId;
        this.loadProjectMembers(newProjectId);
        this.taskForm.patchValue({ assigneeId: null });
      } else {
        this.users = [];
      }
    });
  }

  loadProjectMembers(projectId: number): void {
    this.projectService.getProjectMembers(projectId).subscribe({
      next: members => {
        this.users = members
          .map(m => m.user)
          .filter((u): u is User => !!u);
      },
      error: err => {
        console.error('Không thể lấy thành viên dự án', err);
        this.users = [];
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;
    const value = this.taskForm.value;
    const payload: CreateTaskRequest = {
      title: value.title,
      description: value.description,
      priority: value.priority,
      deadline: value.deadline ? new Date(value.deadline).toISOString() : undefined,
      projectId: value.projectId,
      assigneeId: value.assigneeId
    };
    if (this.isEditMode) {
      this.taskService.updateTask(this.taskId!, payload).subscribe({
        next: () => {
          this.router.navigate(['/projects', value.projectId ?? this.projectId, 'tasks']);
        },
        error: (err) => console.error('Cập nhật task lỗi', err)
      });
    } else {
      this.taskService.createTask(payload).subscribe({
        next: (task) => {
          this.router.navigate(['/projects', task.projectId, 'tasks']);
        },
        error: (err) => console.error('Tạo task lỗi', err)
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/projects', this.taskForm.value.projectId ?? this.projectId, 'tasks']);
  }

  canCreateOrEdit(): boolean {
    return this.authService.hasAnyRole(['ROLE_MANAGER', 'ROLE_ADMIN']);
  }
}
