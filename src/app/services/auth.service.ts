import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, BehaviorSubject, catchError, tap} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthentication();
  }

  private apiUrl = `http://localhost:8080/auth`; // Replace with your backend URL

  // Store authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password }).pipe(
      tap(() => console.log('Registration successful')), // Log success
      catchError(error => {
        console.error('Registration error:', error);
        // Convert the error into a user-friendly message
        throw new Error(
          error.error?.message ||
          'Registratio' +
          'n failed. Please try again.'
        );
      })
    );
  }
  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {username, password}).pipe(
      tap(response => console.log('Login response:', response)), // Add this to log response
      map((response) => {
        localStorage.setItem('authToken', response.token);
        this.isAuthenticatedSubject.next(true);
        return response;
      }),
      catchError(error => {
        console.error('Login error details:', error);
        if ( error.status === 401 ) {
          console.log('Invalid credentials');
        } else if ( error.status === 0 ) {
          console.log('Network error - backend unreachable');
        }
        throw error;
      })
    );
  }

  // Perform logout
  logout(): void {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Check authentication on app load
  checkAuthentication(): void {
    const token = localStorage.getItem('authToken');
    this.isAuthenticatedSubject.next(!!token);
  }

  // Get Authorization header with JWT
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAuthHeadersForMultipart(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Don't set Content-Type for FormData - let browser set it
    });
  }

  // Check token validity (optional, based on your backend implementation)
  isTokenValid(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  }
}
