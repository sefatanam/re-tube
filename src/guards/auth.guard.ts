import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).authUser()?.emailVerified 
  ? true : inject(Router).navigateByUrl('/') ; 
};
