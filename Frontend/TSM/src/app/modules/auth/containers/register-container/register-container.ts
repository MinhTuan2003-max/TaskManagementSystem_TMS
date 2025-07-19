import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RegisterFormComponent } from '../../components/register-form/register-form';
import { AuthLogoComponent } from '../../components/auth-logo/auth-logo';
import {AuthService} from '../../../../core/services/auth.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {RegisterRequest} from '../../../../core/models';

@Component({
  selector: 'app-register-container',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RegisterFormComponent,
    AuthLogoComponent
  ],
  templateUrl: './register-container.html',
  styleUrls: ['./register-container.scss']
})
export class RegisterContainerComponent implements OnInit {
  @ViewChild('registerForm') registerForm!: RegisterFormComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onRegister(userData: RegisterRequest): void {
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Registration successful! Please login with your new account.');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.registerForm.setLoading(false);
        const errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.notificationService.showError(errorMessage);
      }
    });
  }

  onLoadingChange(loading: boolean): void {
    // Handle loading state if needed
  }
}
