import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {RegisterComponent} from "../register/register.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    RegisterComponent,
    HttpClientModule
  ],
  standalone: true
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {
  }
  login() {
    // Simulate login validation (you can replace this with actual validation logic)
    if (this.username === 'admin' && this.password === 'password') {
      // If login is successful, navigate to the employee-list component
      this.router.navigate(['/employee-list']);
    } else {
      // If login fails, show an error message
      this.errorMessage = 'Invalid username or password';
    }
  }
}
