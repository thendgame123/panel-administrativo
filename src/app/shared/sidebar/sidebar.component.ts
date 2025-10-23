import { Component, EventEmitter, Input, Output, inject, signal, effect } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export type NavItem = {
  label: string;
  route?: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
  command?: () => void;
};

export type NavSection = {
  title?: string;
  items: NavItem[];
};

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private router = inject(Router);

  /** Off-canvas móvil */
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  /** Modo mini (icon-only) en desktop */
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  /** Menú */
  @Input({ required: true }) nav: NavSection[] = [];

  /** Branding */
  @Input() brandTitle = 'Panel Softbrilliance';
  @Input() brandIcon = 'SB';

  /** Evento al navegar (para cerrar en móvil, tracking, etc.) */
  @Output() navigate = new EventEmitter<string | undefined>();

  /** Estado de grupos abiertos (solo en modo expandido) */
  private openMap = signal<Record<string, boolean>>({});

  constructor() {
    effect(() => this.expandParentsForUrl(this.router.url));
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => this.expandParentsForUrl(e.urlAfterRedirects || e.url));
  }

  key(si: number, ii: number) {
    return `${si}:${ii}`;
  }
  isOpen(k: string) {
    return !!this.openMap()[k];
  }

  toggleGroup(k: string) {
    if (this.collapsed) return;
    this.openMap.update((cur) => ({ ...cur, [k]: !cur[k] }));
  }

  setOpen(v: boolean) {
    this.open = v;
    this.openChange.emit(this.open);
  }

  setCollapsed(val: boolean) {
    this.collapsed = val;
    this.collapsedChange.emit(this.collapsed);
  }

  onNavigate(route?: string) {
    this.navigate.emit(route);
    this.setOpen(false);
  }

  private expandParentsForUrl(url: string) {
    const next: Record<string, boolean> = {};
    this.nav.forEach((sec, si) => {
      sec.items.forEach((it, ii) => {
        const k = this.key(si, ii);
        if (it.children?.length) {
          const hit = it.children.some(
            (c) => !!c.route && (url === c.route || url.startsWith(c.route + '/'))
          );
          if (hit) next[k] = true;
        }
      });
    });
    this.openMap.set(next);
  }
  toggleCollapsed() {
    this.setCollapsed(!this.collapsed);
  }
}
