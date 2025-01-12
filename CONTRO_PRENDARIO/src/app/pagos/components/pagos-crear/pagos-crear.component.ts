import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../pages/components/header/header.component';
import { SidebarComponent } from '../../../pages/components/sidebar/sidebar.component';
import { PagoService } from '../../services/pago.service';
import { PrestamoService } from '../../../prestamos/services/prestamo.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { PrestamoSeleccionado, ResumenPrestamo  } from '../../interfaces/pago.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pagos-crear',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    SidebarComponent,
    TranslateModule
  ],
  templateUrl: './pagos-crear.component.html',
  styleUrl: './pagos-crear.component.css'
})
export class PagosCrearComponent implements OnInit{

  private fb = inject(FormBuilder);
  private pagoService = inject(PagoService);
  private prestamoService = inject(PrestamoService);
  private router = inject(Router);
  private translateService = inject(TranslateService);

  pagoForm: FormGroup;
  prestamosEncontrados: any[] = [];
  prestamoSeleccionado: PrestamoSeleccionado | null = null;
  loading = false;
  error = '';
  success = '';

  readonly tiposPago = ['CAPITAL', 'INTERES'];
  readonly metodosPago = ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA'];

  constructor() {
    this.pagoForm = this.fb.group({
      busquedaPrestamo: ['', Validators.required],
      idPrestamo: ['', Validators.required],
      montoPagado: ['', [Validators.required, Validators.min(0)]],
      tipoPago: ['', Validators.required],
      metodoPago: ['', Validators.required],
      observaciones: ['']
    });

     // Configurar la búsqueda de préstamos
    this.pagoForm.get('busquedaPrestamo')?.valueChanges
     .pipe(
       debounceTime(300),
       distinctUntilChanged(),
       switchMap(termino => {
         if (!termino) return [];
         return this.prestamoService.buscarPrestamos(termino, '');
       })
     )
     .subscribe({
       next: (prestamos) => {
        this.prestamosEncontrados = prestamos;
        this.loading = false;
       },
       error: (error) => {
        this.translateService.get('PAYMENT_CREATE.ERROR_SEARCHING_LOANS').subscribe((res: string) => {
          this.error = res;
        });
        this.loading = false;
      }
    });
  }
 
  ngOnInit(): void {
  }

  seleccionarPrestamo(prestamo: any): void {
    this.prestamoSeleccionado = null;
    this.pagoForm.patchValue({
      idPrestamo: prestamo.idPrestamo,
      busquedaPrestamo: `${prestamo.cliente.nombres} ${prestamo.cliente.apellidos}`
    });
    this.prestamosEncontrados = [];

    this.pagoService.obtenerResumenPagos('vehiculos',prestamo.idPrestamo).subscribe({
      next: (resumen: ResumenPrestamo) => {
        this.prestamoSeleccionado = {
          ...prestamo,
          capitalPagado: resumen.capitalPagado,
          interesPagado: resumen.interesPagado,
          capitalPendiente: resumen.capitalPendiente,
          interesPendiente: resumen.interesPendiente,
          totalPagado: resumen.capitalPagado + resumen.interesPagado,
          totalPendiente: resumen.capitalPendiente + resumen.interesPendiente
        };
      },
      error: (error) => {
        this.translateService.get('PAYMENT_CREATE.ERROR_LOADING_SUMMARY').subscribe((res: string) => {
          this.error = res;
        });
        console.error('Error:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.pagoForm.valid && this.prestamoSeleccionado) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const montoIngresado = this.pagoForm.value.montoPagado;
      const tipoPago = this.pagoForm.value.tipoPago;
      let montoPendiente = 0;

      // Calcular monto pendiente según tipo de pago
      switch(tipoPago) {
        case 'CAPITAL':
          montoPendiente = this.prestamoSeleccionado.capitalPendiente;
          break;
        case 'INTERES':
          montoPendiente = this.prestamoSeleccionado.interesPendiente;
          break;
      }

      // Validar que el monto no exceda lo pendiente
      if (montoIngresado > montoPendiente) {
        this.translateService.get('PAYMENT_CREATE.AMOUNT_EXCEEDS_PENDING', {
          amount: this.formatMoney(montoIngresado),
          pending: this.formatMoney(montoPendiente)
        }).subscribe((res: string) => {
          this.error = res;
        });
        this.loading = false;
        return;
      }

      const pago = {
        prestamo: {
          idPrestamo: this.pagoForm.value.idPrestamo
        },
        montoPagado: montoIngresado,
        tipoPago: tipoPago,
        metodoPago: this.pagoForm.value.metodoPago,
        observaciones: this.pagoForm.value.observaciones
      };

      this.pagoService.crearPago(pago).subscribe({
        next: (response) => {
          this.translateService.get('PAYMENT_CREATE.SUCCESS_MESSAGE').subscribe((res: string) => {
            this.success = res;
          });
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/prestamos/ver', pago.prestamo.idPrestamo]);
          }, 2000);
        },
        error: (error) => {
          this.translateService.get('PAYMENT_CREATE.ERROR_REGISTERING').subscribe((res: string) => {
            this.error = error.error || res;
          });
          this.loading = false;
        }
      });
    } else {
      this.translateService.get('PAYMENT_CREATE.FILL_ALL_FIELDS').subscribe((res: string) => {
        this.error = res;
      });
    }
  }

  limpiarFormulario(): void {
    this.pagoForm.reset();
    this.prestamoSeleccionado = null;
    this.prestamosEncontrados = [];
    this.error = '';
    this.success = '';
  }

  cancelar(): void {
    this.router.navigate(['/prestamos']);
  }

  // Helper para formatear moneda
  formatMoney(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }
}
