import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  UserPageResponse,
  UserStats,
  UpdateUserRequest,
  CreateUserRequest,
  ResetPasswordResponse,
  MessageResponse
} from '../models';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  // User CRUD Operations
  getAllUsers(page = 0, size = 10): Observable<UserPageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<UserPageResponse>(this.apiUrl, { params });
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  updateUser(userId: number, request: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, request);
  }

  deleteUser(userId: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/${userId}`);
  }

  // Account Status Management
  lockUser(userId: number): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.apiUrl}/${userId}/lock`, {});
  }

  unlockUser(userId: number): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.apiUrl}/${userId}/unlock`, {});
  }

  enableUser(userId: number): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.apiUrl}/${userId}/enable`, {});
  }

  disableUser(userId: number): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.apiUrl}/${userId}/disable`, {});
  }

  // Role Management
  assignRole(userId: number, roleName: string): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.apiUrl}/${userId}/roles`, { roleName });
  }

  removeRole(userId: number, roleName: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/${userId}/roles/${roleName}`);
  }

  updateUserRoles(userId: number, roles: string[]): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.apiUrl}/${userId}/roles`, { roles }).pipe(
      catchError(this.handleError<MessageResponse>('updateUserRoles', { message: 'Failed to update user roles' }))
    );
  }

  // Password Management
  resetPassword(userId: number): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(`${this.apiUrl}/${userId}/reset-password`, {});
  }

  // Statistics
  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/stats`);
  }

  // Search and Filter
  searchUsers(query: string): Observable<User[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<User[]>(`${this.apiUrl}/search`, { params });
  }

  // Bulk Operations
  bulkUpdateUsers(userIds: number[], action: string): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.apiUrl}/bulk`, { userIds, action });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
