import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthentificationService} from "../../../services/authentification.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router,private authService:AuthentificationService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading    = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        const role = response.user.role;

        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (role === 'BARBER') {
          this.router.navigate(['/barber']);
        } else {
          this.router.navigate(['/booking']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.errorMessage = 'User not found.';
        } else if (err.status === 401) {
          this.errorMessage = 'Wrong password.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }

  continueAsGuest(): void {
    this.router.navigate(['/booking']);
  }

  protected goToSignup() {
    this.router.navigate(['/signup']);
  }
}
