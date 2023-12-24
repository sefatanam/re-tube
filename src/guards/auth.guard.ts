import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authUser = inject(AuthService)?.authUser();

  if (authUser) {
    return inject(Router).navigateByUrl('/');
  }

  return true;
};
