import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NotificationComponent} from './shared/modules/components/notification/notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'TMS';
}
