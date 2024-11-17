import { inject, Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { StorageService } from "../services/storage.service";

export const authGuard = (route: ActivatedRouteSnapshot): boolean => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const storageService = inject(StorageService);

  // Verificar si hay token
  const token = storageService.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar roles
  const requiredRole = route.data['role'];
  
  // Si no se requiere un rol específico, solo verificar autenticación
  if (!requiredRole) {
    return true;
  }

  // Verificar rol de ADMIN
  if (requiredRole === 'ADMIN') {
    if (!authService.isAdmin()) {
      router.navigate(['/home']);
      return false;
    }
    return true;
  }

  // Verificar rol de GERENTE (permitir también acceso a ADMIN)
  if (requiredRole === 'GERENTE') {
    if (!authService.isGerente() && !authService.isAdmin()) {
      router.navigate(['/login']);
      return false;
    }
    return true;
  }

  // Si llegamos aquí, el rol no está reconocido
  router.navigate(['/login']);
  return false;
};