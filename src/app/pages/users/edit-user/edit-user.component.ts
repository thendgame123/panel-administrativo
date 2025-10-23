import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-edit-user',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
  userForm!: FormGroup;
  submitted = false;
  userId: string = '';
  
  // Información de auditoría
  lastModifiedDate: string = '';
  lastModifiedBy: string = '';
  
  roles: string[] = [
    'Administrador',
    'Reportería',
    'Usuario'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  private initForm(): void {
    this.userForm = this.fb.group({
      username: [{ value: '', disabled: true }], // Usuario no se puede editar
      fullName: ['', [Validators.required]],
      role: ['', [Validators.required]],
      isActive: [true]
    });
  }

  /**
   * Carga los datos del usuario a editar
   */
  private loadUserData(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      
      if (this.userId) {
        console.log('Cargando usuario con ID:', this.userId);
        
        this.userService.getById(this.userId).subscribe({
          next: (user: User) => {
            console.log('Usuario obtenido:', user);
            this.fillForm(user);
          },
          error: (error) => {
            console.error('Error al cargar usuario:', error);
            alert('Error al cargar el usuario');
            this.goBack();
          }
        });
      }
    });
  }

  /**
   * Llena el formulario con los datos del usuario
   */
  private fillForm(user: User): void {
    this.userForm.patchValue({
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive
    });

    // Información de auditoría
    this.lastModifiedDate = user.lastModifiedDate 
      ? this.formatDateTime(user.lastModifiedDate) 
      : '';
    this.lastModifiedBy = user.lastModifiedBy || '';

    console.log('Formulario llenado con datos del usuario');
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

    if (this.userForm.invalid) {
      this.showValidationErrors();
      return;
    }

    this.updateUser();
  }

  /**
   * Muestra los errores de validación
   */
  private showValidationErrors(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });

    const missingFields: string[] = [];
    
    if (this.userForm.get('fullName')?.hasError('required')) {
      missingFields.push('Nombre Completo');
    }
    if (this.userForm.get('role')?.hasError('required')) {
      missingFields.push('Rol');
    }

    if (missingFields.length > 0) {
      alert(`Por favor, completa los siguientes campos requeridos:\n- ${missingFields.join('\n- ')}`);
    }
  }

  /**
   * Actualiza el usuario
   */
  private updateUser(): void {
    const userData = {
      id: this.userId,
      username: this.userForm.get('username')?.value,
      fullName: this.userForm.value.fullName,
      role: this.userForm.value.role,
      isActive: this.userForm.value.isActive,
      lastModifiedDate: new Date().toISOString(),
      lastModifiedBy: 'Usuario Actual' // Cambiar por el usuario logueado
    };
    
    console.log('Actualizando usuario:', userData);

    this.userService.update(this.userId, userData).subscribe({
      next: (response) => {
        console.log('Usuario actualizado exitosamente', response);
        alert('Usuario actualizado exitosamente');
        this.router.navigate(['admin/users']);
      },
      error: (error) => {
        console.error('Error al actualizar usuario', error);
        alert('Error al actualizar el usuario');
      }
    });
  }

  /**
   * Cancela la edición
   */
  onCancel(): void {
    if (this.userForm.dirty) {
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
    this.router.navigate(['admin/users']);
  }
}
