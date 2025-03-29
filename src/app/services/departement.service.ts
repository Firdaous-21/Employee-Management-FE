import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import {Department} from "../models/departement.model";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8080/api/departements';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Get all departments
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl,  {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Add new department
  addDepartment(nom: string): Observable<any> {
    return this.http.post(this.apiUrl, { nom }, {
      headers: this.authService.getAuthHeaders()
    });
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

  // Get photo URL (for img src)
  getPhotoUrl(id: number): string {
    return `${this.apiUrl}/photos/${id}`;
  }
}
