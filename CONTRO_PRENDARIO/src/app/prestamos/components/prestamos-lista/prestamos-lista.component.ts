import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { RouterModule, Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Prestamo } from '../../models/prestamo.interface';
import { PrestamoService } from '../../services/prestamo.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { forkJoin, Observable, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { Cliente } from '../../../clientes/models/cliente.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-prestamos-lista',
    standalone: true,
    imports: [CommonModule, HeaderComponent, SidebarComponent, RouterModule, DecimalPipe, ReactiveFormsModule],
    templateUrl: './prestamos-lista.component.html',
    styleUrl: './prestamos-lista.component.css'
  })
  export class PrestamosListaComponent implements OnInit {
    private router = inject(Router);
    private prestamoService = inject(PrestamoService);
    private clienteService = inject(ClienteService);
    private fb = inject(FormBuilder);
  
    prestamos: Prestamo[] = [];
    prestamosFiltrados: Prestamo[] = [];
    loading: boolean = true;
    error: string = '';

    estadosPrestamo = ['ACTIVO', 'PENDIENTE', 'VENCIDO', 'PAGADO'];
  
    filtrosForm: FormGroup = this.fb.group({
      numeroPrestamo: [''],
      nombreCliente: [''],
      fechaCreacion: [''],
      fechaVencimiento: [''],
      estado: ['']
    });

    ngOnInit() {
      this.loadPrestamos();
      this.setupFiltros();
    }

    private setupFiltros() {
      this.filtrosForm.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe(() => {
          this.aplicarFiltros();
        });
    }
  
    private aplicarFiltros() {
      let prestamosFiltrados = [...this.prestamos];
      const filtros = this.filtrosForm.value;
  
      if (filtros.numeroPrestamo) {
        prestamosFiltrados = prestamosFiltrados.filter(prestamo => 
          prestamo.idPrestamo?.toString().includes(filtros.numeroPrestamo)
        );
      }
  
      if (filtros.nombreCliente) {
        const termino = filtros.nombreCliente.toLowerCase();
        prestamosFiltrados = prestamosFiltrados.filter(prestamo =>
          prestamo.cliente?.nombres?.toLowerCase().includes(termino) ||
          prestamo.cliente?.apellidos?.toLowerCase().includes(termino) ||
          prestamo.cliente?.numeroDocumento?.toLowerCase().includes(termino)
        );
      }
  
      if (filtros.fechaCreacion) {
        const fechaBusqueda = new Date(filtros.fechaCreacion).toISOString().split('T')[0];
        prestamosFiltrados = prestamosFiltrados.filter(prestamo =>
          prestamo.fechaPrestamo?.toString().includes(fechaBusqueda)
        );
      }
  
      if (filtros.fechaVencimiento) {
        const fechaBusqueda = new Date(filtros.fechaVencimiento).toISOString().split('T')[0];
        prestamosFiltrados = prestamosFiltrados.filter(prestamo =>
          prestamo.fechaVencimiento?.toString().includes(fechaBusqueda)
        );
      }
  
      if (filtros.estado) {
        prestamosFiltrados = prestamosFiltrados.filter(prestamo =>
          prestamo.estadoPrestamo === filtros.estado
        );
      }
  
      this.prestamosFiltrados = prestamosFiltrados;
    }

    loadPrestamos() {
      this.loading = true;
      this.error = '';
  
      this.prestamoService.getPrestamosConResumen().subscribe({
        next: (prestamosConResumen) => {
          this.prestamos = prestamosConResumen.map(item => ({
            ...item.prestamo,
            resumenPagos: item.resumen,
            totalPagar: this.calculateTotal(item.prestamo.montoPrestamo, item.prestamo.tasaInteres),
            totalAbonado: (item.resumen.capitalPagado || 0) + (item.resumen.interesPagado || 0),
            saldoPendiente: this.calculateTotal(item.prestamo.montoPrestamo, item.prestamo.tasaInteres) - 
                           ((item.resumen.capitalPagado || 0) + (item.resumen.interesPagado || 0))
          }));
          this.prestamosFiltrados = this.prestamos;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading loans:', error);
          this.error = 'Error al cargar los préstamos';
          this.loading = false;
        }
      });
    }

    limpiarFiltros() {
      this.filtrosForm.reset();
      this.prestamosFiltrados = this.prestamos;
    }
  
    deletePrestamo(id: number) {
      if (confirm('¿Está seguro de que desea eliminar este préstamo?')) {
        this.prestamoService.deletePrestamo(id).subscribe({
          next: () => {
            this.loadPrestamos();
          },
          error: (error) => {
            console.error('Error deleting loan:', error);
            this.error = 'Error al eliminar el préstamo';
          }
        });
      }
    }
  
    verPrestamo(id: number): void {
      this.router.navigate(['/prestamos/ver', id]);
    }

    formatDate(date: string | Date): string {
      if (!date) return '';
      return new Date(date).toLocaleDateString();
    }
  
    calculateTotal(montoPrestamo: number, tasaInteres: number): number {
      const interesTotal = this.prestamoService.calcularInteresTotal(montoPrestamo, tasaInteres);
      return montoPrestamo + interesTotal;
    }
  
    navigateToEdit(id: number) {
      this.router.navigate(['/prestamos/edit', id]);
    }
  
    navigateToCreate() {
      this.router.navigate(['/prestamos/nuevo']);
    }
  }