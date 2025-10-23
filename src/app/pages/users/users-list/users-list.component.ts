import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';

interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
  isActive: boolean;
  email?: string;
  createdAt?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

@Component({
  selector: 'app-users-list',
  imports: [CommonModule, FormsModule,RouterModule],
  standalone: true,
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
 users: User[] = [];
  filteredUsers: User[] = [];
  searchText: string = '';

  constructor(
    private router: Router,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Carga los usuarios desde el servicio
   */
  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        console.log('Usuarios cargados:', this.users.length);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        alert('Error al cargar los usuarios');
      }
    });
  }

  /**
   * Filtra usuarios por texto de búsqueda
   */
  onSearchChange(): void {
    const searchLower = this.searchText.toLowerCase().trim();
    
    if (!searchLower) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(searchLower) ||
      user.fullName.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Navega al formulario de nuevo usuario
   
  onNuevoUsuario(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }
  */
  /**
   * Navega al formulario de edición de usuario
   */
  onEditarUsuario(user: User): void {
    console.log('Editar usuario:', user);
    this.router.navigate(['admin/users/editar', user.id]);
  }

  /**
   * Elimina un usuario
   */
  onEliminarUsuario(user: User): void {
    const confirmDelete = confirm(
      `¿Estás seguro de que deseas eliminar al usuario "${user.username}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmDelete) {
      console.log('Eliminar usuario:', user);
      
      this.userService.delete(user.id).subscribe({
        next: () => {
          console.log('Usuario eliminado exitosamente');
          alert('Usuario eliminado exitosamente');
          this.loadUsers(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar usuario', error);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  /**
   * Cambia el estado de un usuario
   */
  onToggleEstado(user: User): void {
    const previousState = user.isActive;
    user.isActive = !user.isActive;
    
    console.log(`Estado de "${user.username}" cambiado a: ${user.isActive ? 'Activo' : 'Inactivo'}`);
    
    this.userService.updateStatus(user.id, user.isActive).subscribe({
      next: (response) => {
        console.log('Estado actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error al actualizar estado', error);
        // Revertir el cambio en caso de error
        user.isActive = previousState;
        alert('Error al actualizar el estado');
      }
    });
  }
}
