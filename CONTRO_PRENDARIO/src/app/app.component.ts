import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './pages/header/header.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { LoginOneComponent } from './pages/login-one/login-one.component';
import { VistaClienteOneComponent } from "./pages/vista-cliente-one/vista-cliente-one.component";
import { ClienteListaComponent } from './clientes/components/cliente-lista/cliente-lista.component';
import { ClienteFormComponent } from './clientes/components/cliente-form/cliente-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, LoginOneComponent, VistaClienteOneComponent, ClienteListaComponent
    ,ClienteFormComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router) {}
  title = 'CONTRO_PRENDARIO';
  
}
