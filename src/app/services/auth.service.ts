import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
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


  // Perform registration
  register(username: string, password: string): Observable<any> {
    return this.http.post(`http://localhost:8080/auth/register`, { username, password });
  }

  // Perform login and store JWT
  login(username: string, password: string): Observable<any> {
    return this.http
      .post<{ token: string }>(`http://localhost:8080/auth/login`, { username, password })
      .pipe(
        map((response) => {
          localStorage.setItem('authToken', response.token);
          this.isAuthenticatedSubject.next(true);
          return response;
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
      Authorization: `Bearer ${token}`,
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
