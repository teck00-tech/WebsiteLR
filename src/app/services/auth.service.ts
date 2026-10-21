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

interface RegisterResponse {
  success: boolean;
  data: {
    userId: number;
    email: string;
    displayName: string;
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

async register(
  displayName: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  if (!displayName.trim() || !email.trim() || password.length < 8) {
    return {
      success: false,
      message: 'Bitte alle Felder ausfüllen. Das Passwort muss mindestens 8 Zeichen haben.'
    };
  }

  try {
    const response = await firstValueFrom(
      this.api.post<RegisterResponse>('/auth/register', {
        displayName: displayName.trim(),
        email: email.trim(),
        password
      })
    );

    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Registrierung fehlgeschlagen.'
      };
    }

    return {
      success: true,
      message: response.message || 'Registrierung erfolgreich.'
    };
  } catch (error: any) {
    console.error('Registrierung fehlgeschlagen:', error);

    const status = error?.status;
    const message =
      status === 409
        ? 'Diese E-Mail-Adresse ist bereits registriert.'
        : status === 400
          ? 'Bitte überprüfe deine Eingaben.'
          : 'Registrierung fehlgeschlagen. Bitte versuche es später erneut.';

    return { success: false, message };
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
