import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-movimiento-lista',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterModule],
  templateUrl: './movimiento-lista.component.html',
  styleUrl: './movimiento-lista.component.css'
})
export class MovimientoListaComponent {
  private router = inject(Router);

}
