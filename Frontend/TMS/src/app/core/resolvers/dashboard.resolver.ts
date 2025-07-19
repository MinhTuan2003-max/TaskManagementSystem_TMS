import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolver implements Resolve<boolean> {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  resolve(): boolean {
    const user = this.authService.getCurrentUserValue();

    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Redirect to role-specific dashboard
    if (user.roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/dashboard/admin']);
    } else if (user.roles.includes('ROLE_MANAGER') || user.roles.includes('ROLE_OWNER')) {
      this.router.navigate(['/dashboard/owner']);
    } else if (user.roles.includes('ROLE_USER')) {
      this.router.navigate(['/dashboard/member']);
    } else {
      // Default fallback
      this.router.navigate(['/dashboard/member']);
    }

    return true;
  }
}
