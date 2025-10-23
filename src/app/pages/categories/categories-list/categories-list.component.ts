import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../core/services/categoy.service';
import { AuthTestService } from '../../../core/services/auth-test.service';

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  totalContenidos: number;
  estado: 'Activo' | 'Inactivo';
  imagenUrl?: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesComponent {
 categorias: Categoria[] = [];
 role: string | null = null;

 constructor(private router: Router, private categoryService: CategoryService, private authTestService: AuthTestService) {}
  
  ngOnInit(): void {
    this.loadCategorias();
    this.role = this.authTestService.getRole();
  }

  loadCategorias(): void {
    // Datos de ejemplo - Aquí conectarías con tu servicio
    this.categorias = [
      {
        id: 1,
        nombre: 'Seguridad y Emergencias',
        descripcion: 'Protocolos de seguridad, procedimientos de emergencia y entrenamientos.',
        totalContenidos: 12,
        estado: 'Activo',
        imagenUrl: 'assets/images/seguridad-emergencia.png'
      },
      {
        id: 2,
        nombre: 'Mantenimiento Naval',
        descripcion: 'Guías de mantenimiento, inspecciones y reparaciones de equipos.',
        totalContenidos: 8,
        estado: 'Activo',
        imagenUrl: 'assets/images/mant-naval.jpg'
      },
      {
        id: 3,
        nombre: 'Navegación',
        descripcion: 'Cartas náuticas, rutas, procedimientos de navegación y comunicaciones.',
        totalContenidos: 5,
        estado: 'Inactivo',
        imagenUrl: 'assets/images/navegacion.jpg'
      },
      {
        id: 4,
        nombre: 'Entretenimiento',
        descripcion: 'Contenido recreativo para la tripulación durante tiempos libres.',
        totalContenidos: 15,
        estado: 'Activo',
        imagenUrl: 'assets/images/entretenimiento.jpg'
      }
    ];
    // Guardar en cache para que EditCategory pueda reutilizar la lista
    try {
      this.categoryService.setCategories(this.categorias as any);
    } catch (e) {
      // noop
    }
  }


  onEditarCategoria(categoria: Categoria): void {
    console.log('Editar categoría:', categoria);
    // Implementar lógica para editar categoría
    // Navegar a la ruta de edición dentro del layout admin
    this.router.navigate(['/admin','categories','editar', categoria.id]);
  }

  onVerCategoria(categoria: Categoria): void {
    this.router.navigate(['/reportero','categories','ver', categoria.id]);
  }

  onEliminarCategoria(categoria: Categoria): void {
    const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar la categoría "${categoria.nombre}"?`);
    
    if (confirmDelete) {
      console.log('Eliminar categoría:', categoria);
      
      // Aquí iría la lógica para eliminar del backend
      // this.categoryService.delete(categoria.id).subscribe(
      //   response => {
      //     console.log('Categoría eliminada exitosamente');
      //     this.loadCategorias(); // Recargar la lista
      //   },
      //   error => {
      //     console.error('Error al eliminar categoría', error);
      //     alert('Error al eliminar la categoría');
      //   }
      // );

      // Simulación: eliminar de la lista
      this.categorias = this.categorias.filter(c => c.id !== categoria.id);
      alert('Categoría eliminada exitosamente');
    }
  }

  onToggleEstado(categoria: Categoria): void {
    categoria.estado = categoria.estado === 'Activo' ? 'Inactivo' : 'Activo';
    console.log('Cambiar estado de categoría:', categoria);
    // Implementar lógica para cambiar estado
  }

  onImageError(event: Event) {
  (event.target as HTMLImageElement).src = 'assets/images/default.png';
  }
}
