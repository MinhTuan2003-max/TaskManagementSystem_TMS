import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../../core/models';
import { DatePipe, NgIf, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.scss'],
  standalone: true,
  imports: [NgIf, DatePipe, SlicePipe]
})
export class TaskCardComponent {
  @Input() task!: Task;  // Đảm bảo task được truyền đúng từ cha
  @Output() editClicked = new EventEmitter<void>();

  onEditClick(event: MouseEvent): void {
    event.stopPropagation();
    this.editClicked.emit();
  }

  get isOverdue(): boolean {
    if (!this.task || !this.task.deadline) return false;
    const deadlineDate = new Date(this.task.deadline);
    const now = new Date();
    return deadlineDate < now && this.task.status !== 'DONE';
  }
}
