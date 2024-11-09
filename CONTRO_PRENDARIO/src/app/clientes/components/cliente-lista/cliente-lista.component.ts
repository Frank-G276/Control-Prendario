import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.interface';
import { HeaderComponent } from "../../../pages/header/header.component";
import { SidebarComponent } from "../../../pages/sidebar/sidebar.component";
import { ClienteFormComponent } from "../cliente-form/cliente-form.component";
import { ClienteEditarComponent } from "../cliente-editar/cliente-editar.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-lista',
  standalone: true,
  imports: [FormsModule,CommonModule, RouterModule, HeaderComponent, SidebarComponent, ClienteFormComponent, ClienteEditarComponent],
  templateUrl: './cliente-lista.component.html',
  styleUrl: './cliente-lista.component.css'
})
export class ClienteListaComponent implements OnInit{
  private clienteServie = inject(ClienteService);
  clientes : Cliente[] = [];
  selectedClienteId?: number;
  private router = inject(Router);
  nombreBusqueda: string = '';
  documentoBusqueda: string = '';

  ngOnInit(): void {
      this.cargarClientes();
  }

  actualizarLista() {
    this.cargarClientes();
  }
  cargarClientes(): void {
    this.clienteServie.obtenerClientes().subscribe({
      next: (data) => this.clientes = data,
      error: (error) => console.error('Error al cargar clientes', error)
    })
  }

  editarCliente(id: number): void {
    this.router.navigate(['/clientes/editar', id]);
  }

  eliminarCliente(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este cliente?')) {
      this.clienteServie.eliminarCliente(id).subscribe({
        next: () => {
          this.cargarClientes(); // Recargar la lista después de eliminar
          // Aquí podrías mostrar un mensaje de éxito
        },
        error: (error) => 
          console.error('Error al eliminar cliente', error)
          // Aquí podrías mostrar un mensaje de error
        
      });
    }
  }
  setSelectedCliente(id: number): void {
    this.selectedClienteId = id;
  }
  buscarClientes(): void {
    if (!this.nombreBusqueda && !this.documentoBusqueda) {
      this.cargarClientes();
      return;
    }

    this.clienteServie.buscarClientes(this.nombreBusqueda, this.documentoBusqueda)
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
