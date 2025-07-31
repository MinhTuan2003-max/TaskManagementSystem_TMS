import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../../core/models';
import {DatePipe, SlicePipe} from '@angular/common';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.html',
  imports: [
    DatePipe,
    SlicePipe
  ],
  styleUrls: ['./task-card.scss']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() editClicked = new EventEmitter<void>();

  onEditClick() {
    this.editClicked.emit();
  }
}
