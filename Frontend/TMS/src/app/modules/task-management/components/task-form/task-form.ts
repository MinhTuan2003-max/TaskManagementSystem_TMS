import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Priority, CreateTaskRequest, Task } from '../../../../core/models';
import {AuthService} from '../../../../core/services/auth.service';
import {TaskService} from '../../../../core/services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./task-form.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId?: number;
  priorities = Object.values(Priority);
  projects: { id: number; name: string }[] = [];
  users: any[] = []; // Bạn nên lấy user list từ project members hoặc API

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.taskId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.taskId;

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['MEDIUM', Validators.required],
      deadline: [''],
      assigneeId: [null],
      projectId: [null, Validators.required]
    });

    // TODO: load projects and users from backend or via @Input() if parent module provides

    if (this.isEditMode) {
      this.taskService.getTask(this.taskId).subscribe(task => {
        this.taskForm.patchValue({
          ...task,
          deadline: task.deadline ? task.deadline.substring(0, 16) : ''
        });
      });
    }
  }

  onSubmit() {
    if (this.taskForm.invalid) return;
    const formData: CreateTaskRequest = {
      ...this.taskForm.value,
      deadline: this.taskForm.value.deadline
        ? new Date(this.taskForm.value.deadline).toISOString()
        : undefined
    };

    if (this.isEditMode) {
      this.taskService.updateTask(this.taskId!, formData).subscribe(() => {
        this.router.navigate(['/tasks/view', this.taskId]);
      });
    } else {
      this.taskService.createTask(formData).subscribe(task => {
        this.router.navigate(['/tasks/view', task.id]);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/tasks/list']);
  }

  canCreateOrEdit(): boolean {
    return this.authService.hasAnyRole(['ROLE_MANAGER', 'ROLE_OWNER', 'ROLE_ADMIN']);
  }
}
