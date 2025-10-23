import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ApiUser } from '../../models/user.api.model';
import { UserView } from '../../models/user.view.model';

export interface UserRoleApi {
  idRolUsuario: number;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/Usuario`;

  private toView(u: ApiUser): UserView {
    return {
      id: u.idUsuario,
      fullName: `${(u.nombres ?? '').trim()} ${(u.apellidos ?? '').trim()}`.trim(),
      email: u.email,
      role: u.Rol ?? '',
      username: u.usuario,
      phone: u.telefono,
      roleId: u.idRolUsuario,
    };
  }

  list(q?: string): Observable<UserView[]> {
    return this.http.get<ApiUser[]>(this.base).pipe(
      map((arr) => arr.map((u) => this.toView(u))),
      map((list) => {
        const term = (q ?? '').trim().toLowerCase();
        if (!term) return list;
        return list.filter((u) =>
          [u.fullName, u.email, u.role, u.username, String(u.phone)]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(term))
        );
      })
    );
  }

  getById(id: number): Observable<UserView | null> {
    return this.http.get<ApiUser>(`${this.base}/${id}`).pipe(
      map((u) => this.toView(u)),
      catchError((err) => (err.status === 404 ? of(null) : throwError(() => err)))
    );
  }

  getRoles(): Observable<UserRoleApi[]> {
    return this.http.get<UserRoleApi[]>(`${this.base}/roles`);
  }

  private splitFullName(fullName: string) {
    const parts = (fullName ?? '').trim().split(/\s+/);
    if (parts.length === 1) return { nombres: parts[0], apellidos: '' };
    const apellidos = parts.pop() as string;
    const nombres = parts.join(' ');
    return { nombres, apellidos };
  }

  /** POST /api/Usuario */
  createFromView(v: Partial<UserView>) {
    const { nombres, apellidos } = this.splitFullName(v.fullName ?? '');
    const payload = {
      usuario: v.username ?? '',
      nombres,
      apellidos,
      email: v.email ?? '',
      telefono: v.phone ?? 0,
      idRolUsuario: v.roleId ?? 0,
    };
    return this.http.post<ApiUser>(this.base, payload).pipe(map((u) => this.toView(u)));
  }

  /** PUT /api/Usuario */
  updateFromView(id: number, v: Partial<UserView>) {
    const { nombres, apellidos } = this.splitFullName(v.fullName ?? '');
    const payload = {
      idUsuario: id,
      usuario: v.username ?? '',
      nombres,
      apellidos,
      email: v.email ?? '',
      telefono: v.phone ?? 0,
      idRolUsuario: v.roleId ?? 0,
    };
    return this.http.put<ApiUser>(this.base, payload).pipe(map((u) => this.toView(u)));
  }

  /** DELETE /api/Usuario/{id} */
  remove(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
