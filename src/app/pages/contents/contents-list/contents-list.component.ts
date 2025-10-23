import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { AuthTestService } from '../../../core/services/auth-test.service';

interface Content {
  id: string;
  title: string;
  description: string;
  category: string;
  htmlContent: string;
  startDate: string;
  endDate: string;
  videoFile: string;
  imageFile: string;
  pdfFile: string;
  ships: string[];
  isActive: boolean;
  isScreensaver: boolean;
  layoutPosition: string;
  createdAt: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}


@Component({
  selector: 'app-contents-list',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './contents-list.component.html',
  styleUrl: './contents-list.component.scss'
})
export class ContentsListComponent {
  contents: Content[] = [];
  filteredContents: Content[] = [];
  role : string | null = null;
  expandedShipsMap: Map<string, boolean> = new Map();
  
  // Filtros
  searchText: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';
  
  categories: string[] = [
    'Seguridad y Emergencias',
    'Mantenimiento Naval',
    'Navegación',
    'Entretenimiento'
  ];

  constructor(
    private router: Router,
    private contentService: ContentService,
    private authTestService: AuthTestService
  ) {}

  ngOnInit(): void {
    this.loadContents();
    this.role = this.authTestService.getRole();
  }

    /**
   * Carga los contenidos desde el servicio
   */
  loadContents(): void {
    this.contentService.getAll().subscribe({
      next: (data) => {
        this.contents = data;
        this.filteredContents = [...this.contents];
        console.log('Contenidos cargados:', this.contents.length);
      },
      error: (error) => {
        console.error('Error al cargar contenidos:', error);
        alert('Error al cargar los contenidos');
      }
    });
  }

  /**
   * Aplica los filtros a la lista de contenidos
   */
  onFilterChange(): void {
    this.filteredContents = this.contents.filter(content => {
      // Filtro por texto de búsqueda
      const matchesSearch = !this.searchText || 
        content.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        content.description.toLowerCase().includes(this.searchText.toLowerCase());

      // Filtro por categoría
      const matchesCategory = !this.selectedCategory || 
        content.category === this.selectedCategory;

      // Filtro por estado
      let matchesStatus = true;
      if (this.selectedStatus === 'active') {
        matchesStatus = content.isActive;
      } else if (this.selectedStatus === 'inactive') {
        matchesStatus = !content.isActive;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  /**
   * Cambia el estado de un contenido
   */
  onToggleEstado(content: Content): void {
    content.isActive = !content.isActive;
    
    console.log(`Estado de "${content.title}" cambiado a: ${content.isActive ? 'Activo' : 'Inactivo'}`);
    
    // Llamar al servicio para actualizar
    this.contentService.updateStatus(content.id, content.isActive).subscribe({
      next: (response) => {
        console.log('Estado actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error al actualizar estado', error);
        // Revertir el cambio en caso de error
        content.isActive = !content.isActive;
        alert('Error al actualizar el estado');
      }
    });
  }

  /**
   * Navega al formulario de edición de contenido
   */
  onEditarContenido(content: Content): void {
    this.router.navigate(['/admin','contents','editar', content.id]);
  }

  onVerContenido(content: Content): void {
    this.router.navigate(['/reportero','contents','ver', content.id]);
  }

  /**
   * Elimina un contenido
   */
  onEliminarContenido(content: Content): void {
   const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el contenido "${content.title}"?`);
    
    if (confirmDelete) {
      console.log('Eliminar contenido:', content);
      
      // Llamar al servicio
      this.contentService.delete(content.id).subscribe({
        next: () => {
          console.log('Contenido eliminado exitosamente');
          alert('Contenido eliminado exitosamente');
          this.loadContents(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar contenido', error);
          alert('Error al eliminar el contenido');
        }
      });
    }
  }

  /**
   * Formatea una fecha en formato legible
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Obtiene el nombre del archivo desde una URL
   */
  getFileName(url: string): string {
    if (!url) return '';
    return url.split('/').pop() || '';
  }

  /**
   * Verifica si el contenido está vigente
   */
  isContentValid(content: Content): boolean {
    if (!content.startDate || !content.endDate) return true;
    const now = new Date();
    const startDate = new Date(content.startDate);
    const endDate = new Date(content.endDate);
    return now >= startDate && now <= endDate;
  }

  /**
   * Obtiene las ubicaciones visibles (máximo 3)
   */
  getVisibleShips(ships: string[]): string[] {
    return ships.slice(0, 3);
  }

  /**
   * Obtiene las ubicaciones ocultas (a partir de la 4ta)
   */
  getHiddenShips(ships: string[]): string[] {
    return ships.slice(3);
  }

  /**
   * Verifica si hay más de 3 ubicaciones
   */
  hasMoreShips(ships: string[]): boolean {
    return ships.length > 3;
  }

  /**
   * Alterna la visibilidad de todas las ubicaciones
   */
  toggleShipsExpanded(contentId: string): void {
    const currentState = this.expandedShipsMap.get(contentId) || false;
    this.expandedShipsMap.set(contentId, !currentState);
  }

  /**
   * Verifica si las ubicaciones están expandidas
   */
  isShipsExpanded(contentId: string): boolean {
    return this.expandedShipsMap.get(contentId) || false;
  }
}
