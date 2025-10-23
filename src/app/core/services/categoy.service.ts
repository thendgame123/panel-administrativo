import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  totalContenidos?: number;
  estado?: string;
  imagenUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  // Ajusta la ruta base según tu API real
  private base = `${environment.apiUrl ?? ''}/api/Categories`;

  private cache = new Map<number, Categoria>();
  private listCache: Categoria[] | null = null;

  /** Guarda la lista en cache (llamar desde el componente de listado) */
  setCategories(list: Categoria[]) {
    this.listCache = list;
    list.forEach((c) => this.cache.set(c.id, c));
  }

  /** Obtener todas las categorías (usa cache si existe) */
  getAll(): Observable<Categoria[]> {
    if (this.listCache) return of(this.listCache);
    return this.http.get<Categoria[]>(this.base).pipe(
      tap((list) => this.setCategories(list)),
      catchError((err) => {
        console.error('CategoryService.getAll error', err);
        return of([] as Categoria[]);
      })
    );
  }

  /** Obtener por id: primero cache, si no llama a la API */
  getById(id: number): Observable<Categoria | null> {
    const cached = this.cache.get(id);
    if (cached) return of(cached);

    return this.http.get<Categoria>(`${this.base}/${id}`).pipe(
      tap((cat) => {
        if (cat) this.cache.set(cat.id, cat);
      }),
      map((cat) => cat ?? null),
      catchError((err) => {
        console.error(`CategoryService.getById(${id}) error`, err);
        return of(null);
      })
    );
  }

  /** Actualizar categoría en backend y actualizar cache */
  update(id: number, payload: Partial<Categoria>): Observable<Categoria | null> {
    return this.http.put<Categoria>(`${this.base}/${id}`, payload).pipe(
      tap((cat) => {
        if (cat) {
          this.cache.set(cat.id, cat);
          if (this.listCache) {
            const idx = this.listCache.findIndex((x) => x.id === cat.id);
            if (idx >= 0) this.listCache[idx] = cat;
          }
        }
      }),
      catchError((err) => {
        console.error('CategoryService.update error', err);
        return of(null);
      })
    );
  }

  clearCache() {
    this.cache.clear();
    this.listCache = null;
  }
}
