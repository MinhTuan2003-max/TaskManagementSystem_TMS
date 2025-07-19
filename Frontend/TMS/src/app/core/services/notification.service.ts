import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {Notification, NotificationPage, NotificationType} from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private newNotificationSubject = new BehaviorSubject<Notification | null>(null);
  public newNotification$ = this.newNotificationSubject.asObservable();

  private toastNotificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.toastNotificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotifications(page: number = 0, size: number = 20): Observable<NotificationPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<NotificationPage>(this.apiUrl, { params });
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/unread`);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread/count`);
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/read-all`, {});
  }

  showSuccess(message: string, title: string = 'Thành công'): void {
    this.showToastNotification(title, message, 'SUCCESS');
  }

  showError(message: string, title: string = 'Lỗi'): void {
    this.showToastNotification(title, message, 'ERROR');
  }

  showInfo(message: string, title: string = 'Thông tin'): void {
    this.showToastNotification(title, message, 'INFO');
  }

  showWarning(message: string, title: string = 'Cảnh báo'): void {
    this.showToastNotification(title, message, 'WARNING');
  }

  private showToastNotification(title: string, message: string, type: string): void {
    const notification: Notification = {
      id: Date.now(),
      title,
      message,
      type: type as NotificationType,
      isRead: false,
      recipientId: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.addNewNotification(notification);
  }

  removeNotification(displayId: string): void {
    // This will be handled by NotificationComponent
    // Just emit the removal event
  }

  public testNotification(): void {
    this.showSuccess('This is a test success notification!');

    setTimeout(() => {
      this.showError('This is a test error notification!');
    }, 1000);

    setTimeout(() => {
      this.showWarning('This is a test warning notification!');
    }, 2000);

    setTimeout(() => {
      this.showInfo('This is a test info notification!');
    }, 3000);
  }

  // Real-time methods
  updateUnreadCount(count: number): void {
    this.unreadCountSubject.next(count);
  }

  addNewNotification(notification: Notification): void {
    this.newNotificationSubject.next(notification);

    // Update unread count
    const currentCount = this.unreadCountSubject.value;
    this.unreadCountSubject.next(currentCount + 1);
  }

  decrementUnreadCount(): void {
    const currentCount = this.unreadCountSubject.value;
    if (currentCount > 0) {
      this.unreadCountSubject.next(currentCount - 1);
    }
  }

  resetUnreadCount(): void {
    this.unreadCountSubject.next(0);
  }
}
