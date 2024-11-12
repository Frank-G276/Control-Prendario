import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login-one',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login-one.component.html',
  styleUrl: './login-one.component.css'
})
export class LoginOneComponent {
  
  // El constructor se coloca directamente dentro de la clase
  constructor(private router: Router) {}

  navigateToCliente() {
    this.router.navigate(['/Cliente']);
  }

  navigateToAdministrador() {
    this.router.navigate(['/Administrador']);
  }
}
