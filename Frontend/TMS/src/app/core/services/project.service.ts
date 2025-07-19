import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Project, ProjectMember } from '../models';
import { ProjectFormData, InviteMemberRequest, ProjectStats } from '../models/project-management.models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/api/projects';
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // Project CRUD Operations
  getMyProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/my-projects`, {
      headers: this.getHeaders()
    }).pipe(
      tap(projects => this.projectsSubject.next(projects))
    );
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createProject(projectData: ProjectFormData): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, projectData, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.refreshProjects())
    );
  }

  updateProject(id: number, projectData: ProjectFormData): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, projectData, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.refreshProjects())
    );
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.refreshProjects())
    );
  }

  // Project Statistics
  getProjectStats(projectId: number): Observable<ProjectStats> {
    return this.http.get<ProjectStats>(`${this.apiUrl}/${projectId}/stats`, {
      headers: this.getHeaders()
    });
  }

  // Member Management
  getProjectMembers(projectId: number): Observable<ProjectMember[]> {
    return this.http.get<ProjectMember[]>(`${this.apiUrl}/${projectId}/members`, {
      headers: this.getHeaders()
    });
  }

  inviteMember(request: InviteMemberRequest): Observable<ProjectMember> {
    const backendRequest = {
      userId: request.userId,
      role: request.role
    };

    return this.http.post<ProjectMember>(`${this.apiUrl}/${request.projectId}/members`, backendRequest, {
      headers: this.getHeaders()
    });
  }

  updateMemberRole(projectId: number, userId: number, role: string): Observable<ProjectMember> {
    return this.http.put<ProjectMember>(`${this.apiUrl}/${projectId}/members/${userId}`,
      { role }, {
        headers: this.getHeaders()
      });
  }

  removeMember(projectId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/members/${userId}`, {
      headers: this.getHeaders()
    });
  }

  // Helper Methods
  private refreshProjects(): void {
    this.getMyProjects().subscribe();
  }

  // Cache Management
  clearCache(): void {
    this.projectsSubject.next([]);
  }
}
