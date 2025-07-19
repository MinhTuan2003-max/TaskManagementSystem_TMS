import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest, LoginResponse, MessageResponse, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public redirectUrl: string = '/dashboard';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    if (this.isBrowser()) {
      this.loadCurrentUser();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/signin`, credentials)
      .pipe(
        tap(response => {
          if (this.isBrowser()) {
            localStorage.setItem('jwt_token', response.token);
            this.loadCurrentUser();
          }
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${environment.apiUrl}/auth/signup`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('jwt_token');
    }
    this.currentUserSubject.next(null);
    this.redirectUrl = '/dashboard';
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/me`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }

    return true;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;

    return roles.some(role => user.roles.includes(role));
  }

  redirectAfterLogin(): void {
    const url = this.redirectUrl || this.getDefaultDashboard();
    this.redirectUrl = '/dashboard'; // Reset
    this.router.navigate([url]);
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  // ✅ Thêm method để get dashboard mặc định theo role
  private getDefaultDashboard(): string {
    const user = this.getCurrentUserValue();
    if (!user) return '/dashboard';

    if (user.roles.includes('ROLE_ADMIN')) {
      return '/dashboard/admin';
    } else if (user.roles.includes('ROLE_MANAGER')) {
      return '/dashboard/owner';
    } else {
      return '/dashboard/member';
    }
  }

  private loadCurrentUser(): void {
    if (this.isAuthenticated()) {
      this.getCurrentUser().subscribe({
        next: user => this.currentUserSubject.next(user),
        error: (error) => {
          console.error('Error loading current user:', error);
          this.logout();
        }
      });
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp < (currentTime + 60);
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, {})
      .pipe(
        tap(response => {
          if (this.isBrowser()) {
            localStorage.setItem('jwt_token', response.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${environment.apiUrl}/auth/change-password`, {
      oldPassword,
      newPassword
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/profile`, userData)
      .pipe(
        tap(updatedUser => {
          this.currentUserSubject.next(updatedUser);
        }),
        catchError(this.handleError)
      );
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'An error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('AuthService Error:', error);

    if (error.status === 401) {
      this.logout();
    }

    return throwError(() => ({ message: errorMessage, originalError: error }));
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  isManager(): boolean {
    return this.hasRole('ROLE_MANAGER');
  }

  isMember(): boolean {
    return this.hasRole('ROLE_USER');
  }

  getUserPermissions(): string[] {
    const user = this.getCurrentUserValue();
    if (!user) return [];

    const permissions: string[] = [];

    if (user.roles.includes('ROLE_ADMIN')) {
      permissions.push(
        'manage_all_tasks',
        'manage_all_projects',
        'manage_users',
        'view_all_data',
        'delete_any_content'
      );
    }

    if (user.roles.includes('ROLE_MANAGER')) {
      permissions.push(
        'create_project',
        'invite_members',
        'manage_project_roles',
        'manage_project_tasks',
        'assign_tasks'
      );
    }

    if (user.roles.includes('ROLE_USER')) {
      permissions.push(
        'view_tasks',
        'update_own_tasks',
        'comment_tasks',
        'change_task_status'
      );
    }

    return permissions;
  }

  hasPermission(permission: string): boolean {
    return this.getUserPermissions().includes(permission);
  }
}
