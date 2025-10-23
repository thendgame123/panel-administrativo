import { Component, inject } from '@angular/core';
import { Header } from "../../shared/header/header.component";
import { Nav } from '../../shared/nav/nav.component';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [Header, Nav, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
    handleLogout(): void {
    console.log('Cerrando sesión...');
    // Implementar lógica de cierre de sesión
  }
}
