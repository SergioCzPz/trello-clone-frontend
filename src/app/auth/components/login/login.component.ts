import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginUserForm } from '../../types/loginRequest.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public errorMessage: string | null = null;

  public form = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (
      this.form.controls['email'] !== null &&
      this.form.controls['password'] !== null
    ) {
      const loginEmail = this.form.controls['email'].value;
      const loginPassword = this.form.controls['password'].value;

      const loginUser: LoginUserForm = {
        email: loginEmail,
        password: loginPassword,
      };

      this.authService.login(loginUser).subscribe({
        next: currentUser => {
          this.authService.setToken(currentUser);
          this.authService.setCurrentUser(currentUser);
          this.errorMessage = null;
          this.router.navigateByUrl('/');
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error.emailOrPassword;
        },
      });
    }
  }
}
