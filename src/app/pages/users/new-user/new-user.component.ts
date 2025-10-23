import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
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
  selector: 'app-new-user',
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  standalone: true,
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent {
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
  }

  /**
   * Inicializa el formulario con validaciones
   */
  private initForm(): void {
    this.userForm = this.fb.group({
      username: [ '', [Validators.required]], 
      fullName: ['', [Validators.required]],
      role: ['', [Validators.required]],
      isActive: [true]
    });
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

    this.createUser();
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
    
    if (this.userForm.get('username')?.hasError('required')) {
      missingFields.push('Usuario');
    }
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
  private createUser(): void {

    const userData = this.userForm.value;

    this.userService.create(userData).subscribe({
      next: (response) => {
        console.log('Usuario creado exitosamente', response);
        alert('Usuario creado exitosamente');
        this.router.navigate(['admin/users']);
      },
      error: (error) => {
        console.error('Error al crear usuario', error);
        alert('Error al crear el usuario');
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
