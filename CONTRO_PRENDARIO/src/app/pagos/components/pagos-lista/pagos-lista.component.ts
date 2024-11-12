import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../../pages/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../pages/components/header/header.component';
import { Router, RouterModule, } from '@angular/router';

@Component({
  selector: 'app-pagos-lista',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterModule],
  templateUrl: './pagos-lista.component.html',
  styleUrl: './pagos-lista.component.css'
})
export class PagosListaComponent {
  private router = inject(Router);

}
