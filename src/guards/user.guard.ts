import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  const authUser = inject(AuthService)?.authUser();

  if (authUser && route.queryParams['uid'] !== authUser.uid) {
    return inject(Router).navigateByUrl('/not-found', { skipLocationChange: true });
  }

  return true;
};
