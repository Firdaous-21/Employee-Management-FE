import {Employee} from '../../models/employee.model';
import { Component, OnInit } from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {Department} from "../../models/departement.model";
import {DepartmentService} from "../../services/departement.service";
import {EmployeeFormComponent} from "../employee-from/employee-from.component";
import {MatDialog} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {DepartementFormComponent} from "../departement-form/departement-form.component";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  imports: [FormsModule, NgForOf, NgIf, HttpClientModule, MatIcon, MatButton, NgOptimizedImage],
  standalone: true,
  styleUrl: './employee-list.component.css'
})

export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  departments: Department[] = [];
  selectedDepartmentId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadAllEmployees();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (err) => {
        console.error('Failed to load departments:', err);
        this.errorMessage = 'Failed to load departments';
      }
    });
  }

  loadAllEmployees(): void {
    this.isLoading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load employees:', err);
        this.errorMessage = 'Failed to load employees';
        this.isLoading = false;
      }
    });
  }

  loadEmployeesByDepartment(): void {
    if (this.selectedDepartmentId === null) {
      this.loadAllEmployees();
      return;
    }

    this.isLoading = true;
    this.employeeService.getEmployeesByDepartment(this.selectedDepartmentId).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load department employees:', err);
        this.errorMessage = 'Failed to load department employees';
        this.isLoading = false;
      }
    });
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.employees = this.employees.filter(e => e.id !== id);
        },
        error: (err) => {
          console.error('Failed to delete employee:', err);
          this.errorMessage = 'Failed to delete employee';
        }
      });
    }
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find(d => d.id === departmentId);
    return department?.nom || '..';
  }

  openAddEmployeeDialog(): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.componentInstance.employeeAdded.subscribe(() => {
      this.loadAllEmployees(); // Refresh the list
      dialogRef.close();
    });
  }
  // Add this method to your EmployeeListComponent
  openAddDepartmentDialog(): void {
    const dialogRef = this.dialog.open(DepartementFormComponent, {
      width: '500px'
    });

    dialogRef.componentInstance.departmentAdded.subscribe(() => {
      this.loadDepartments(); // Refresh the departments list
      dialogRef.close();
    });
  }
}
