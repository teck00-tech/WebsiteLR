import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html'
})
export class Login {
  email = '';
  password = '';
  submitted = false;
  loginFailed = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async login(): Promise<void> {
    this.submitted = true;
    this.loginFailed = false;
    if (!await this.authService.login(this.email, this.password)) {
      this.loginFailed = true;
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.router.navigateByUrl(returnUrl || (this.authService.isAdmin() ? '/admin' : '/gallery'));
  }
}
