import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginCredentials, LoginResponse } from '../interfaces/auth.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Respuesta del servidor:', response);
          if (response && response.token) {
            this.storageService.setItem('token', response.token);
            this.storageService.setItem('roles', JSON.stringify(response.roles));
          } else {
            throw new Error('Respuesta inválida del servidor');
          }

          localStorage.setItem('token', response.token);
          localStorage.setItem('roles', JSON.stringify(response.roles));
          localStorage.setItem('username', response.username);
          localStorage.setItem('nombre', response.nombre);
        }),
        catchError(error => {
          console.error('Error en login:', error);
          throw error;
        })
      );
  }

  isAdmin(): boolean {
    const roles = JSON.parse(this.storageService.getItem('roles') || '[]');
    return roles.includes('ADMIN');
  }

  isGerente(): boolean {
    const roles = JSON.parse(this.storageService.getItem('roles') || '[]');
    return roles.includes('GERENTE');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('email');
    localStorage.removeItem('nombre');
  }

  getToken(): string | null {
    return this.storageService.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.storageService.getItem('token');
    if (!token) return false;

    try {
      // Verificar si el token está expirado
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;

      const payload = JSON.parse(atob(tokenParts[1]));
      const expiration = payload.exp * 1000;
      
      return Date.now() < expiration;
    } catch {
      return false;
    }
  }

  getCurrentUsername(): string {
    return localStorage.getItem('nombre') || 'Usuario';  // Retornar nombre en lugar de email
  }
 
}