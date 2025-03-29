import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import {Department} from "../models/departement.model";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8080/api/departements';

  constructor(private http: HttpClient) { }

  // Get all departments
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  // Add a new department
  addDepartment(departmentName: string): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, null, {
      params: { departement: departmentName }
    });
  }

  // Add employee to a department
  addEmployeeToDepartment(
    departmentId: number,
    employeeData: {
      nom: string;
      email: string;
      age: number;
      file: File;
    }
  ): Observable<Employee> {
    const formData = new FormData();
    formData.append('nom', employeeData.nom);
    formData.append('email', employeeData.email);
    formData.append('age', employeeData.age.toString());
    formData.append('file', employeeData.file);

    return this.http.post<Employee>(
      `${this.apiUrl}/${departmentId}/employees`,
      formData
    );
  }

  // Get employee photo
  getEmployeePhoto(employeeId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/photos/${employeeId}`, {
      responseType: 'blob'
    });
  }

  // Helper method to create photo URL
  getPhotoUrl(employeeId: string): string {
    return `${this.apiUrl}/photos/${employeeId}`;
  }
}
