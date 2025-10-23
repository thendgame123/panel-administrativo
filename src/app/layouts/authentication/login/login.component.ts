import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthTestService } from '../../../core/services/auth-test.service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authtest = inject(AuthTestService);

  loading = false;
  errorMsg = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit() {
    //const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || 'admin/dashboard';
    //this.router.navigateByUrl(returnUrl);
 if (this.form.invalid) return;

  this.loading = true;
  this.errorMsg = '';

  const { email, password } = this.form.getRawValue();

  this.authtest.login(email!, password!).subscribe({
    next: (user) => {
      this.loading = false;

      // Recupera el returnUrl solo si no apunta al login
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const safeReturnUrl =
        returnUrl && !returnUrl.includes('/login') ? returnUrl : '';

      // Redirige según rol si no hay returnUrl válido
      setTimeout(() => {
        if (safeReturnUrl) {
          this.router.navigateByUrl(safeReturnUrl);
        } else if (user.role === 'admin') {
          this.router.navigateByUrl('/admin/dashboard');
        } else if (user.role === 'reportero') {
          this.router.navigateByUrl('/reportero/dashboard');
        }
      }, 0);
    },
    error: (err) => {
      this.loading = false;
      this.errorMsg = err.message || 'Credenciales inválidas';
    }
  });


    /*if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    const { email, password } = this.form.getRawValue();

    this.auth.login(email!, password!).subscribe({
      next: (_) => {
        this.loading = false;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || 'admin/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Credenciales inválidas';
      },
    });*/
  }
}
