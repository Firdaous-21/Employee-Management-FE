import {Employee} from '../../models/employee.model';
import { Component, OnInit } from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  imports: [FormsModule, NgForOf, NgIf, HttpClientModule],
  standalone: true,
  styleUrl: './employee-list.component.css'
})

export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  selectedDepartmentId = 1; // Default department

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployeesByDepartment(this.selectedDepartmentId).subscribe(
      (data) => (this.employees = data),
      (error) => console.error(error)
    );
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.loadEmployees(); // Refresh list dynamically
    });
  }

  editEmployee(id: number){

  }
  addEmployee(){

  }
}
