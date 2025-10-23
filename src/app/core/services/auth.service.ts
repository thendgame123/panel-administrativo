import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginResponse, Session, SessionUser } from '../../models/auth.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private storageKey = 'auth.session';
  private _session = signal<Session | null>(this.loadFromStorage());
  get token(): string | null {
    return this._session()?.token ?? null;
  }
  get user(): SessionUser | null {
    return this._session()?.user ?? null;
  }
  get isAuthenticated(): boolean {
    return !!this.token;
  }
  get role(): string | null {
    return this.user?.role ?? null;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/api/login/authenticate`;
    return this.http
      .post<LoginResponse>(url, { email, password })
      .pipe(tap((res) => this.setSessionFromApi(res)));
  }

  logout() {
    this._session.set(null);
    localStorage.removeItem(this.storageKey);
    this.router.navigate(['/auth/login']);
  }

  private loadFromStorage(): Session | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  }

  private saveToStorage(ses: Session | null) {
    if (!ses) return localStorage.removeItem(this.storageKey);
    localStorage.setItem(this.storageKey, JSON.stringify(ses));
  }

  private setSessionFromApi(res: LoginResponse) {
    const ses: Session = {
      token: res.token,
      user: {
        id: res.user.idUsuario,
        role: res.user.Rol,
        username: res.user.usuario,
        firstName: res.user.nombres,
        lastName: res.user.apellidos,
        email: res.user.email,
        phone: res.user.telefono,
        roleId: res.user.idRolUsuario,
      },
    };
    this._session.set(ses);
    this.saveToStorage(ses);
  }

  hasRole(role: string) {
    return this.role === role || (this.user?.roles?.includes?.(role) ?? false);
  }

  hasAnyRole(roles: string[]) {
    return roles.some((r) => this.hasRole(r));
  }
}
