import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../pages/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../pages/components/header/header.component';
import { Router, RouterModule, } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PagoService } from '../../services/pago.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pagos-lista',
  standalone: true,
  imports: [TranslateModule, SidebarComponent, HeaderComponent, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './pagos-lista.component.html',
  styleUrl: './pagos-lista.component.css'
})
export class PagosListaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private pagoService = inject(PagoService);
  private router = inject(Router);
  private translateService = inject(TranslateService);

  pagos: any[] = [];
  pagosFiltrados: any[] = [];
  loading = true;
  error = '';

  readonly tiposPago = ['CAPITAL', 'INTERES', 'MORA'];
  readonly metodosPago = ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA'];

  filtrosForm: FormGroup = this.fb.group({
    nombreCliente: [''],
    fechaPago: [''],
    tipoPago: [''],
    metodoPago: ['']
  });

  ngOnInit(): void {
    this.cargarPagos();
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

  private cargarPagos() {
    this.loading = true;
    this.pagoService.obtenerTodosPagos().subscribe({
      next: (pagos) => {
        this.pagos = pagos;
        this.pagosFiltrados = pagos;
        this.loading = false;
      },
      error: (error) => {
        this.translateService.get('PAYMENTS.ERROR_LOADING').subscribe((res: string) => {
          this.error = res;
        });
        this.loading = false;
        console.error('Error cargando pagos:', error);
      }
    });
  }

  private aplicarFiltros() {
    let pagosFiltrados = [...this.pagos];
    const filtros = this.filtrosForm.value;

    if (filtros.nombreCliente) {
      const termino = filtros.nombreCliente.toLowerCase();
      pagosFiltrados = pagosFiltrados.filter(pago =>
        pago.prestamo?.cliente?.nombres?.toLowerCase().includes(termino) ||
        pago.prestamo?.cliente?.apellidos?.toLowerCase().includes(termino) ||
        pago.prestamo?.cliente?.numeroDocumento?.toLowerCase().includes(termino)
      );
    }

    if (filtros.fechaPago) {
      const fechaBusqueda = new Date(filtros.fechaPago).toISOString().split('T')[0];
      pagosFiltrados = pagosFiltrados.filter(pago =>
        pago.fechaPago?.toString().includes(fechaBusqueda)
      );
    }

    if (filtros.tipoPago) {
      pagosFiltrados = pagosFiltrados.filter(pago =>
        pago.tipoPago === filtros.tipoPago
      );
    }

    if (filtros.metodoPago) {
      pagosFiltrados = pagosFiltrados.filter(pago =>
        pago.metodoPago === filtros.metodoPago
      );
    }

    this.pagosFiltrados = pagosFiltrados;
  }

  limpiarFiltros() {
    this.filtrosForm.reset();
    this.pagosFiltrados = this.pagos;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString(this.translateService.currentLang);
  }

  formatMoney(amount: number): string {
    return new Intl.NumberFormat(this.translateService.currentLang, {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }

  verPrestamo(idPrestamo: number): void {
    this.router.navigate(['/prestamos/ver', idPrestamo]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/pagos/nuevo']);
  }
}
