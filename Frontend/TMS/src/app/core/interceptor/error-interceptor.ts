import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error) => {
      switch (error.status) {
        case 401:
          // Unauthorized - xóa token và redirect
          if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.removeItem('jwt_token');
          }
          router.navigate(['/auth/login']);
          break;

        case 403:
          // Forbidden - redirect to unauthorized
          router.navigate(['/unauthorized']);
          break;

        case 404:
          // Not found
          notificationService.showError('Resource not found');
          break;

        case 500:
          // Server error
          notificationService.showError('Internal server error. Please try again later.');
          break;

        default:
          // Other errors
          const errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
          notificationService.showError(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
