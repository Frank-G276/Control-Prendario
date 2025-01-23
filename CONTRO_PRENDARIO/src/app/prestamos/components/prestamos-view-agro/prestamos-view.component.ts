import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../pages/components/header/header.component';
import { SidebarComponent } from '../../../pages/components/sidebar/sidebar.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PrestamoService } from '../../services/prestamo.service';
import { Maquina } from '../../models/prestamo.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReportButtonMaquinaComponent } from '../../../reports/components/report-maquina.component/report-button.component.component';
import { PagoService } from '../../../pagos/services/pago.service';

@Component({
  selector: 'app-prestamosmaquina-view',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    SidebarComponent, 
    TranslateModule,
    ReportButtonMaquinaComponent ,
    RouterModule
  ],
  templateUrl: './prestamos-view.component.html',
  styleUrl: './prestamos-view.component.css'
})
export class PrestamosMaquinaViewComponent implements OnInit{

  private route = inject(ActivatedRoute);
  private prestamoService = inject(PrestamoService);
  private router = inject(Router);
  private translateService = inject(TranslateService);
  private pagoService = inject(PagoService);

  prestamo?: Maquina;
  loading = true;
  error = '';
  resumen: any;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.cargarPrestamo(id);
      }
    });
  }

  cargarPrestamo(id: number): void {
    this.loading = true;
    this.prestamoService.getPrestamoPorId(id).subscribe({
      next: (prestamo) => {
        this.prestamo = prestamo ;
        this.pagoService.obtenerResumenPagos('maquinas', prestamo.idPrestamoMaquina!).subscribe(resumen => {
          this.resumen = resumen; // Guardar el valor resuelto
          this.prestamo!.resumenPagos = this.resumen;
          console.log('Resumen:', this.resumen); // Aquí se imprimen los datos reales
        });
        this.loading = false;
      },
      error: (error) => {
        this.translateService.get('LOAN_VIEW.ERROR_LOADING').subscribe((res: string) => {
          this.error = res;
        });
        this.loading = false;
        console.error('Error al cargar préstamo', error);
      }
    });
  }

  calcularTotal(): number {
   if (!this.prestamo) return 0;
    return this.prestamo.resumenPagos?.capitalPendiente! + (this.prestamo.resumenPagos?.interesPendiente!);
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString(this.translateService.currentLang);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat(this.translateService.currentLang, {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }

  volver(): void {
    this.router.navigate(['/prestamos']);
  }

  navigateToEdit(): void {;
    if (this.prestamo?.idPrestamoMaquina) {
      this.router.navigate(['/prestamos/editar', this.prestamo.idPrestamoMaquina]);
    }
  }

  

}
