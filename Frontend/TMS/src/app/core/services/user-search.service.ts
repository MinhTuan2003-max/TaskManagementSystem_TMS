// core/services/user-search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserSearchService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  searchUsers(query: string): Observable<User[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    const params = new HttpParams().set('query', query);
    const token = localStorage.getItem('jwt_token');
    const headers = {
      'Authorization': token ? `Bearer ${token}` : ''
    };

    return this.http.get<User[]>(`${this.apiUrl}/search`, {
      params,
      headers
    }).pipe(
      catchError(error => {
        console.error('User search error:', error);
        return of([]);
      })
    );
  }

  // Debounced search for real-time searching
  createDebouncedSearch() {
    return (query$: Observable<string>) => {
      return query$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => this.searchUsers(query))
      );
    };
  }
}
