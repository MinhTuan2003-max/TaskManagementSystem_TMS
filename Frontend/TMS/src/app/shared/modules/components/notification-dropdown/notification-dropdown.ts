import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import {NotificationService} from '../../../../core/services/notification.service';
import {WebSocketService} from '../../../../core/services/websocket.service';
import {Notification, NotificationType} from '../../../../core/models/notification.model';


@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notification-dropdown.html',
  styleUrls: ['./notification-dropdown.scss']
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
  unreadNotifications: Notification[] = [];
  unreadCount = 0;
  isOpen = false;
  isLoading = false;
  private subscriptions = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.loadUnreadNotifications();
    this.subscribeToUpdates();
    this.webSocketService.connect();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadUnreadNotifications(): void {
    this.isLoading = true;

    // Load unread notifications
    this.subscriptions.add(
      this.notificationService.getUnreadNotifications().subscribe({
        next: notifications => {
          this.unreadNotifications = notifications.slice(0, 10); // Show max 10 in dropdown
          this.isLoading = false;
        },
        error: error => {
          console.error('Error loading notifications:', error);
          this.isLoading = false;
        }
      })
    );

    // Load unread count
    this.subscriptions.add(
      this.notificationService.getUnreadCount().subscribe({
        next: response => {
          this.unreadCount = response.count;
          this.notificationService.updateUnreadCount(response.count);
        },
        error: error => {
          console.error('Error loading notification count:', error);
        }
      })
    );
  }

  private subscribeToUpdates(): void {
    // Subscribe to unread count changes
    this.subscriptions.add(
      this.notificationService.unreadCount$.subscribe(
        count => this.unreadCount = count
      )
    );

    // Subscribe to new notifications
    this.subscriptions.add(
      this.notificationService.newNotification$.subscribe(
        notification => {
          if (notification) {
            this.unreadNotifications.unshift(notification);
            // Keep only latest 10 notifications in dropdown
            this.unreadNotifications = this.unreadNotifications.slice(0, 10);
          }
        }
      )
    );
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();

    if (notification.isRead) return;

    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
        this.unreadNotifications = this.unreadNotifications.filter(n => n.id !== notification.id);
        this.notificationService.decrementUnreadCount();
      },
      error: error => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  trackByNotificationId(index: number, notification: Notification): number {
    return notification.id;
  }

  markAllAsRead(): void {
    if (this.unreadNotifications.length === 0) return;

    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.unreadNotifications = [];
        this.notificationService.resetUnreadCount();
      },
      error: error => {
        console.error('Error marking all notifications as read:', error);
      }
    });
  }

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.TASK_ASSIGNED:
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case NotificationType.TASK_COMPLETED:
        return 'M5 13l4 4L19 7';
      case NotificationType.COMMENT_ADDED:
        return 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z';
      case NotificationType.PROJECT_UPDATED:
        return 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10';
      case NotificationType.SUCCESS:
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case NotificationType.ERROR:
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      case NotificationType.WARNING:
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getNotificationColor(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS:
      case NotificationType.TASK_COMPLETED:
        return 'text-green-600 bg-green-100';
      case NotificationType.WARNING:
        return 'text-yellow-600 bg-yellow-100';
      case NotificationType.ERROR:
        return 'text-red-600 bg-red-100';
      case NotificationType.TASK_ASSIGNED:
        return 'text-blue-600 bg-blue-100';
      case NotificationType.COMMENT_ADDED:
        return 'text-purple-600 bg-purple-100';
      case NotificationType.PROJECT_UPDATED:
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  }

  navigateToNotification(notification: Notification): void {
    // Mark as read first
    if (!notification.isRead) {
      this.markAsRead(notification, new Event('click'));
    }

    // Navigate based on notification type
    this.closeDropdown();
    // Add navigation logic based on notification metadata
  }
}
