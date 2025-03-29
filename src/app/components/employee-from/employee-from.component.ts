import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DepartmentService} from "../../services/departement.service";
import {NgForOf, NgIf} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-from.component.html',
  styleUrls: ['./employee-from.component.css'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class EmployeeFormComponent implements OnInit {
  @Output() employeeAdded = new EventEmitter<void>();
  employeeForm: FormGroup;
  departments: any[] = [];
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isEditMode = false;
  currentEmployeeId?: number;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: number }) {
    this.employeeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(65)]],
      departmentId: ['', Validators.required]
    });

    if (data?.employeeId) {
      this.isEditMode = true;
      this.currentEmployeeId = data.employeeId;
    }
  }

  ngOnInit(): void {
    this.loadDepartments();
    if (this.isEditMode) {
      this.loadEmployeeData();
    }
  }
  loadEmployeeData(): void {
    this.employeeService.getEmployee(this.currentEmployeeId!).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          nom: employee.nom,
          email: employee.email,
          age: employee.age,
          departmentId: employee['departement']['id']
        });
        if (employee.photo) {
          this.previewUrl = employee.photo;
        }
      },
      error: (err) => {
        console.error('Failed to load employee data:', err);
        this.errorMessage = 'Failed to load employee data';
      }
    });
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid || !this.selectedFile) {
      this.errorMessage = 'Please fill all required fields and select a photo';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.employeeForm.value;
    this.departmentService.addEmployeeToDepartment(
      formData.departmentId,
      formData.nom,
      formData.email,
      formData.age,
      this.selectedFile!
    ).subscribe({
      next: (newEmployee) => {
        this.isLoading = false;
        this.successMessage = 'Employee added successfully!';
        this.employeeForm.reset();
        this.previewUrl = null;
        this.selectedFile = null;
        this.employeeAdded.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to add employee';
        console.error('Error adding employee:', err);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
