import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../pages/components/header/header.component';
import { SidebarComponent } from '../../../pages/components/sidebar/sidebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cliente-view',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, TranslateModule],
  templateUrl: './cliente-view.component.html',
  styleUrl: './cliente-view.component.css'
})
export class ClienteViewComponent implements OnInit {
  
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private translateService = inject(TranslateService);

  cliente?: Cliente;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.cargarCliente(id);
      }
    });
  }

  cargarCliente(id: number): void {
    this.clienteService.obtenerClientePorId(id).subscribe({
      next: (cliente) => this.cliente = cliente,
      error: (error) => {
        console.error('Error al cargar cliente', error);
        this.translateService.get('CLIENT_VIEW.ERROR_LOADING').subscribe((res: string) => {
          // Aquí puedes mostrar un mensaje de error
          console.error(res);
        });
        this.router.navigate(['/clientes']);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/clientes']);
  }
}