import { CommonModule } from '@angular/common';
import { Component, Output,EventEmitter, OnInit } from '@angular/core';
import { AuthTestService } from '../../core/services/auth-test.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class Header implements OnInit {
  @Output() logout = new EventEmitter<void>();
  showProfileMenu = false;
  userEmail = '';
  userRole = '';

  constructor(private authTestService: AuthTestService, private router : Router) {}

  ngOnInit(): void {
    // Leer datos del usuario desde localStorage
    const userData = this.authTestService.getUser();
    if (userData) {
      this.userEmail = userData.email || '';
      this.userRole = userData.role || '';
    }
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }
  
  onLogout(): void {
    localStorage.removeItem('user'); // Limpia la sesión
    localStorage.clear();
    this.logout.emit();
    this.router.navigate(['/login']); // Redirige al login
  }

  onNotifications(): void {
    console.log('Notificaciones clickeadas');
  }

  onProfile(): void {
    console.log('Perfil clickeado');
  }

}
