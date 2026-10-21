
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';
  submitted = false;
  loginFailed = false;
  loading = false;

  async login(): Promise<void> {
    this.submitted = true;
    this.loginFailed = false;

    if (
      !this.email.trim() ||
      this.password.length < 4 ||
      this.loading
    ) {
      return;
    }

    this.loading = true;

    try {
      const success = await this.authService.login(
        this.email.trim(),
        this.password
      );

      if (!success) {
        this.loginFailed = true;
        return;
      }

      const isAdmin = this.authService.isAdmin();
      const returnUrl =
        this.route.snapshot.queryParamMap.get('returnUrl');

      let destination = isAdmin ? '/admin' : '/gallery';

      if (isAdmin && returnUrl) {
        destination = returnUrl;
      }

      await this.router.navigateByUrl(destination);
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
      this.loginFailed = true;
    } finally {
      this.loading = false;
    }
  }
}
