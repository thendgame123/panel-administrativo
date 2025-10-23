import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';

interface Office {
  id: string;
  name: string;
  code: string;  
  isActive: boolean;  
  createdAt: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

    // Datos mock
private mockOffices: Office[] = [
  {
    id: "1",
    name: "CAMISEA",
    code: "BQ-A-001",
    isActive: true,
    createdAt: 'sys',
    lastModifiedDate: "2025-10-08T14:30:00",
    lastModifiedBy: "admin",
  },
  {
    id: "2",
    name: "CHIRA",
    code: "BQ-B-002",
    isActive: true,
    createdAt: 'sys',
    lastModifiedDate: "2025-10-07T10:15:00",
    lastModifiedBy: "admin",
  },
  {
    id: "3",
    name: "MANTARO I",
    code: "BQ-C-003",
    isActive: true,
    createdAt: 'sys',
    lastModifiedDate: "2025-10-06T16:45:00",
    lastModifiedBy: "admin",
  },
  {
    id: "4",
    name: "TROMPETEROS I",
    code: "BQ-D-004",
    isActive: false,
    createdAt: 'sys',
    lastModifiedDate: "2025-10-05T09:20:00",
    lastModifiedBy: "admin",
  },
  {
    id: "5",
    name: "URUBAMBA",
    code: "BQ-E-005",
    isActive: true,
    createdAt: 'sys',
    lastModifiedDate: "2025-10-04T11:30:00",
    lastModifiedBy: "admin",
  },
  {
      id: "6",
      name: "COLCA",
      code: "BQ-F-006",
      isActive: true,
      createdAt: 'sys',
      lastModifiedDate: "2025-10-03T15:10:00",
      lastModifiedBy: "admin"      
  }
];

constructor() { }

  /**
   * Obtiene todas las oficinas
   */
  getAll(): Observable<Office[]> {
    console.log('OfficeService: Obteniendo todos las oficinas');
    return of(this.mockOffices).pipe(delay(500));
  }

  /**
   * Obtiene un usuario por ID
   */
  getById(id: string): Observable<Office> {
    console.log('OfficeService: Obteniendo oficina con ID:', id);
    
    const user = this.mockOffices.find(u => u.id === id);
    
    if (user) {
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Oficina no encontrada'));
    }
  }

  /**
   * Crea un nueva oficina
   */
  create(userData: any): Observable<Office> {
    console.log('OfficeService: Creando nueva oficina', userData);
    
    const newUser: Office = {
      id: Date.now().toString(),
      name: userData.name,
      code: userData.code,      
      isActive: userData.isActive ?? true,      
      createdAt: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      lastModifiedBy: 'Oficina Actual'
    };

    this.mockOffices.push(newUser);
    
    return of(newUser).pipe(delay(1000));
  }

  /**
   * Actualiza una oficina existente
   */
  update(id: string, userData: any): Observable<Office> {
    console.log('OfficeService: Actualizando oficina', id, userData);
    
    const index = this.mockOffices.findIndex(u => u.id === id);
    
    if (index !== -1) {
      const updatedUser: Office = {
        ...this.mockOffices[index],
        name: userData.name,
        code: userData.code,        
        isActive: userData.isActive,        
        lastModifiedDate: userData.lastModifiedDate,
        lastModifiedBy: userData.lastModifiedBy
      };

      this.mockOffices[index] = updatedUser;
      
      return of(updatedUser).pipe(delay(1000));
    } else {
      return throwError(() => new Error('Oficina no encontrada'));
    }
  }

  /**
   * Elimina una oficina
   */
  delete(id: string): Observable<void> {
    console.log('OfficeService: Eliminando oficina', id);
    
    const index = this.mockOffices.findIndex(u => u.id === id);
    
    if (index !== -1) {
      this.mockOffices.splice(index, 1);
      return of(void 0).pipe(delay(500));
    } else {
      return throwError(() => new Error('Oficina no encontrada'));
    }
  }

  /**
   * Actualiza el estado de una oficina
   */
  updateStatus(id: string, isActive: boolean): Observable<Office> {
    console.log('OfficeService: Actualizando estado', id, isActive);
    
    const index = this.mockOffices.findIndex(u => u.id === id);
    
    if (index !== -1) {
      this.mockOffices[index].isActive = isActive;
      this.mockOffices[index].lastModifiedDate = new Date().toISOString();
      
      return of(this.mockOffices[index]).pipe(delay(500));
    } else {
      return throwError(() => new Error('Oficina no encontrada'));
    }
  }

  /**
   * Valida si un nombre de oficina ya existe
   */
  checkUsernameExists(name: string, excludeId?: string): Observable<boolean> {
    console.log('OfficeService: Verificando si existe name:', name);
    
    const exists = this.mockOffices.some(u => 
      u.name.toLowerCase() === name.toLowerCase() && 
      u.id !== excludeId
    );
    
    return of(exists).pipe(delay(300));
  }

}


