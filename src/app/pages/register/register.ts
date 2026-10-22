import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  displayName = '';
  email = '';
  password = '';
  confirmPassword = '';

  submitted = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  async register(): Promise<void> {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.displayName.trim() ||
      !this.email.trim() ||
      this.password.length < 8
    ) {
      this.errorMessage =
        'Bitte fülle alle Felder aus. Das Passwort muss mindestens 8 Zeichen haben.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Die Passwörter stimmen nicht überein.';
      return;
    }

    this.loading = true;

    try {
      const result = await this.authService.register(
        this.displayName,
        this.email,
        this.password,
      );

      if (!result.success) {
        this.errorMessage = result.message;
        return;
      }

      this.successMessage =
        'Dein Konto wurde erstellt. Du kannst dich jetzt anmelden.';

      setTimeout(() => {
        void this.router.navigate(['/login']);
      }, 1200);
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
      this.errorMessage =
        'Die Registrierung ist fehlgeschlagen. Bitte versuche es später erneut.';
    } finally {
      this.loading = false;
    }
  }
}