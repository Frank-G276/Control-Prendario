// src/app/pages/login-two/login-two.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginCredentials } from '../../../core/interfaces/auth.interface';

@Component({
  selector: 'app-login-two',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-two.component.html',
  styleUrl: './login-two.component.css'
})
export class LoginTwoComponent implements OnInit{
  credentials: LoginCredentials = {
    username: '',
    password: ''
  };
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Redirigir si ya está autenticado
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  onLogin(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Por favor, complete todos los campos';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.redirectBasedOnRole();
      },
      error: (error) => {
        console.error('Error de login:', error);
        this.error = error.status === 401 
          ? 'Credenciales inválidas' 
          : 'Error en el inicio de sesión';
        this.isLoading = false;
      }
    });
  }

  onClienteClick(event: Event) {
    event.preventDefault();
    this.router.navigate(['/Cliente']);
  }

  onOlvidePasswordClick(event: Event) {
    event.preventDefault();
    // Implementar lógica para recuperar contraseña
    console.log('Recuperar contraseña');
  }

  private redirectBasedOnRole(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}


