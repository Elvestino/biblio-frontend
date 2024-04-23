import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guardGuard: CanActivateFn = (route, state) => {
  // if (inject(AuthService).isLogged()) {
  //   inject(Router).navigate(['apps']);
  //   return false;
  // } else {
  return true;
  // }
};
