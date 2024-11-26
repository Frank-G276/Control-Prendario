import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoginCredentials } from '../../core/interfaces/auth.interface';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-two',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
  templateUrl: './login-two.component.html',
  styleUrl: './login-two.component.css'
})
export class LoginTwoComponent implements OnInit {
  credentials: LoginCredentials = {
    username: '',
    password: ''
  };
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }  

  onLogin(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.translateService.get('LOGIN.ERROR_EMPTY_FIELDS').subscribe((res: string) => {
        this.error = res;
      });
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
        this.translateService.get(error.status === 401 ? 'LOGIN.ERROR_INVALID_CREDENTIALS' : 'LOGIN.ERROR_LOGIN').subscribe((res: string) => {
          this.error = res;
        });
        this.isLoading = false;
      }
    });
  }

  onClienteClick(event: Event) {
    event.preventDefault();
    this.router.navigate(['/consulta-prestamos']);
  }

  onOlvidePasswordClick(event: Event) {
    event.preventDefault();
    console.log('Recuperar contraseña');
  }

  private redirectBasedOnRole(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/usuarios']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}