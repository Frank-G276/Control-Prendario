import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../core/interfaces/user.interface';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";

@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './usuarios-lista.component.html',
  styleUrl: './usuarios-lista.component.css'
})
export class UsuariosListaComponent implements OnInit {
  usuarios: User[] = [];
  error: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
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
        this.error = 'Error al cargar usuarios';
        console.error('Error:', error);
      }
    });
  }

  desactivarUsuario(id: number): void {
    if (confirm('¿Está seguro de desactivar este usuario?')) {
      this.userService.deactivateUser(id).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: (error) => {
          this.error = 'Error al desactivar usuario';
          console.error('Error:', error);
        }
      });
    }
  }

  activarUsuario(id: number): void {
    if (confirm('¿Está seguro de reactivar este usuario?')) {
      this.userService.activateUser(id).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: (error) => {
          this.error = 'Error al activar usuario';
          console.error('Error:', error);
        }
      });
    }
  }
}
