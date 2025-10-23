import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthTestService } from '../../core/services/auth-test.service';


interface NavItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
}
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class Nav implements OnInit{
navItems: NavItem[] = [  ];

  role: string | null = null;

  constructor(private authTestService: AuthTestService) {}

  ngOnInit(): void {
    this.role = this.authTestService.getRole();
    this.setMenyByRole();
  }
  
  setMenyByRole(): void {
    const commonItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'chart',
      route: 'dashboard',
      active: true
    },
    {
      label: 'Categorías',
      icon: 'folder',
      route: 'categories'
    },
    {
      label: 'Contenidos',
      icon: 'file',
      route: 'contents'
    }
    ];

    if (this.role === 'admin') {
      this.navItems = [
        ...commonItems,
            {
      label: 'Usuarios',
      icon: 'users',
      route: 'users'
    },
    {
      label: 'Oficinas',
      icon: 'building',
      route: 'offices'
    }
      ];
    }else{
      this.navItems = commonItems;
    }
  }


  setActive(item: NavItem): void {
    this.navItems.forEach(navItem => navItem.active = false);
    item.active = true;
  }

  getIconPath(icon: string): string {
    const icons: { [key: string]: string } = {
      chart: 'M3 3v18h18 M7 16l4-4 4 4 6-6',
      folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
      file: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7',
      users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
      building: 'M3 21h18 M3 7v14 M21 7v14 M9 7V3h6v4 M9 21V9 M15 21V9 M9 11h.01 M9 15h.01 M15 11h.01 M15 15h.01'
    };
    return icons[icon] || '';
  }
}
