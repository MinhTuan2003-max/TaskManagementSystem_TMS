import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ProjectFormData} from '../../../../core/models/project-management.models';
import {Project} from '../../../../core/models';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProjectFormComponent implements OnInit {
  @Input() project?: Project;
  @Input() isSubmitting = false;
  @Output() submit = new EventEmitter<ProjectFormData>();
  @Output() cancel = new EventEmitter<void>();

  projectForm!: FormGroup;
  minDate = new Date().toISOString().slice(0, 16);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  get isEditMode(): boolean {
    return !!this.project;
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      name: [this.project?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.project?.description || '', [Validators.required, Validators.minLength(10)]],
    });
  }

  private formatDateForInput(date: string): string {
    return new Date(date).toISOString().slice(0, 16);
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formData: ProjectFormData = {
        name: this.projectForm.value.name.trim(),
        description: this.projectForm.value.description.trim()
      };
      this.submit.emit(formData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
