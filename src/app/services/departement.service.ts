import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {catchError, Observable, throwError, tap, firstValueFrom} from 'rxjs';
import { Employee } from '../models/employee.model';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8080/api/departements';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  departments = signal<any[]>([]);

  getAllDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl,  {
      headers: this.authService.getAuthHeaders()
    });
  }
  addDepartment(nom: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { nom }, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(newDepartment => {
        this.departments.update(departments => [...departments, newDepartment]);
      })
    );
  }

  addEmployeeToDepartment(
    departmentId: number,
    nom: string,
    email: string,
    age: number,
    file: File
  ): Observable<Employee> {
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('email', email);
    formData.append('age', age.toString());
    formData.append('file', file);

    return this.http.post<Employee>(
      `${this.apiUrl}/${departmentId}/employees`,
      formData,
      {
        headers: this.authService.getAuthHeadersForMultipart()
      }
    );
  }

  getEmployeePhoto(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      responseType: 'blob',
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error loading photo:', error);
        return throwError(() => new Error('Failed to load photo'));
      })
    );
  }
}
