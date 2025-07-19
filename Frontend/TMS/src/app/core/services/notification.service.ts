import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<AppNotification[]>([]);
  public notifications$ = this.notifications.asObservable();

  showSuccess(message: string, title: string = 'Success'): void {
    this.addNotification({
      type: 'success',
      title,
      message,
      duration: 3000
    });
  }

  showError(message: string, title: string = 'Error'): void {
    this.addNotification({
      type: 'error',
      title,
      message,
      duration: 5000
    });
  }

  showInfo(message: string, title: string = 'Info'): void {
    this.addNotification({
      type: 'info',
      title,
      message,
      duration: 3000
    });
  }

  showWarning(message: string, title: string = 'Warning'): void {
    this.addNotification({
      type: 'warning',
      title,
      message,
      duration: 4000
    });
  }

  private addNotification(notification: Omit<AppNotification, 'id'>): void {
    const id = Date.now().toString();
    const newNotification: AppNotification = { ...notification, id };

    const current = this.notifications.value;
    this.notifications.next([...current, newNotification]);

    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(id);
      }, notification.duration);
    }
  }

  removeNotification(id: string): void {
    const current = this.notifications.value;
    this.notifications.next(current.filter(n => n.id !== id));
  }
}
