import { Component, OnInit } from '@angular/core';
import { Priority, Task, TaskStatus, TaskSearchFilters } from '../../../../core/models';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from '../../components/task-card/task-card';
import { NgForOf, NgIf } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.html',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    TaskCardComponent
  ],
  styleUrls: ['./task-overview.scss']
})
export class TaskOverviewPage implements OnInit {
  tasks: Task[] = [];
  keyword = '';
  filterStatus = '';
  filterPriority = '';
  filterAssigneeId?: number;
  filterProjectId?: number;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'] || '';
      this.filterStatus = params['status'] || '';
      this.filterPriority = params['priority'] || '';
      this.filterAssigneeId = params['assigneeId'] ? +params['assigneeId'] : undefined;
      this.filterProjectId = params['projectId'] ? +params['projectId'] : undefined;

      this.loadTasks();
    });
  }

  loadTasks() {
    const filterObj: TaskSearchFilters = {};

    if (this.keyword.trim() !== '' && this.keyword !== 'undefined') {
      filterObj.keyword = this.keyword.trim();
    }
    if (this.filterStatus !== '' && this.filterStatus !== 'undefined') {
      filterObj.status = this.filterStatus as TaskStatus;
    }
    if (this.filterPriority !== '' && this.filterPriority !== 'undefined') {
      filterObj.priority = this.filterPriority as Priority;
    }
    if (this.filterAssigneeId !== undefined && this.filterAssigneeId !== null) {
      filterObj.assigneeId = this.filterAssigneeId;
    }
    if (this.filterProjectId !== undefined && this.filterProjectId !== null) {
      filterObj.projectId = this.filterProjectId;
    }

    this.taskService.searchTasks(filterObj).subscribe({
      next: tasks => {
        console.log('Received tasks from backend:', tasks);
        this.tasks = tasks;
      },
      error: err => {
        console.error('API error while loading tasks:', err);
      }
    });
  }

  onFilterChange() {
    const queryParams: any = {};

    queryParams.keyword = (this.keyword.trim() !== '' && this.keyword !== 'undefined') ? this.keyword.trim() : null;
    queryParams.status = (this.filterStatus !== '' && this.filterStatus !== 'undefined') ? this.filterStatus : null;
    queryParams.priority = (this.filterPriority !== '' && this.filterPriority !== 'undefined') ? this.filterPriority : null;
    queryParams.assigneeId = (this.filterAssigneeId !== undefined && this.filterAssigneeId !== null) ? this.filterAssigneeId : null;
    queryParams.projectId = (this.filterProjectId !== undefined && this.filterProjectId !== null) ? this.filterProjectId : null;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  goToEdit(task: Task) {
    this.router.navigate(['/tasks/edit', task.id]);
  }

  goToView(task: Task) {
    this.router.navigate(['/tasks/view', task.id]);
  }

  goToCreate() {
    if (this.authService.hasAnyRole(['ROLE_MANAGER', 'ROLE_ADMIN'])) {
      this.router.navigate(['/tasks/create']);
    } else {
      alert('Bạn không có quyền tạo công việc mới');
    }
  }

  canEdit(task: Task): boolean {
    const user = this.authService.getCurrentUserValue();
    if (!user) return false;
    return user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MANAGER') || (task.creatorId === user.id);
  }
}
