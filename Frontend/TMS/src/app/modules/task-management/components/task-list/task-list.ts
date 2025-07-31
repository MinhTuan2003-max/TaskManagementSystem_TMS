import { Component, OnInit } from '@angular/core';
import { Task } from '../../../../core/models';
import { Router } from '@angular/router';
import { TaskStatus, Priority } from '../../../../core/models';
import {AuthService} from '../../../../core/services/auth.service';
import {TaskService} from '../../../../core/services/task.service';
import {TaskCardComponent} from '../task-card/task-card';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  imports: [
    TaskCardComponent,
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./task-list.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  keyword: string = '';
  filterStatus: string = '';
  filterPriority: string = '';

  constructor(
    private taskService: TaskService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.searchTasks({
      keyword: this.keyword,
      status: this.filterStatus as TaskStatus || undefined,
      priority: this.filterPriority as Priority || undefined
    }).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  onFilterChange() {
    this.loadTasks();
  }

  createTask() {
    if (this.authService.hasAnyRole(['ROLE_MANAGER', 'ROLE_OWNER', 'ROLE_ADMIN'])) {
      this.router.navigate(['/tasks/create']);
    }
  }

  editTask(task: Task) {
    this.router.navigate(['/tasks/edit', task.id]);
  }

  canEdit(task: Task): boolean {
    const user = this.authService.getCurrentUserValue();
    if (!user) return false;
    if (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MANAGER')) return true;
    return task.creatorId === user.id;
  }
}
