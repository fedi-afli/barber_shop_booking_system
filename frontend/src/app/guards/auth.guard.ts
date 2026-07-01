import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthentificationService} from "../services/authentification.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
