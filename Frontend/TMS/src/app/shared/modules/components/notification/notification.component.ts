import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgClass, NgIf, NgFor } from '@angular/common';
import {NotificationService} from '../../../../core/services/notification.service';
import {Notification, NotificationType} from '../../../../core/models/notification.model';

interface DisplayNotification extends Notification {
  displayId: string;
  autoRemove?: boolean;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgFor
  ],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: DisplayNotification[] = [];
  private subscriptions = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Subscribe to new notifications
    this.subscriptions.add(
      this.notificationService.newNotification$.subscribe(notification => {
        if (notification) {
          this.addNotification(notification);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private addNotification(notification: Notification): void {
    // Convert to DisplayNotification
    const displayNotification: DisplayNotification = {
      ...notification,
      displayId: this.generateDisplayId(),
      autoRemove: true
    };

    this.notifications.unshift(displayNotification);

    // Auto remove after delay
    const delay = this.getAutoRemoveDelay(notification.type);
    if (delay > 0) {
      setTimeout(() => {
        this.removeNotification(displayNotification.displayId);
      }, delay);
    }
  }

  removeNotification(displayId: string): void {
    this.notifications = this.notifications.filter(
      n => n.displayId !== displayId
    );
  }

  private generateDisplayId(): string {
    return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  public getAutoRemoveDelay(type: NotificationType): number {
    switch (type) {
      case NotificationType.SUCCESS:
        return 3000; // 3 seconds
      case NotificationType.INFO:
        return 4000; // 4 seconds
      case NotificationType.WARNING:
        return 6000; // 6 seconds
      case NotificationType.ERROR:
        return 8000; // 8 seconds
      case NotificationType.TASK_ASSIGNED:
      case NotificationType.TASK_COMPLETED:
      case NotificationType.COMMENT_ADDED:
        return 5000; // 5 seconds
      default:
        return 4000;
    }
  }

  getNotificationClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS:
      case NotificationType.TASK_COMPLETED:
        return 'bg-green-50 border-green-200 text-green-800';
      case NotificationType.ERROR:
        return 'bg-red-50 border-red-200 text-red-800';
      case NotificationType.WARNING:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case NotificationType.INFO:
      case NotificationType.TASK_ASSIGNED:
      case NotificationType.COMMENT_ADDED:
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  }

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS:
      case NotificationType.TASK_COMPLETED:
        return 'M5 13l4 4L19 7';
      case NotificationType.ERROR:
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      case NotificationType.WARNING:
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case NotificationType.TASK_ASSIGNED:
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case NotificationType.COMMENT_ADDED:
        return 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z';
      case NotificationType.INFO:
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getIconColorClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS:
      case NotificationType.TASK_COMPLETED:
        return 'text-green-600 bg-green-100';
      case NotificationType.ERROR:
        return 'text-red-600 bg-red-100';
      case NotificationType.WARNING:
        return 'text-yellow-600 bg-yellow-100';
      case NotificationType.INFO:
      case NotificationType.TASK_ASSIGNED:
      case NotificationType.COMMENT_ADDED:
      default:
        return 'text-blue-600 bg-blue-100';
    }
  }

  getCloseButtonColorClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS:
      case NotificationType.TASK_COMPLETED:
        return 'text-green-500 hover:text-green-600 focus:ring-green-500';
      case NotificationType.ERROR:
        return 'text-red-500 hover:text-red-600 focus:ring-red-500';
      case NotificationType.WARNING:
        return 'text-yellow-500 hover:text-yellow-600 focus:ring-yellow-500';
      case NotificationType.INFO:
      case NotificationType.TASK_ASSIGNED:
      case NotificationType.COMMENT_ADDED:
      default:
        return 'text-blue-500 hover:text-blue-600 focus:ring-blue-500';
    }
  }

  getProgressBarColorClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS:
      case NotificationType.TASK_COMPLETED:
        return 'bg-green-500';
      case NotificationType.ERROR:
        return 'bg-red-500';
      case NotificationType.WARNING:
        return 'bg-yellow-500';
      case NotificationType.INFO:
      case NotificationType.TASK_ASSIGNED:
      case NotificationType.COMMENT_ADDED:
      default:
        return 'bg-blue-500';
    }
  }
}
