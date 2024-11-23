import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../pages/components/header/header.component';
import { SidebarComponent } from '../../../pages/components/sidebar/sidebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PrestamoService } from '../../services/prestamo.service';
import { Prestamo } from '../../models/prestamo.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReportButtonComponent } from '../../../reports/components/report-button.component/report-button.component.component';

@Component({
  selector: 'app-prestamos-view',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    SidebarComponent, 
    TranslateModule,
    ReportButtonComponent 
  ],
  templateUrl: './prestamos-view.component.html',
  styleUrl: './prestamos-view.component.css'
})
export class PrestamosViewComponent implements OnInit{

  private route = inject(ActivatedRoute);
  private prestamoService = inject(PrestamoService);
  private router = inject(Router);
  private translateService = inject(TranslateService);

  prestamo?: Prestamo;
  loading = true;
  error = '';

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
    this.prestamoService.getPrestamoById(id).subscribe({
      next: (prestamo) => {
        this.prestamo = prestamo;
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
    return this.prestamo.montoPrestamo + (this.prestamo.montoPrestamo * ((this.prestamo.tasaInteres * 3) / 100));
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

  navigateToEdit(): void {
    if (this.prestamo?.idPrestamo) {
      this.router.navigate(['/prestamos/edit', this.prestamo.idPrestamo]);
    }
  }

}
