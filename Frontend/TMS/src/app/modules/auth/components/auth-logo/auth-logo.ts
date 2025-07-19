import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-logo.html',
  styleUrls: ['./auth-logo.scss']
})
export class AuthLogoComponent {
  appName = 'Task Management System';
}
