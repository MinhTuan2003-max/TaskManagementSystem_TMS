import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InviteMemberRequest } from '../../../../core/models/project-management.models';
import { User } from '../../../../core/models';
import { ApiService } from '../../../../core/services/api.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-member-invitation',
  templateUrl: './member-invitation.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class MemberInvitationComponent implements OnInit {
  @Input() projectId!: number;
  @Input() isSubmitting = false;
  @Output() submit = new EventEmitter<InviteMemberRequest>();
  @Output() cancel = new EventEmitter<void>();

  inviteForm!: FormGroup;
  selectedUser?: User;
  availableUsers: User[] = [];
  isLoadingUsers = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    console.log('MemberInvitation initialized with projectId:', this.projectId);
    this.initForm();

    if (this.projectId) {
      this.loadAvailableUsers();
    } else {
      console.error('ProjectId not provided to MemberInvitationComponent');
    }
  }

  private initForm(): void {
    this.inviteForm = this.fb.group({
      userId: ['', Validators.required],
      role: ['MEMBER', Validators.required]
    });
  }

  // ✅ Fixed: Prevent form submission from passing SubmitEvent
  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault(); // ✅ Prevent default form submission
      event.stopPropagation(); // ✅ Stop event bubbling
    }

    console.log('Form submission triggered');
    console.log('ProjectId:', this.projectId);
    console.log('Form valid:', this.inviteForm.valid);
    console.log('Selected user:', this.selectedUser);

    if (this.inviteForm.valid && this.selectedUser && this.projectId) {
      const request: InviteMemberRequest = {
        projectId: this.projectId,
        userId: this.selectedUser.id,
        role: this.inviteForm.value.role
      };

      console.log('Sending invite request:', request);
      this.submit.emit(request); // ✅ Emit proper object, not event
    } else {
      console.log('Form invalid or missing data:');
      console.log('- Form valid:', this.inviteForm.valid);
      console.log('- Selected user:', this.selectedUser);
      console.log('- ProjectId:', this.projectId);

      if (!this.projectId) {
        this.notificationService.showError('Lỗi: Không xác định được dự án');
        return;
      }

      // Mark all fields as touched
      Object.keys(this.inviteForm.controls).forEach(key => {
        this.inviteForm.get(key)?.markAsTouched();
      });
    }
  }

  onUserSelect(user: User): void {
    console.log('User selected:', user);
    this.selectedUser = user;
    this.inviteForm.patchValue({ userId: user.id });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private loadAvailableUsers(): void {
    this.isLoadingUsers = true;

    this.apiService.getAvailableUsersForProject(this.projectId).subscribe({
      next: (users: User[]) => {
        this.availableUsers = users;
        this.isLoadingUsers = false;
        console.log('Available users loaded:', users.length);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loadAllUsers(); // Fallback
      }
    });
  }

  private loadAllUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.availableUsers = users;
        this.isLoadingUsers = false;
        console.log('All users loaded:', users.length);
      },
      error: (error) => {
        console.error('Error loading all users:', error);
        this.notificationService.showError('Không thể tải danh sách người dùng');
        this.isLoadingUsers = false;
      }
    });
  }

  get isFormValid(): boolean {
    return this.inviteForm.valid && !!this.selectedUser;
  }
}
