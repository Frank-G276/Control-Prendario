import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReporteService } from '../../reporte.service';

@Component({
  selector: 'app-report-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <button 
      class="btn btn-outline-primary"
      (click)="generarReporte()"
      [disabled]="isLoading">
      <i class="bi bi-file-pdf me-2"></i>
      <span *ngIf="!isLoading">{{ 'REPORT.GENERATE' | translate }}</span>
      <span *ngIf="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
    </button>
  `
})
export class ReportButtonComponent {
  @Input() prestamoId?: number;
  isLoading = false;

  constructor(private reporteService: ReporteService) {}

  generarReporte(): void {
    if (!this.prestamoId) return;

    this.isLoading = true;
    this.reporteService.generarDocumentoEmpeno(this.prestamoId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        // En lugar de crear un elemento 'a' para descargar, abrimos en nueva pestaña
        window.open(url, '_blank');
        
        // Es importante mantener la limpieza del URL creado
        // Podemos hacerlo después de un pequeño delay para asegurar que se haya abierto
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al generar reporte:', error);
        this.isLoading = false;
      }
    });
  }
}
