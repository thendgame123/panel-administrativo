import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  open = false;
  userMenu = false;

  get displayName(): string {
    const u = this.auth.user;
    if (!u) return 'Invitado';
    const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
    return name || u.username || u.email || 'Usuario';
  }

  get initials(): string {
    const u = this.auth.user;
    const base = (
      [u?.firstName, u?.lastName].filter(Boolean).join(' ') ||
      u?.username ||
      u?.email ||
      'U'
    ).trim();
    const parts = base.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || 'U';
  }

  toggle() {
    this.open = !this.open;
  }
  closeAll() {
    this.open = false;
    this.userMenu = false;
  }
  toggleUserMenu() {
    this.userMenu = !this.userMenu;
  }

  onLogout() {
    this.closeAll();
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  // Cierra el menú de usuario si haces click fuera
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    const target = ev.target as HTMLElement;
    const inside = target.closest('.user-dropdown');
    if (!inside) this.userMenu = false;
  }

  @HostListener('document:keydown.escape') onEsc() {
    this.closeAll();
  }
}
