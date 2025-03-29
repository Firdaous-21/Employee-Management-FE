import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    HttpClientModule
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.successMessage = 'Registration successful';
        this.router.navigate(['/login']);
      },
      error: () => (this.errorMessage = 'Registration failed'),
    });
  }

}
