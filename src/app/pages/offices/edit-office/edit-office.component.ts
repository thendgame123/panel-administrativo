import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-edit-office',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './edit-office.component.html',
  styleUrl: './edit-office.component.scss'
})
export class EditOfficeComponent {
  officeForm!: FormGroup;
  submitted = false;
  officeId: string = '';
  
  // Información de auditoría
  lastModifiedDate: string = '';
  lastModifiedBy: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private officeService: OfficeService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadOfficeData();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  private initForm(): void {
    this.officeForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],      
      isActive: [true]
    });
  }

  /**
   * Carga los datos de la oficina a editar
   */
  private loadOfficeData(): void {
    this.route.params.subscribe(params => {
      this.officeId = params['id'];
      
      if (this.officeId) {
        console.log('Cargando oficina con ID:', this.officeId);
        
        this.officeService.getById(this.officeId).subscribe({
          next: (user: Office) => {
            console.log('Oficina obtenido:', user);
            this.fillForm(user);
          },
          error: (error) => {
            console.error('Error al cargar oficina:', error);
            alert('Error al cargar oficina');
            this.goBack();
          }
        });
      }
    });
  }

  /**
   * Llena el formulario con los datos de la oficina
   */
  private fillForm(user: Office): void {
    this.officeForm.patchValue({
      name: user.name,
      code: user.code,      
      isActive: user.isActive
    });

    // Información de auditoría
    this.lastModifiedDate = user.lastModifiedDate 
      ? this.formatDateTime(user.lastModifiedDate) 
      : '';
    this.lastModifiedBy = user.lastModifiedBy || '';

    console.log('Formulario llenado con datos de la oficina');
  }

  /**
   * Formatea fecha y hora
   */
  private formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const timeFormatted = date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `${dateFormatted}, ${timeFormatted}`;
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.officeForm.invalid) {
      this.showValidationErrors();
      return;
    }

    this.updateOffice();
  }

  /**
   * Muestra los errores de validación
   */
  private showValidationErrors(): void {
    Object.keys(this.officeForm.controls).forEach(key => {
      const control = this.officeForm.get(key);
      control?.markAsTouched();
    });

    const missingFields: string[] = [];
    
    if (this.officeForm.get('name')?.hasError('required')) {
      missingFields.push('Oficina');
    }
    if (this.officeForm.get('code')?.hasError('required')) {
      missingFields.push('Código de Oficina');
    }

    if (missingFields.length > 0) {
      alert(`Por favor, completa los siguientes campos requeridos:\n- ${missingFields.join('\n- ')}`);
    }
  }

  /**
   * Actualiza la oficina
   */
  private updateOffice(): void {
    const userData = {
      id: this.officeId,      
      name: this.officeForm.value.name,
      code: this.officeForm.value.code,
      isActive: this.officeForm.value.isActive,
      lastModifiedDate: new Date().toISOString(),
      lastModifiedBy: 'Usuario Actual' // Cambiar por el usuario logueado
    };
    
    console.log('Actualizando oficina:', userData);

    this.officeService.update(this.officeId, userData).subscribe({
      next: (response) => {
        console.log('Oficina actualizada exitosamente', response);
        alert('Oficina actualizada exitosamente');
        this.router.navigate(['admin/offices']);
      },
      error: (error) => {
        console.error('Error al actualizar oficina', error);
        alert('Error al actualizar la oficina');
      }
    });
  }

  /**
   * Cancela la edición
   */
  onCancel(): void {
    if (this.officeForm.dirty) {
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
    this.router.navigate(['admin/offices']);
  }
}
