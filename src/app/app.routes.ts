import { Routes } from '@angular/router';
import { canActivateAuthRoleTest, canMatchAuthRoleTest } from './core/guards/auth.guard';
import { AdminComponent } from './layouts/admin/admin.component';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./layouts/authentication/authentication.route').then(
        (module) => module.authenticationRoutes
      ),
  },

  {
    path: 'admin',
    component: AdminComponent,
    canMatch: [canMatchAuthRoleTest],
    canActivate: [canActivateAuthRoleTest],
    loadChildren: () => import('./pages/pages.routes').then((module) => module.pagesRoutes),
  },
    {
    path: 'reportero',
    component: AdminComponent,
    canMatch: [canMatchAuthRoleTest],
    canActivate: [canActivateAuthRoleTest],
    loadChildren: () => import('./pages/pages.routes').then((module) => module.pagesRoutes),
  },

  // Ruta para acceso denegado (403).
  // TODO: crear `ForbiddenComponent` y apuntar aquí. Por ahora redirigimos al login.
  { path: '403', redirectTo: 'login' },

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
