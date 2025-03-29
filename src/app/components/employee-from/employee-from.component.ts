import {Component, OnInit} from '@angular/core';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-from.component.html',
  styleUrls: ['./employee-from.component.css'],
  standalone: true
})
export class EmployeeFormComponent implements OnInit {
  employeeData = new FormData();

  constructor(private employeeService: EmployeeService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.employeeData.append('photo', file);
  }

  addEmployee(name: string, age: string, departmentId: string) {
    this.employeeData.append('name', name);
    this.employeeData.append('age', String(age));
    this.employeeData.append('departmentId', String(departmentId));

    this.employeeService.addEmployee(this.employeeData).subscribe(() => {
      console.log('Employee added successfully!');
    });
  }

  ngOnInit(): void {
  }
}
