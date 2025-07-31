// src/app/core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Bắt buộc phải đăng nhập trước
    if (!this.authService.isAuthenticated()) {
      this.authService.setRedirectUrl(state.url);
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Lấy danh sách vai trò yêu cầu
    const requiredRoles = route.data['roles'] as string[];

    // Nếu không yêu cầu role cụ thể, cho phép truy cập
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // Kiểm tra người dùng có vai trò phù hợp không
    const hasRole = this.authService.hasAnyRole(requiredRoles);

    if (!hasRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
