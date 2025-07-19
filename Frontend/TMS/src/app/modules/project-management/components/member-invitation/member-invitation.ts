import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import {User} from '../../../../core/models';
import {InviteMemberRequest, ProjectRole} from '../../../../core/models/project-management.models';
import {ApiService} from '../../../../core/services/api.service';

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
  searchResults: User[] = [];
  selectedUser?: User;
  ProjectRole = ProjectRole;

  constructor(
    private fb: FormBuilder,
    private userService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupUserSearch();
  }

  private initForm(): void {
    this.inviteForm = this.fb.group({
      userSearch: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  private setupUserSearch(): void {
    this.inviteForm.get('userSearch')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query && query.length >= 2) {
          return this.userService.searchUsers(query);
        }
        return [];
      })
    ).subscribe(users => {
      this.searchResults = users;
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.inviteForm.patchValue({ userSearch: user.fullName });
    this.searchResults = [];
  }

  clearSelectedUser(): void {
    this.selectedUser = undefined;
    this.inviteForm.patchValue({ userSearch: '' });
    this.searchResults = [];
  }

  onSubmit(): void {
    if (this.inviteForm.valid && this.selectedUser) {
      const request: InviteMemberRequest = {
        projectId: this.projectId,
        userId: this.selectedUser.id,
        role: this.inviteForm.value.role
      };
      this.submit.emit(request);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
