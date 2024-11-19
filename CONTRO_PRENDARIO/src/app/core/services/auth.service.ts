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
            this.storageService.setItem('username', response.username);
            this.storageService.setItem('nombre', response.nombre);
          } else {
            throw new Error('Respuesta inválida del servidor');
          }
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
    this.storageService.removeItem('token');
    this.storageService.removeItem('roles');
    this.storageService.removeItem('username');
    this.storageService.removeItem('nombre');
  }

  getToken(): string | null {
    return this.storageService.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.storageService.getItem('token');
    if (!token) return false;

    try {
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
    return this.storageService.getItem('nombre') || 'Usuario';
  }
 
  getCurrentUserRole(): string {
    if (this.isAdmin()) return 'ADMIN';
    if (this.isGerente()) return 'GERENTE';
    return 'USUARIO';
  }
}