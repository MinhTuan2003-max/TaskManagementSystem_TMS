import { Component, OnInit } from '@angular/core';
import { KanbanBoard } from '../../../../core/models';
import {TaskService} from '../../../../core/services/task.service';
import {TaskCardComponent} from '../../components/task-card/task-card';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.html',
  styleUrls: ['./kanban.scss'],
  imports: [
    TaskCardComponent,
    NgIf,
    NgForOf
  ]
})
export class KanbanPage implements OnInit {
  board?: KanbanBoard;
  selectedProjectId = 1; // Ideally read from route param or UI

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadBoard();
  }

  loadBoard() {
    this.taskService.getKanbanBoard(this.selectedProjectId).subscribe(board => {
      this.board = board;
    });
  }

  // Extra: handlers for drag and drop, status change etc. can be added here
}
