import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { RouterModule, Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Maquina, Prestamo, PrestamoBase, PrestamoConResumen, PrestamoMaquinaResponse } from '../../models/prestamo.interface';
import { PrestamoService } from '../../services/prestamo.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { forkJoin, Observable, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { Cliente } from '../../../clientes/models/cliente.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-prestamos-lista',
    standalone: true,
    imports: [CommonModule, HeaderComponent, SidebarComponent, RouterModule, DecimalPipe, ReactiveFormsModule, TranslateModule, FormsModule],
    templateUrl: './prestamos-lista.component.html',
    styleUrl: './prestamos-lista.component.css'
})
export class PrestamosListaComponent implements OnInit {
  private router = inject(Router);
  private prestamoService = inject(PrestamoService);
  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);
  private translateService = inject(TranslateService);
  
  prestamos: Prestamo[] = [];
  maquinas: Maquina[] = [];
  prestamosFiltrados: PrestamoBase[] = [];
  loading: boolean = true;
  error: string = '';
  selectTable : string = 'vehiculos';

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
    
    let prestamosFiltrados = [...this.prestamosFiltrados];
    const filtros = this.filtrosForm.value;
  
    const elementosAFiltrar = this.selectTable === 'vehiculos' ? this.prestamos : this.maquinas;
    prestamosFiltrados = [...elementosAFiltrar];

    if (filtros.numeroPrestamo) {
      prestamosFiltrados = prestamosFiltrados.filter(item => {
        const id = this.selectTable === 'vehiculos' 
          ? (item as Prestamo).idPrestamo
          : (item as Maquina).idPrestamoMaquina;
        return id?.toString().includes(filtros.numeroPrestamo);
      });
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
    this.prestamoService.getPrestamosConResumen(this.selectTable).subscribe({
      next: (prestamosConResumen: PrestamoConResumen[]) => {
        if (this.selectTable === 'vehiculos') {
          this.prestamos = prestamosConResumen.map(item => ({
            ...item.prestamo,
            resumenPagos: item.resumen,
            totalPagar: this.calculateTotal(item.prestamo.montoPrestamo, item.prestamo.tasaInteres),
            totalAbonado: (item.resumen.capitalPagado || 0) + (item.resumen.interesPagado || 0),
            saldoPendiente: this.calculateTotal(item.prestamo.montoPrestamo, item.prestamo.tasaInteres) - 
                           ((item.resumen.capitalPagado || 0) + (item.resumen.interesPagado || 0)) + 
                           this.calculateIntereses(item.prestamo.montoPrestamo, item.prestamo.tasaInteres)
          }));
          this.prestamosFiltrados = this.prestamos;
        } else if (this.selectTable === 'maquinas') {
            this.maquinas = prestamosConResumen.map(item =>({
              ...item.maquina,
              resumenPagos: item.resumen,
              totalPagar: this.calculateTotal(item.maquina.montoPrestamo, item.maquina.tasaInteres),
              totalAbonado: (item.resumen.capitalPagado || 0) + (item.resumen.interesPagado || 0),
              saldoPendiente: this.calculateTotal(item.maquina.montoPrestamo, item.maquina.tasaInteres) - 
                             ((item.resumen.capitalPagado || 0) + (item.resumen.interesPagado || 0)) + 
                             this.calculateIntereses(item.maquina.montoPrestamo, item.maquina.tasaInteres)
            }));
            this.prestamosFiltrados = this.maquinas;
        }
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
  
    deletePrestamo(item: PrestamoBase) {
      this.translateService.get('LOANS.CONFIRM_DELETE').subscribe((res: string) => {
          if (confirm(res)) {
            const id = this.getId(item);
            
              this.prestamoService.deletePrestamo(this.selectTable,id!).subscribe({
                  next: () => {
                      this.loadPrestamos();
                  },
                  error: (error) => {
                      console.error('Error deleting loan:', error);
                      this.translateService.get('LOANS.ERROR_DELETE').subscribe((res: string) => {
                          this.error = res;
                      });
                  }
              });
            
          }
      });
    }
  
    verPrestamo(item: PrestamoBase): void {
      const id = this.getId(item);
      if(id){
        this.router.navigate(['/prestamos/ver', id]);
      }
    }

    formatDate(date: string | Date): string {
      if (!date) return '';
      return new Date(date).toLocaleDateString();
    }
  
    calculateTotal(montoPrestamo: number, tasaInteres: number): number {
      const interesTotal = this.prestamoService.calcularInteresTotal(montoPrestamo, tasaInteres);
      return montoPrestamo;
    }
  
    calculateIntereses(montoPrestamo: number, tasaInteres: number): number {
      const interesTotal = this.prestamoService.calcularInteresTotal(montoPrestamo, tasaInteres);
      return interesTotal;
    }

    navigateToEdit(item: PrestamoBase) {
      const id = this.getId(item);
      this.router.navigate(['/prestamos/edit', id]);
    }
  
    navigateToCreate() {
      this.router.navigate(['/prestamos/nuevo']);
    }
    navigateToCreateA() {
      this.router.navigate(['/prestamos/new']);
    }
    
  onTableChange() {
      this.loadPrestamos();
  }
  
  getId(item: PrestamoBase): number | undefined {
    return this.selectTable === 'vehiculos' 
        ? (item as Prestamo).idPrestamo 
        : (item as Maquina).idPrestamoMaquina;
  }
  
}