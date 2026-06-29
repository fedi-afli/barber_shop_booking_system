import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router) {
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

    this.isLoading = true;
    this.errorMessage = '';

    const {username, password} = this.loginForm.value;

    // TODO: call your AuthService here
    // this.authService.login({ username, password }).subscribe({
    //   next: (user) => {
    //     if (user.role === UserRole.CLIENT) this.router.navigate(['/booking']);
    //     else this.router.navigate(['/dashboard']);
    //   },
    //   error: (err) => {
    //     this.errorMessage = 'Invalid username or password.';
    //     this.isLoading = false;
    //   }
    // });
  }

  continueAsGuest(): void {
    this.router.navigate(['/booking']);
  }

  protected goToSignup() {
    this.router.navigate(['/signup']);
  }
}
