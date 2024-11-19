import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.interface';
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { ClienteFormComponent } from "../cliente-form/cliente-form.component";
import { ClienteEditarComponent } from "../cliente-editar/cliente-editar.component";
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cliente-lista',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HeaderComponent, SidebarComponent, ClienteFormComponent, ClienteEditarComponent, TranslateModule],
  templateUrl: './cliente-lista.component.html',
  styleUrl: './cliente-lista.component.css'
})
export class ClienteListaComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private translateService = inject(TranslateService);

  clientes: Cliente[] = [];
  selectedClienteId?: number;
  nombreBusqueda: string = '';
  documentoBusqueda: string = '';

  ngOnInit(): void {
    this.cargarClientes();
  }

  actualizarLista() {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.obtenerClientes().subscribe({
      next: (data) => this.clientes = data,
      error: (error) => console.error('Error al cargar clientes', error)
    });
  }

  editarCliente(id: number): void {
    this.router.navigate(['/clientes/editar', id]);
  }

  verCliente(id: number): void {
    this.router.navigate(['/clientes/ver', id]);
  }

  eliminarCliente(id: number): void {
    this.translateService.get('CLIENTS.CONFIRM_DELETE').subscribe((res: string) => {
      if (confirm(res)) {
        this.clienteService.eliminarCliente(id).subscribe({
          next: () => {
            this.cargarClientes();
            // Aquí podrías mostrar un mensaje de éxito
          },
          error: (error) => {
            console.error('Error al eliminar cliente', error);
            // Aquí podrías mostrar un mensaje de error
          }
        });
      }
    });
  }

  setSelectedCliente(id: number): void {
    this.selectedClienteId = id;
  }

  buscarClientes(): void {
    if (!this.nombreBusqueda && !this.documentoBusqueda) {
      this.cargarClientes();
      return;
    }

    this.clienteService.buscarClientes(this.nombreBusqueda, this.documentoBusqueda)
      .subscribe({
        next: (data) => {
          this.clientes = data;
        },
        error: (error) => console.error('Error en la búsqueda', error)
      });
  }

  limpiarBusqueda(): void {
    this.nombreBusqueda = '';
    this.documentoBusqueda = '';
    this.cargarClientes();
  }
}