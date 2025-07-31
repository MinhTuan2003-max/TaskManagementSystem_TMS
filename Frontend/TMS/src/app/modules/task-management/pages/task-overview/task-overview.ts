import { Component, OnInit } from '@angular/core';
import {Priority, Task, TaskStatus} from '../../../../core/models';
import { Router, ActivatedRoute } from '@angular/router';
import {TaskService} from '../../../../core/services/task.service';
import {FormsModule} from '@angular/forms';
import {TaskCardComponent} from '../../components/task-card/task-card';

@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.html',
  imports: [
    FormsModule,
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
    private route: ActivatedRoute
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
    this.taskService.searchTasks({
      keyword: this.keyword,
      status: this.filterStatus as TaskStatus || undefined,
      priority: this.filterPriority as Priority || undefined
    }).subscribe(tasks => {
      this.tasks = tasks;
    });
  }


  onFilterChange() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        keyword: this.keyword,
        status: this.filterStatus,
        priority: this.filterPriority,
        assigneeId: this.filterAssigneeId,
        projectId: this.filterProjectId
      }
    });
  }

  goToEdit(task: Task) {
    this.router.navigate(['/tasks/edit', task.id]);
  }

  goToView(task: Task) {
    this.router.navigate(['/tasks/view', task.id]);
  }

  goToCreate() {
    this.router.navigate(['/tasks/create']);
  }
}
