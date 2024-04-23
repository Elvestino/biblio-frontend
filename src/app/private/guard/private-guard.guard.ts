import { CanActivateFn } from '@angular/router';

export const privateGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
