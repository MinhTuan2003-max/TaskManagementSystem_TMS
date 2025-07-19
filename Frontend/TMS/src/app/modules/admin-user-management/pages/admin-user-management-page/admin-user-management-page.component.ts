import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListContainerComponent } from '../../containers/user-list-container/user-list-container.component';

@Component({
  selector: 'app-admin-user-management-page',
  standalone: true,
  imports: [
    CommonModule,
    UserListContainerComponent
  ],
  templateUrl: './admin-user-management-page.component.html'
})
export class AdminUserManagementPageComponent {}
