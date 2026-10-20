import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

export interface UserSession {
  email: string;
  isAdmin: boolean;
}

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    userId: number;
    email: string;
    role: string;
  };
  message: string;
  errors: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'website_session';
  private readonly session = signal<UserSession | null>(this.readSession());

  constructor(private api: ApiService) {}

  isLoggedIn(): boolean {
    return Boolean(this.session());
  }

  isAdmin(): boolean {
    return this.session()?.isAdmin ?? false;
  }



async login(email: string, password: string): Promise<boolean> {
  if (!email.trim() || password.length < 4) {
    return false;
  }

  try {
    const response = await firstValueFrom(
      this.api.post<LoginResponse>('/auth/login', {
        "email": email.trim(),
        "password": password
      })
    );
    console.log('Login-Antwort:', response);
    const session: UserSession = {
      email: response.data.email,
      isAdmin: response.data.role === 'Admin'
    };

    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.session.set(session);

    return true;
  } catch (error) {
    console.error('Login fehlgeschlagen:', error);
    return false;
  }
}



  logout(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('auth_token');
    this.session.set(null);
  }

  private readSession(): UserSession | null {
    const value = localStorage.getItem(this.storageKey);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as UserSession;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
