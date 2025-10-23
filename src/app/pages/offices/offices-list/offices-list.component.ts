import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OfficeService } from '../../../core/services/office.service';

interface Office {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

@Component({
  selector: 'app-offices-list',
  imports: [CommonModule, FormsModule,RouterModule],
  standalone: true,
  templateUrl: './offices-list.component.html',
  styleUrl: './offices-list.component.scss'
})
export class OfficesListComponent {
 offices: Office[] = [];
  filteredOffices: Office[] = [];
  searchText: string = '';

  constructor(
    private router: Router,
    private officeService: OfficeService
  ) {}

  ngOnInit(): void {
    this.loadOffices();
  }

  /**
   * Carga las oficinas desde el servicio
   */
  loadOffices(): void {
    this.officeService.getAll().subscribe({
      next: (data) => {
        this.offices = data;
        this.filteredOffices = [...this.offices];
        console.log('Oficinas cargadas:', this.offices.length);
      },
      error: (error) => {
        console.error('Error al cargar oficinas:', error);
        alert('Error al cargar las oficinas');
      }
    });
  }

  /**
   * Filtra oficinas por texto de búsqueda
   */
  onSearchChange(): void {
    const searchLower = this.searchText.toLowerCase().trim();
    
    if (!searchLower) {
      this.filteredOffices = [...this.offices];
      return;
    }

    this.filteredOffices = this.offices.filter(office => 
      office.name.toLowerCase().includes(searchLower) ||
      office.code.toLowerCase().includes(searchLower)      
    );
  }

  /**
   * Navega al formulario de nueva oficina
   
  onNuevaOficina(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }
  */
  /**
   * Navega al formulario de edición de oficina
   */
  onEditarUsuario(office: Office): void {
    console.log('Editar oficina:', office);
    this.router.navigate(['admin/offices/editar', office.id]);
  }

  /**
   * Elimina un oficina
   */
  onEliminarOficina(office: Office): void {
    const confirmDelete = confirm(
      `¿Estás seguro de que deseas eliminar la oficina "${office.name}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmDelete) {
      console.log('Eliminar oficina:', office);
      
      this.officeService.delete(office.id).subscribe({
        next: () => {
          console.log('Oficina eliminada exitosamente');
          alert('Oficina eliminada exitosamente');
          this.loadOffices(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar oficina', error);
          alert('Error al eliminar la oficina');
        }
      });
    }
  }

  /**
   * Cambia el estado de un usuario
   */
  onToggleEstado(office: Office): void {
    const previousState = office.isActive;
    office.isActive = !office.isActive;
    
    console.log(`Estado de "${office.name}" cambiado a: ${office.isActive ? 'Activo' : 'Inactivo'}`);
    
    this.officeService.updateStatus(office.id, office.isActive).subscribe({
      next: (response) => {
        console.log('Estado actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error al actualizar estado', error);
        // Revertir el cambio en caso de error
        office.isActive = previousState;
        alert('Error al actualizar el estado');
      }
    });
  }
}
