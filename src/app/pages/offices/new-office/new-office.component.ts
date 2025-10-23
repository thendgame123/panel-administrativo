import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
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
  selector: 'app-new-office',
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  standalone: true,
  templateUrl: './new-office.component.html',
  styleUrl: './new-office.component.scss'
})
export class NewOfficeComponent {
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
  }

  /**
   * Inicializa el formulario con validaciones
   */
  private initForm(): void {
    this.officeForm = this.fb.group({
      name: [ '', [Validators.required]], 
      code: ['', [Validators.required]],      
      isActive: [true]
    });
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

    this.createUser();
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
   * Crea la oficina
   */
  private createUser(): void {

    const userData = this.officeForm.value;

    this.officeService.create(userData).subscribe({
      next: (response) => {
        console.log('Oficina creada exitosamente', response);
        alert('Usuario creado exitosamente');
        this.router.navigate(['admin/offices']);
      },
      error: (error) => {
        console.error('Error al crear oficina', error);
        alert('Error al crear la oficina');
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
