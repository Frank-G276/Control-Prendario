import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../pages/components/header/header.component';
import { SidebarComponent } from '../../../pages/components/sidebar/sidebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.interface';

@Component({
  selector: 'app-cliente-view',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './cliente-view.component.html',
  styleUrl: './cliente-view.component.css'
})
export class ClienteViewComponent implements OnInit{
  
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private router = inject(Router);

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
        this.router.navigate(['/clientes']);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/clientes']);
  }

}
