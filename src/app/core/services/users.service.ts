import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';

interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
  isActive: boolean;
  email?: string;
  password?: string;
  createdAt?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // Datos mock
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      fullName: 'Administrador Principal',
      role: 'Administrador',
      isActive: true,
      email: 'admin@sistema.com',
      createdAt: '2024-01-15',
      lastModifiedDate: '2025-10-10T09:30:00',
      lastModifiedBy: 'Sistema'
    },
    {
      id: '2',
      username: 'reporteria',
      fullName: 'Usuario de Reportería',
      role: 'Reportería',
      isActive: true,
      email: 'reporteria@sistema.com',
      createdAt: '2024-02-20',
      lastModifiedDate: '2025-09-15T14:20:00',
      lastModifiedBy: 'admin'
    },
    {
      id: '3',
      username: 'jperez',
      fullName: 'Juan Pérez',
      role: 'Usuario',
      isActive: true,
      email: 'jperez@sistema.com',
      createdAt: '2024-03-10',
      lastModifiedDate: '2025-08-22T11:45:00',
      lastModifiedBy: 'admin'
    },
    {
      id: '4',
      username: 'mgarcia',
      fullName: 'María García',
      role: 'Usuario',
      isActive: false,
      email: 'mgarcia@sistema.com',
      createdAt: '2024-04-05',
      lastModifiedDate: '2025-07-18T16:10:00',
      lastModifiedBy: 'admin'
    }
  ];

  constructor() {}

  /**
   * Obtiene todos los usuarios
   */
  getAll(): Observable<User[]> {
    console.log('UserService: Obteniendo todos los usuarios');
    return of(this.mockUsers).pipe(delay(500));
  }

  /**
   * Obtiene un usuario por ID
   */
  getById(id: string): Observable<User> {
    console.log('UserService: Obteniendo usuario con ID:', id);
    
    const user = this.mockUsers.find(u => u.id === id);
    
    if (user) {
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Usuario no encontrado'));
    }
  }

  /**
   * Crea un nuevo usuario
   */
  create(userData: any): Observable<User> {
    console.log('UserService: Creando nuevo usuario', userData);
    
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      fullName: userData.fullName,
      role: userData.role,
      isActive: userData.isActive ?? true,
      email: userData.email,
      createdAt: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      lastModifiedBy: 'Usuario Actual'
    };

    this.mockUsers.push(newUser);
    
    return of(newUser).pipe(delay(1000));
  }

  /**
   * Actualiza un usuario existente
   */
  update(id: string, userData: any): Observable<User> {
    console.log('UserService: Actualizando usuario', id, userData);
    
    const index = this.mockUsers.findIndex(u => u.id === id);
    
    if (index !== -1) {
      const updatedUser: User = {
        ...this.mockUsers[index],
        username: userData.username,
        fullName: userData.fullName,
        role: userData.role,
        isActive: userData.isActive,
        email: userData.email,
        lastModifiedDate: userData.lastModifiedDate,
        lastModifiedBy: userData.lastModifiedBy
      };

      this.mockUsers[index] = updatedUser;
      
      return of(updatedUser).pipe(delay(1000));
    } else {
      return throwError(() => new Error('Usuario no encontrado'));
    }
  }

  /**
   * Elimina un usuario
   */
  delete(id: string): Observable<void> {
    console.log('UserService: Eliminando usuario', id);
    
    const index = this.mockUsers.findIndex(u => u.id === id);
    
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
      return of(void 0).pipe(delay(500));
    } else {
      return throwError(() => new Error('Usuario no encontrado'));
    }
  }

  /**
   * Actualiza el estado de un usuario
   */
  updateStatus(id: string, isActive: boolean): Observable<User> {
    console.log('UserService: Actualizando estado', id, isActive);
    
    const index = this.mockUsers.findIndex(u => u.id === id);
    
    if (index !== -1) {
      this.mockUsers[index].isActive = isActive;
      this.mockUsers[index].lastModifiedDate = new Date().toISOString();
      
      return of(this.mockUsers[index]).pipe(delay(500));
    } else {
      return throwError(() => new Error('Usuario no encontrado'));
    }
  }

  /**
   * Valida si un nombre de usuario ya existe
   */
  checkUsernameExists(username: string, excludeId?: string): Observable<boolean> {
    console.log('UserService: Verificando si existe username:', username);
    
    const exists = this.mockUsers.some(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.id !== excludeId
    );
    
    return of(exists).pipe(delay(300));
  }

  /**
   * Valida credenciales de usuario (para login)
   */
  validateCredentials(username: string, password: string): Observable<User | null> {
    console.log('UserService: Validando credenciales para:', username);
    
    const user = this.mockUsers.find(u => 
      u.username === username && u.isActive
    );
    
    // En producción, aquí validarías el password hasheado
    return of(user || null).pipe(delay(800));
  }
}