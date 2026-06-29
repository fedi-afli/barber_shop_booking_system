import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthentificationService} from "../../../services/authentification.service";
import {RegisterPayload} from "../../../../models/RegisterPayload";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {


  signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router,private authentifiactionService:AuthentificationService) {
    this.signupForm = this.fb.group(
      {
        username:        ['', Validators.required],
        email:           ['', [Validators.required, Validators.email]],
        password:        ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password        = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  isInvalid(field: string): boolean {
    const control = this.signupForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, email, password } = this.signupForm.value;
    // role is always CLIENT on self-registration
    const payload:RegisterPayload = { username, email, role: 'CLIENT' ,password};

    this.authentifiactionService.registerUser(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading    = false;
        this.errorMessage = err?.error?.message ?? 'Registration failed. Please try again.';
      }
    });


  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
