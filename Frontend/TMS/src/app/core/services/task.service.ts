// task.service.ts
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Task, Comment, CreateTaskRequest, KanbanBoard, TaskSearchFilters, TaskStatus } from '../models';

// task.service.ts
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  // Core CRUD operations
  createTask(taskData: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData);
  }

  updateTask(taskId: number, taskData: CreateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}`, taskData);
  }

  updateTaskStatus(taskId: number, status: TaskStatus): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}/status`, { status });
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }

  getTask(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${taskId}`);
  }

  // Project & Personal tasks
  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getMyTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/my-tasks`);
  }

  // Kanban board
  getKanbanBoard(projectId: number): Observable<KanbanBoard> {
    return this.http.get<KanbanBoard>(`${this.apiUrl}/project/${projectId}/kanban`);
  }

  // Task assignment (if added to controller)
  assignTask(taskId: number, assigneeId: number): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}/assign`, { assigneeId });
  }

  // Search (if added to controller)
  searchTasks(filters: TaskSearchFilters): Observable<Task[]> {
    const params = new HttpParams({ fromObject: filters as any });
    return this.http.get<Task[]>(`${this.apiUrl}/search`, { params });
  }

  addComment(taskId: number, request: { content: string }): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${taskId}/comments`, request);
  }

  //get comments
  getCommentsByTask(taskId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${taskId}/comments`);
  }
}

