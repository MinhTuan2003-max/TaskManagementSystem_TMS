import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Project} from '../../../../core/models';
import {ProjectStats} from '../../../../core/models/project-management.models';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.html',
  standalone: true,
  imports: [
    NgIf
  ]
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Input() stats?: ProjectStats;
  @Input() canEdit = true;
  @Input() canDelete = true;

  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();
  @Output() viewDetail = new EventEmitter<Project>();

  get progressPercentage(): number {
    if (!this.stats || this.stats.totalTasks === 0) return 0;
    return Math.round((this.stats.completedTasks / this.stats.totalTasks) * 100);
  }

  onEdit(): void {
    this.edit.emit(this.project);
  }

  onDelete(): void {
    if (confirm(`Bạn có chắc chắn muốn xóa dự án "${this.project.name}"?`)) {
      this.delete.emit(this.project);
    }
  }

  onViewDetail(): void {
    this.viewDetail.emit(this.project);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('vi-VN');
  }
}
