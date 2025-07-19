import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  User,
  Project,
  Task,
  Comment,
  ProjectMember,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  CreateCommentRequest,
  AddMemberRequest,
  UpdateMemberRoleRequest,
  KanbanBoard
} from '../models';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Authentication APIs
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signin`, credentials)
      .pipe(
        map((response: any) => {
          if (response.token) {
            localStorage.setItem('jwt_token', response.token);
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, userData)
      .pipe(catchError(this.handleError));
  }

  // User APIs
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  searchUsers(keyword: string): Observable<User[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<User[]>(`${this.apiUrl}/users/search`, {
      headers: this.getHeaders(),
      params
    }).pipe(catchError(this.handleError));
  }

  // Project APIs
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects/my-projects`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getProject(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${projectId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createProject(projectData: any): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, projectData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateProject(projectId: number, projectData: any): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${projectId}`, projectData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${projectId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Task APIs
  getTasks(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/project/${projectId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getKanbanBoard(projectId: number): Observable<KanbanBoard> {
    return this.http.get<KanbanBoard>(`${this.apiUrl}/tasks/project/${projectId}/kanban`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createTask(taskData: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, taskData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateTask(taskId: number, taskData: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${taskId}`, taskData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateTaskStatus(taskId: number, status: string): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${taskId}/status`, { status }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getMyTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/my-tasks`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Comment APIs
  getComments(taskId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments/task/${taskId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createComment(commentData: CreateCommentRequest): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments`, commentData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateComment(commentId: number, content: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/comments/${commentId}`, { content }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Project Member APIs
  getProjectMembers(projectId: number): Observable<ProjectMember[]> {
    return this.http.get<ProjectMember[]>(`${this.apiUrl}/projects/${projectId}/members`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  addProjectMember(projectId: number, memberData: AddMemberRequest): Observable<ProjectMember> {
    return this.http.post<ProjectMember>(`${this.apiUrl}/projects/${projectId}/members`, memberData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateMemberRole(projectId: number, userId: number, role: string): Observable<ProjectMember> {
    return this.http.put<ProjectMember>(`${this.apiUrl}/projects/${projectId}/members/${userId}`, { role }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  removeProjectMember(projectId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${projectId}/members/${userId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(error);
  }
}
