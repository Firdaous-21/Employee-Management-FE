import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { DepartmentService } from "../../services/departement.service";
import { EmployeeFormComponent } from "../employee-from/employee-from.component";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { DepartementFormComponent } from "../departement-form/departement-form.component";
import { MatButton, MatIconButton } from "@angular/material/button";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  imports: [FormsModule, NgForOf, NgIf, MatIcon, MatButton, NgOptimizedImage, MatIconButton],
  standalone: true,
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private dialog = inject(MatDialog);
  private sanitizer = inject(DomSanitizer);
  private destroyRef = inject(DestroyRef);

  // Signals from services
  employees = this.employeeService.employees;
  departments : any[] =[];

  selectedDepartmentId: number = 0;
  isLoading = false;
  errorMessage = '';
  employeePhotoUrls: { [key: number]: SafeUrl } = {};

  ngOnInit(): void {
    this.loadInitialData();
    this.fetchDepartement()
  }

  loadInitialData(): void {
    this.isLoading = true;

    this.departmentService.getAllDepartments()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadAllEmployees();
        },
        error: (err) => {
          console.error('Failed to load departments:', err);
          this.errorMessage = 'Failed to load departments';
          this.isLoading = false;
        }
      });
  }

  loadAllEmployees(): void {
    this.employeeService.getAllEmployees()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.loadEmployeePhotos();
        },
        error: (err) => {
          console.error('Failed to load employees:', err);
          this.errorMessage = 'Failed to load employees';
          this.isLoading = false;
        }
      });
  }

  loadEmployeesByDepartment(): void {
    if ( this.selectedDepartmentId != 0 ){
      this.isLoading = true;
      this.employeeService.getEmployeesByDepartment(this.selectedDepartmentId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.loadEmployeePhotos();
          },
          error: (err) => {
            console.error('Failed to load department employees:', err);
            this.errorMessage = 'Failed to load department employees';
            this.isLoading = false;
        }
      });
    }else {
      this.loadAllEmployees();
      return;
    }
  }

  loadEmployeePhotos(): void {
    this.employees().forEach(employee => {
      if (!this.employeePhotoUrls[employee.id]) {
        this.loadEmployeePhoto(employee.id);
      }
    });
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            if (this.employeePhotoUrls[id]) {
              URL.revokeObjectURL(this.employeePhotoUrls[id] as string);
              delete this.employeePhotoUrls[id];
            }
          },
          error: (err) => {
            console.error('Failed to delete employee:', err);
            this.errorMessage = 'Failed to delete employee';
          }
        });
    }
  }

  fetchDepartement(): void {
    this.departmentService.getAllDepartments().subscribe ({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error ('Error fetching filieres:', error);
      }
    });
  }
  openAddEmployeeDialog(): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '600px',
      disableClose: true,
      data: { departments: this.fetchDepartement() }
    });

    dialogRef.componentInstance.employeeAdded
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadAllEmployees();
        dialogRef.close();
      });
  }

  openAddDepartmentDialog(): void {
    const dialogRef = this.dialog.open(DepartementFormComponent, {
      width: '500px'
    });

    dialogRef.componentInstance.departmentAdded
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.departmentService.getAllDepartments().subscribe();
        dialogRef.close();
      });
  }

  loadEmployeePhoto(employeeId: number): void {
    this.departmentService.getEmployeePhoto(employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (photoBlob) => {
          const objectUrl = URL.createObjectURL(photoBlob);
          this.employeePhotoUrls[employeeId] =
            this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        },
        error: (err) => {
          console.error('Error loading photo:', err);
          this.employeePhotoUrls[employeeId] =
            this.sanitizer.bypassSecurityTrustUrl('assets/default-avatar.png');
        }
      });
  }
}
