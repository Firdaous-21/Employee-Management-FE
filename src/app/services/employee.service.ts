import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = `http://localhost:8080/api`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getEmployeesByDepartment(id: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/departement/${id}/employes`);
  }

  addEmployee(employee: FormData): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employes`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employes/${id}`);
  }

  deleteOldEmployees(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employes/age/60`);
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/employes/${id}`, employee);
  }
}
