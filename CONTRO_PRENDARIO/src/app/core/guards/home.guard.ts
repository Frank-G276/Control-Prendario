import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const homeGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);
  
    if (authService.isLoggedIn()) {
      if (authService.isAdmin()) {
        router.navigate(['/admin']);
      } else {
        router.navigate(['/home']);
      }
      return false;
    }
  
    router.navigate(['/login']);
    return false;
  };