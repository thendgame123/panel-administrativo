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
  selector: 'app-edit-category',
  imports: [CommonModule,ReactiveFormsModule],
  standalone: true,
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss'
})
export class EditCategory {
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
      titulo: ['', [Validators.required]],
      descripcion: [''],
      imagenPortada: [''],
      categoriaActiva: [true]
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
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    this.submitted = true;

    // Validar el formulario
    if (this.categoryForm.invalid) {
      this.showValidationErrors();
      return;
    }

    // Si el formulario es válido, procesar los datos
    this.updateCategory();
  }

  /**
   * Muestra los errores de validación
   */
  private showValidationErrors(): void {
    // Marcar todos los campos como touched para mostrar errores
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      control?.markAsTouched();
    });

    // Mostrar alerta con los campos requeridos faltantes
    const missingFields: string[] = [];
    
    if (this.categoryForm.get('titulo')?.hasError('required')) {
      missingFields.push('Título');
    }

    if (missingFields.length > 0) {
      alert(`Por favor, completa los siguientes campos requeridos:\n- ${missingFields.join('\n- ')}`);
    }
  }

  /**
   * Actualiza la categoría con los datos del formulario
   */
  private updateCategory(): void {
    const categoryData = {
      id: this.categoriaId,
      ...this.categoryForm.value
    };
    
    console.log('Actualizando categoría:', categoryData);
    
    // Aquí iría la lógica para enviar los datos al backend
    // Ejemplo:
    // this.categoryService.update(this.categoriaId, categoryData).subscribe(
    //   response => {
    //     console.log('Categoría actualizada exitosamente', response);
    //     alert('Categoría actualizada exitosamente');
    //     this.router.navigate(['/categorias']);
    //   },
    //   error => {
    //     console.error('Error al actualizar categoría', error);
    //     alert('Error al actualizar la categoría. Por favor, inténtalo de nuevo.');
    //   }
    // );

    // Simulación de éxito
    alert('Categoría actualizada exitosamente');
    this.goBack();
  }

  /**
   * Maneja la selección de archivo
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo es 5MB');
        return;
      }

      // Subir el archivo
      this.uploadFile(file);
    }
  }

  /**
   * Sube el archivo al servidor
   */
  private uploadFile(file: File): void {
    // Crear un FormData para enviar el archivo
    const formData = new FormData();
    formData.append('file', file);

    console.log('Subiendo archivo:', file.name);

    // Simulación: Crear URL local para preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.categoryForm.patchValue({
        imagenPortada: e.target.result
      });
    };
    reader.readAsDataURL(file);
  }

  /**
   * Cancela la edición y vuelve atrás
   */
  onCancel(): void {
    if (this.categoryForm.dirty) {
      const confirmCancel = confirm('¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.');
      if (confirmCancel) {
        this.goBack();
      }
    } else {
      this.goBack();
    }
  }

  /**
   * Navega a la página anterior
   */
  goBack(): void {
    this.location.back();
    // O si prefieres navegar a una ruta específica:
    // this.router.navigate(['/categorias']);
  }

  /**
   * Verifica si un campo tiene error y ha sido tocado
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!(field?.hasError(errorType) && (field.dirty || field.touched || this.submitted));
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `El campo ${fieldName} es requerido`;
    }
    
    return '';
  }
}
