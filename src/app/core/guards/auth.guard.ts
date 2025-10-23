import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthTestService } from '../services/auth-test.service';

function check(requiredRoles?: string[]): boolean | UrlTree {
  const auth = inject(AuthService);
  const router = inject(Router);
  

  if (!auth.isAuthenticated) {
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: router.url || '/' } });
  }
  if (!requiredRoles?.length) return true; // solo login
  return auth.hasAnyRole(requiredRoles) ? true : router.createUrlTree(['/403']);
}

export const canMatchAuthRole: CanMatchFn = (route, segments) => {
  const url = '/' + segments.map((s) => s.path).join('/');
  const roles = route.data?.['roles'] as string[] | undefined;
  return check(roles);
};

export const canActivateAuthRole: CanActivateFn = (route, state) => {
  const roles = route.data?.['roles'] as string[] | undefined;
  return check(roles);
};

//Auth guard mock
function checkTest(requiredRoles?: string[]): boolean | UrlTree {
  const authTest = inject(AuthTestService);
  const router = inject(Router);

  // Si no está autenticado (no hay usuario en localStorage)
if (!authTest.isAuthenticated) {
  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: router.url || '/' } });
}

  // Si no hay roles requeridos, basta con estar logueado
  if (!requiredRoles?.length) return true;

  // Si tiene alguno de los roles permitidos
  return authTest.hasAnyRole(requiredRoles)
    ? true
    : router.createUrlTree(['/403']); // ruta de acceso denegado
}

export const canMatchAuthRoleTest: CanMatchFn = (route, segments) => {
  const roles = route.data?.['roles'] as string[] | undefined;
  return checkTest(roles);
};

export const canActivateAuthRoleTest: CanActivateFn = (route, state) => {
  const roles = route.data?.['roles'] as string[] | undefined;
  return checkTest(roles);
};