import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../core/services/categoy.service';

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  totalContenidos: number;
  estado: string;
  imagenUrl: string;
}

@Component({
  selector: 'app-watch-category',
  imports: [CommonModule,ReactiveFormsModule],
  standalone: true,
  templateUrl: './watch-category.component.html',
  styleUrl: './watch-category.component.scss'
})
export class WatchCategoryComponent {
 categoryForm!: FormGroup;
  submitted = false;
  selectedFileName: string = '';
  categoriaId: number = 0;
  ultimaModificacion: string = '08/10/2025, 14:30';
  usuarioModificacion: string = 'Carlos Rodríguez';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
    , private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategoriaData();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  private initForm(): void {
    this.categoryForm = this.fb.group({
      titulo: [{value : '',disabled: true}],
      descripcion:  [{value : '',disabled: true}],
      imagenPortada: [{value : '',disabled: true}],
      categoriaActiva: [{value : true,disabled: true}],
    });
  }

  /**
   * Carga los datos de la categoría a editar
   */
  private loadCategoriaData(): void {
    // Obtener el ID de la categoría desde la ruta
    this.route.params.subscribe(params => {
      this.categoriaId = +params['id']; // El + convierte string a number
      if (!this.categoriaId) {
        this.router.navigate(['/admin','categories']);
        return;
      }

      // Intentar obtener desde cache o API
      this.categoryService.getById(this.categoriaId).subscribe(categoria => {
        if (categoria) {
          this.fillForm(categoria as any);
        } else {
          console.error('Categoría no encontrada');
          this.router.navigate(['/admin','categories']);
        }
      });
    });
  }

  /**
   * Llena el formulario con los datos de la categoría
   */
  private fillForm(categoria: Categoria): void {
    this.categoryForm.patchValue({
      titulo: categoria.nombre,
      descripcion: categoria.descripcion,
      imagenPortada: categoria.imagenUrl,
      categoriaActiva: categoria.estado === 'Activo'
    });
  }



  /**
   * Cancela la edición y vuelve atrás
   */
  onCancel(): void {
      this.goBack();
  }

  /**
   * Navega a la página anterior
   */
  goBack(): void {
    this.location.back();
    // O si prefieres navegar a una ruta específica:
    // this.router.navigate(['/categorias']);
  }


}
