import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-new-categorie',
  imports: [CommonModule,ReactiveFormsModule],
  standalone: true,
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.scss'
})
export class NewCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  submitted = false;
  selectedFileName: string = '';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
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
    this.createCategory();
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
   * Crea la categoría con los datos del formulario
   */
  private createCategory(): void {
    const categoryData = this.categoryForm.value;
    
    console.log('Creando categoría:', categoryData);
    
    // Aquí iría la lógica para enviar los datos al backend
    // Ejemplo:
    // this.categoryService.create(categoryData).subscribe(
    //   response => {
    //     console.log('Categoría creada exitosamente', response);
    //     alert('Categoría creada exitosamente');
    //     this.router.navigate(['/categorias']);
    //   },
    //   error => {
    //     console.error('Error al crear categoría', error);
    //     alert('Error al crear la categoría. Por favor, inténtalo de nuevo.');
    //   }
    // );

    // Simulación de éxito
    alert('Categoría creada exitosamente');
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

      // Aquí puedes implementar la lógica para subir el archivo
      // Por ejemplo, usando FileReader para preview o FormData para enviar al servidor
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

    // Aquí iría la lógica para subir el archivo al servidor
    // Ejemplo:
    // this.uploadService.uploadImage(formData).subscribe(
    //   response => {
    //     console.log('Archivo subido exitosamente', response);
    //     // Actualizar el campo imagenPortada con la URL del archivo subido
    //     this.categoryForm.patchValue({
    //       imagenPortada: response.url
    //     });
    //   },
    //   error => {
    //     console.error('Error al subir archivo', error);
    //     alert('Error al subir el archivo');
    //   }
    // );

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
   * Cancela la creación y vuelve atrás
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
