import {Injectable, signal} from '@angular/core';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../models/employee.model';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Get all employees
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl,  {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Get employees by department
  getEmployeesByDepartment(departmentId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/departement/${departmentId}/employes`,  {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Delete employee by ID
  deleteEmployee(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
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
    });
  }

  deleteEmployeesOverAge(age: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/age/${age}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
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
