import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.css'
})
export class LogoutButtonComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async logout(): Promise<void> {
    try {
      // Limpiar el almacenamiento local
      this.authService.logout();
      
      // Redirigir al login
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  }
}
