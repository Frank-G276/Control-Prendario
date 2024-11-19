import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../core/interfaces/user.interface';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, TranslateModule],
  templateUrl: './usuarios-lista.component.html',
  styleUrl: './usuarios-lista.component.css'
})
export class UsuariosListaComponent implements OnInit {
  usuarios: User[] = [];
  error: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/home']);
      return;
    }
    this.cargarUsuarios();
  }

  private cargarUsuarios(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.usuarios = users;
      },
      error: (error) => {
        this.translateService.get('USERS.ERROR_LOADING').subscribe((res: string) => {
          this.error = res;
        });
        console.error('Error:', error);
      }
    });
  }

  desactivarUsuario(id: number): void {
    this.translateService.get('USERS.CONFIRM_DEACTIVATE').subscribe((res: string) => {
      if (confirm(res)) {
        this.userService.deactivateUser(id).subscribe({
          next: () => {
            this.cargarUsuarios();
          },
          error: (error) => {
            this.translateService.get('USERS.ERROR_DEACTIVATE').subscribe((res: string) => {
              this.error = res;
            });
            console.error('Error:', error);
          }
        });
      }
    });
  }

  activarUsuario(id: number): void {
    this.translateService.get('USERS.CONFIRM_ACTIVATE').subscribe((res: string) => {
      if (confirm(res)) {
        this.userService.activateUser(id).subscribe({
          next: () => {
            this.cargarUsuarios();
          },
          error: (error) => {
            this.translateService.get('USERS.ERROR_ACTIVATE').subscribe((res: string) => {
              this.error = res;
            });
            console.error('Error:', error);
          }
        });
      }
    });
  }
}