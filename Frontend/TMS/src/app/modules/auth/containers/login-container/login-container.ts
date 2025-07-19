import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { LoginFormComponent } from '../../components/login-form/login-form';
import { AuthLogoComponent } from '../../components/auth-logo/auth-logo';
import {NotificationService} from '../../../../core/services/notification.service';
import {AuthService} from '../../../../core/services/auth.service';
import {LoginRequest} from '../../../../core/models';

@Component({
  selector: 'app-login-container',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginFormComponent,
    AuthLogoComponent
  ],
  templateUrl: './login-container.html',
  styleUrls: ['./login-container.scss']
})
export class LoginContainerComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: LoginFormComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.redirectAfterLogin();
    }
  }

  onLogin(credentials: LoginRequest): void {
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Login successful! Welcome back.');

        this.authService.redirectAfterLogin();
      },
      error: (error) => {
        this.loginForm.setLoading(false);
        const errorMessage = error.message || 'Login failed. Please check your credentials.';
        this.notificationService.showError(errorMessage);
      }
    });
  }

  onLoadingChange(loading: boolean): void {
    // Handle loading state if needed
  }
}
