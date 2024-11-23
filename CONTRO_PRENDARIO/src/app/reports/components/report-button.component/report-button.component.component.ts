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
        const link = document.createElement('a');
        link.href = url;
        link.download = `documento_empeno_${this.prestamoId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al generar reporte:', error);
        this.isLoading = false;
      }
    });
  }
}
