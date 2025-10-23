import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthTestService {

  private mockUsers = [
    { email: 'admin@correo.com', password: 'admin', role: 'admin' },
    { email: 'reportero@correo.com', password: 'reportero', role: 'reportero' }
  ];

  login(email: string, password: string): Observable<any> {
    const user = this.mockUsers.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      return of(user);
    } else {
      return throwError(() => new Error('Credenciales inválidas'));
    }
  }

  logout() {
    localStorage.removeItem('user');
  }

  getUser() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

    isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
    }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getRole();
    return roles.includes(userRole || '');
  }
}
