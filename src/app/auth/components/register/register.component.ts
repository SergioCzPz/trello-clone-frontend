import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterUserForm } from '../../types/registerRequest.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  public error: string | null = null;

  public form = this.fb.group({
    email: ['', [Validators.required]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    console.log('onSubmit');
    console.log(
      this.form.controls['email'] !== null &&
        this.form.controls['password'] !== null &&
        this.form.controls['username'] !== null,
    );

    if (
      this.form.controls['email'] !== null &&
      this.form.controls['password'] !== null &&
      this.form.controls['username'] !== null
    ) {
      const registerEmail = this.form.controls['email'].value;
      const registerUsername = this.form.controls['username'].value;
      const registerPassword = this.form.controls['password'].value;

      const registerUser: RegisterUserForm = {
        email: registerEmail,
        password: registerPassword,
        username: registerUsername,
      };

      this.authService.register(registerUser).subscribe({
        next: currentUser => {
          this.authService.setToken(currentUser);
          this.authService.setCurrentUser(currentUser);
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.error.join(', ');
        },
      });
    }
  }
}
