import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Location } from '@angular/common';

import { AdminUserService } from '../../../../core/services/admin-user.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserTableComponent, UserAction } from '../../components/user-table/user-table.component';
import { User, UserStats } from '../../../../core/models';

@Component({
  selector: 'app-user-list-container',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserTableComponent
  ],
  templateUrl: './user-list-container.component.html',
  styleUrls: ['./user-list-container.component.scss']
})
export class UserListContainerComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  userStats: UserStats | null = null;
  loading = false;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalUsers = 0;
  totalPages = 0;

  // Filters
  filterForm: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private adminUserService: AdminUserService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      status: [''],
      role: ['']
    });
  }

  ngOnInit(): void {
    this.setupFilterSubscription();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      this.applyFilters();
    });
  }

  loadData(): void {
    this.loadUsers();
    this.loadUserStats();
  }

  refreshData(): void {
    this.loadData();
  }

  private loadUsers(page = 0): void {
    this.loading = true;

    this.adminUserService.getAllUsers(page, this.pageSize).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.users = response.content;
        this.totalUsers = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = page;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load users');
        this.loading = false;
      }
    });
  }

  private loadUserStats(): void {
    this.adminUserService.getUserStats().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (stats) => {
        this.userStats = stats;
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
      }
    });
  }

  private applyFilters(): void {
    const { search, status, role } = this.filterForm.value;

    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !search ||
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !status || this.getUserStatusKey(user) === status;
      const matchesRole = !role || user.roles.includes(role);

      return matchesSearch && matchesStatus && matchesRole;
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  // User Actions
  onUserAction(action: UserAction): void {
    switch (action.type) {
      case 'lock':
        this.lockUser(action.user);
        break;
      case 'unlock':
        this.unlockUser(action.user);
        break;
      case 'enable':
        this.enableUser(action.user);
        break;
      case 'disable':
        this.disableUser(action.user);
        break;
      case 'delete':
        this.deleteUser(action.user);
        break;
      case 'resetPassword':
        this.resetPassword(action.user);
        break;
    }
  }

  onBulkAction(event: { action: string; userIds: number[] }): void {
    const { action, userIds } = event;

    if (confirm(`Are you sure you want to ${action} ${userIds.length} users?`)) {
      this.adminUserService.bulkUpdateUsers(userIds, action).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          this.notificationService.showSuccess(response.message);
          this.loadUsers(this.currentPage);
        },
        error: (error) => {
          this.notificationService.showError('Bulk operation failed');
        }
      });
    }
  }

  onRoleChange(event: { user: User; newRole: string }): void {
    const { user, newRole } = event;

    if (confirm(`Change ${user.fullName}'s role to ${this.getRoleDisplayName(newRole)}?`)) {
      this.adminUserService.updateUserRoles(user.id, [newRole]).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.notificationService.showSuccess('User role updated successfully');
          this.loadUsers(this.currentPage);
        },
        error: (error) => {
          this.notificationService.showError('Failed to update user role');
        }
      });
    }
  }

  // Individual Actions
  private lockUser(user: User): void {
    if (confirm(`Lock account for ${user.fullName}?`)) {
      this.adminUserService.lockUser(user.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          this.notificationService.showSuccess(response.message);
          this.loadUsers(this.currentPage);
        },
        error: (error) => {
          this.notificationService.showError('Failed to lock user account');
        }
      });
    }
  }

  private unlockUser(user: User): void {
    this.adminUserService.unlockUser(user.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(response.message);
        this.loadUsers(this.currentPage);
      },
      error: (error) => {
        this.notificationService.showError('Failed to unlock user account');
      }
    });
  }

  private enableUser(user: User): void {
    this.adminUserService.enableUser(user.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(response.message);
        this.loadUsers(this.currentPage);
      },
      error: (error) => {
        this.notificationService.showError('Failed to enable user account');
      }
    });
  }

  private disableUser(user: User): void {
    if (confirm(`Disable account for ${user.fullName}?`)) {
      this.adminUserService.disableUser(user.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          this.notificationService.showSuccess(response.message);
          this.loadUsers(this.currentPage);
        },
        error: (error) => {
          this.notificationService.showError('Failed to disable user account');
        }
      });
    }
  }

  private deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.fullName}? This action cannot be undone.`)) {
      this.adminUserService.deleteUser(user.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          this.notificationService.showSuccess(response.message);
          this.loadUsers(this.currentPage);
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete user');
        }
      });
    }
  }

  private resetPassword(user: User): void {
    if (confirm(`Reset password for ${user.fullName}? A temporary password will be generated.`)) {
      this.adminUserService.resetPassword(user.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          this.notificationService.showSuccess(`Password reset successfully. Temporary password: ${response.temporaryPassword}`);
        },
        error: (error) => {
          this.notificationService.showError('Failed to reset user password');
        }
      });
    }
  }

  // Pagination
  previousPage(): void {
    if (this.currentPage > 0) {
      this.loadUsers(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  goToPage(page: number): void {
    this.loadUsers(page);
  }

  getVisiblePages(): number[] {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(0, this.currentPage - half);
    let end = Math.min(this.totalPages - 1, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStartIndex(): number {
    return this.currentPage * this.pageSize + 1;
  }

  getEndIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalUsers);
  }

  // Helper Methods
  private getUserStatusKey(user: User): string {
    if (!user.enabled) return 'disabled';
    if (!user.accountNonLocked) return 'locked';
    return 'active';
  }

  private getRoleDisplayName(roleName: string): string {
    const names: Record<string, string> = {
      'ROLE_ADMIN': 'Admin',
      'ROLE_MANAGER': 'Manager',
      'ROLE_USER': 'User'
    };
    return names[roleName] || roleName.replace('ROLE_', '');
  }

  goBack(): void {
    this.location.back();
  }
}
