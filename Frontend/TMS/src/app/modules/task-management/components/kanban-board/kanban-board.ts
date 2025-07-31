import { Component, OnInit } from '@angular/core';
import { KanbanBoard, Task } from '../../../../core/models';
import {TaskService} from '../../../../core/services/task.service';
import {NgForOf, NgIf} from '@angular/common';
import {TaskCardComponent} from '../task-card/task-card';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.html',
  imports: [
    NgIf,
    TaskCardComponent,
    NgForOf
  ],
  styleUrls: ['./kanban-board.scss']
})
export class KanbanBoardComponent implements OnInit {
  board?: KanbanBoard;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    const projectId = 1; // Lấy từ route params hoặc input
    this.taskService.getKanbanBoard(projectId).subscribe(board => this.board = board);
  }
}
