import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User } from '../../../../core/models';

export interface UserAction {
  type: 'lock' | 'unlock' | 'enable' | 'disable' | 'delete' | 'view' | 'resetPassword' | 'changeRole';
  user: User;
  data?: any;
}

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Input() totalUsers = 0;
  @Input() loading = false;

  @Output() actionPerformed = new EventEmitter<UserAction>();
  @Output() bulkActionPerformed = new EventEmitter<{ action: string; userIds: number[] }>();
  @Output() roleChanged = new EventEmitter<{ user: User; newRole: string }>();

  selectedUsers = new Set<number>();
  selectedAction = '';
  isAllSelected = false;
  isPartialSelected = false;

  ngOnInit(): void {
    this.updateSelectionState();
  }

  ngOnChanges(): void {
    this.updateSelectionState();
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.users.forEach(user => this.selectedUsers.add(user.id));
    } else {
      this.selectedUsers.clear();
    }
    this.updateSelectionState();
  }

  toggleUserSelection(userId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedUsers.add(userId);
    } else {
      this.selectedUsers.delete(userId);
    }
    this.updateSelectionState();
  }

  private updateSelectionState(): void {
    const selectedCount = this.selectedUsers.size;
    const totalCount = this.users.length;

    this.isAllSelected = selectedCount > 0 && selectedCount === totalCount;
    this.isPartialSelected = selectedCount > 0 && selectedCount < totalCount;
  }

  performBulkAction(): void {
    if (this.selectedAction && this.selectedUsers.size > 0) {
      const userIds = Array.from(this.selectedUsers);
      this.bulkActionPerformed.emit({
        action: this.selectedAction,
        userIds
      });

      this.selectedUsers.clear();
      this.selectedAction = '';
      this.updateSelectionState();
    }
  }

  onAction(type: UserAction['type'], user: User): void {
    this.actionPerformed.emit({ type, user });
  }

  onRoleChange(user: User, event: Event): void {
    const newRole = (event.target as HTMLSelectElement).value;
    const currentRole = this.getPrimaryRole(user);

    if (newRole !== currentRole) {
      this.roleChanged.emit({ user, newRole });
    }
  }

  // Helper Methods
  getInitials(fullName: string): string {
    return fullName.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  }

  getUserStatus(user: User): string {
    if (!user.enabled) return 'Disabled';
    if (!user.accountNonLocked) return 'Locked';
    if (!user.accountNonExpired) return 'Expired';
    return 'Active';
  }

  getUserStatusText(user: User): string {
    if (!user.enabled) return 'Đã vô hiệu hóa';
    if (!user.accountNonLocked) return 'Đã khóa';
    if (!user.accountNonExpired) return 'Đã hết hạn';
    return 'Hoạt động';
  }

  getStatusBadgeClass(user: User): string {
    const status = this.getUserStatus(user);
    const classes: Record<string, string> = {
      'Active': 'status-active',
      'Disabled': 'status-disabled',
      'Locked': 'status-locked',
      'Expired': 'status-expired'
    };
    return classes[status] || 'status-default';
  }

  getPrimaryRole(user: User): string {
    if (user.roles.includes('ROLE_ADMIN')) return 'ROLE_ADMIN';
    if (user.roles.includes('ROLE_MANAGER')) return 'ROLE_MANAGER';
    return 'ROLE_USER';
  }

  getRoleBadgeClass(roleName: string): string {
    const classes: Record<string, string> = {
      'ROLE_ADMIN': 'role-admin',
      'ROLE_MANAGER': 'role-manager',
      'ROLE_USER': 'role-user'
    };
    return classes[roleName] || 'role-default';
  }

  getRoleDisplayName(roleName: string): string {
    const names: Record<string, string> = {
      'ROLE_ADMIN': 'Quản trị viên',
      'ROLE_MANAGER': 'Quản lý',
      'ROLE_USER': 'Người dùng'
    };
    return names[roleName] || roleName.replace('ROLE_', '');
  }
}
