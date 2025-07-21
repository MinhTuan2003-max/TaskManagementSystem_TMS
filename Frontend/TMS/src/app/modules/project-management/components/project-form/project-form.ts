import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../../../core/models';
import { ProjectFormData } from '../../../../core/models/project-management.models';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProjectFormComponent implements OnInit {
  @Input() project?: Project;
  @Input() isSubmitting = false;
  @Output() submit = new EventEmitter<ProjectFormData>(); // ✅ Emits ProjectFormData
  @Output() cancel = new EventEmitter<void>();
  @Output() hasChanges = new EventEmitter<boolean>();

  projectForm!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isEditMode = !!this.project;
    this.initForm();

    this.projectForm.valueChanges.subscribe(() => {
      this.checkForChanges();
    });
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      name: [this.project?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.project?.description || '', [Validators.required, Validators.minLength(10)]]
    });

    setTimeout(() => {
      this.checkForChanges();
    }, 0);
  }

  private checkForChanges(): void {
    if (!this.isEditMode || !this.project) {
      this.hasChanges.emit(false);
      return;
    }

    const formValue = this.projectForm.value;
    const nameChanged = formValue.name.trim() !== this.project.name.trim();
    const descriptionChanged = formValue.description.trim() !== this.project.description.trim();

    const hasFormChanges = nameChanged || descriptionChanged;
    this.hasChanges.emit(hasFormChanges);
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formData: ProjectFormData = {
        name: this.projectForm.value.name?.trim() || '',
        description: this.projectForm.value.description?.trim() || ''
      };
      this.submit.emit(formData);
    } else {
      console.log('Form is invalid, marking fields as touched');
      Object.keys(this.projectForm.controls).forEach(key => {
        this.projectForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get formHasChanges(): boolean {
    if (!this.isEditMode || !this.project) return false;

    const formValue = this.projectForm.value;
    return formValue.name.trim() !== this.project.name.trim() ||
      formValue.description.trim() !== this.project.description.trim();
  }

  get isFormValid(): boolean {
    return this.projectForm.valid;
  }
}
