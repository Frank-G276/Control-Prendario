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

  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  clientesAPaginar: Cliente[] = [];
  protected Math = Math;

  ngOnInit(): void {
    this.cargarClientes();
  }

  actualizarLista() {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.obtenerClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.totalItems = this.clientes.length;
        this.currentPage = 1; // Reset a la primera página cuando se aplican filtros
        this.updatePaginatedItems();
      },
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

  private updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.clientesAPaginar = this.clientes.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedItems();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    const totalPages = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(current - Math.floor(maxVisible / 2), 1);
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisible + 1, 1);
    }

    const pages = [];

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push(-1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(-1);
      pages.push(totalPages);
    }

    return pages;
  }
}