import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../models/employee.model';
import { AuthService } from "./auth.service";
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employees';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  employees = signal<Employee[]>([]);

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(employees => this.employees.set(employees))
    );
  }

  getEmployeesByDepartment(departmentId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/departement/${departmentId}/employes`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(employees => this.employees.set(employees))
    );
  }

  // Delete employee by ID and update the signal
  deleteEmployee(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(success => {
        if (success) {
          this.employees.update(employees =>
            employees.filter(emp => emp.id !== id)
          );
        }
      })
    );
  }

  updateEmployee(
    id: number,
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

    return this.http.put<Employee>(`${this.apiUrl}/employees/${id}`, formData, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(updatedEmployee => {
        this.employees.update(employees =>
          employees.map(emp =>
            emp.id === id ? updatedEmployee : emp
          )
        );
      })
    );
  }

  deleteEmployeesOverAge(age: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/age/${age}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(() => {
        this.employees.update(employees =>
          employees.filter(emp => emp.age <= age)
        );
      }),
      catchError(error => {
        console.error('Error deleting employees:', error);
        throw new Error('Failed to delete employees. ' +
          (error.error?.message || ''));
      })
    );
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employees/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

}
