import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  NotificationDropdownComponent
} from '../../../shared/modules/components/notification-dropdown/notification-dropdown';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NotificationDropdownComponent
  ],
  templateUrl: './member-dashboard.html',
})
export class MemberDashboardComponent implements OnInit {

  username: string = ''

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUserValue();
    this.username = user?.fullName || user?.username || 'Guest';
  }

  logout(): void {
    this.auth.logout();
  }
}
