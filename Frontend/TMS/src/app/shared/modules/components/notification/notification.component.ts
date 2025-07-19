import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {NgClass, NgIf} from '@angular/common';
import {AppNotification, NotificationService} from '../../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './notification.component.html'
})
export class NotificationComponent implements OnInit {
  notifications$: Observable<AppNotification[]>;

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$;
  }

  ngOnInit(): void {}

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }
}
