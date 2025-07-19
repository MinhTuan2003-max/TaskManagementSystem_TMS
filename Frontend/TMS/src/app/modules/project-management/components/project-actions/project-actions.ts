import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../core/models';

@Component({
  selector: 'app-project-actions',
  templateUrl: './project-actions.html',
  standalone: true,
  imports: [CommonModule]
})
export class ProjectActionsComponent {
  @Input() project!: Project;
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Input() canManageMembers = true;
  @Input() showMoreActions = true;

  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();
  @Output() viewTasks = new EventEmitter<Project>();
  @Output() manageMembers = new EventEmitter<Project>();
  @Output() settings = new EventEmitter<Project>();
  @Output() archive = new EventEmitter<Project>();
  @Output() export = new EventEmitter<Project>();

  showDropdown = false;

  onEdit(): void {
    this.edit.emit(this.project);
  }

  onDelete(): void {
    if (confirm(`Bạn có chắc chắn muốn xóa dự án "${this.project.name}"?`)) {
      this.delete.emit(this.project);
    }
  }

  onViewTasks(): void {
    this.viewTasks.emit(this.project);
  }

  onManageMembers(): void {
    this.manageMembers.emit(this.project);
  }

  onSettings(): void {
    this.settings.emit(this.project);
  }

  onArchive(): void {
    this.archive.emit(this.project);
    this.showDropdown = false;
  }

  onExport(): void {
    this.export.emit(this.project);
    this.showDropdown = false;
  }

  toggleMoreActions(): void {
    this.showDropdown = !this.showDropdown;
  }
}
