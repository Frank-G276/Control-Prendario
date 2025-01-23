import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovimientoService } from '../../services/movimiento.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-movimiento-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, TranslateModule],
  templateUrl: './movimiento-lista.component.html',
  styleUrl: './movimiento-lista.component.css'
})
export class MovimientoListaComponent implements OnInit {
  private movimientoService = inject(MovimientoService);
  private router = inject(Router);
  private translateService = inject(TranslateService);

  movimientos: any[] = [];
  loading = true;
  error = '';

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  movimientosAPaginar: any[] = [];
  protected Math = Math;
  
  balance = {
    movimientos: 0,
    pagos: 0,
    prestamos: 0,
    activos: 0,
    interes: 0,
    total: 0
  };

  ngOnInit(): void {
    this.cargarMovimientos();
    this.cargarBalance();
  }

  cargarMovimientos(): void {
    this.loading = true;
    this.movimientoService.obtenerMovimientos().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.totalItems = this.movimientos.length;
        this.currentPage = 1;
        this.updatePaginatedItems();
        this.loading = false;
      },
      error: (error) => {
        this.translateService.get('MOVEMENTS.ERROR_LOADING').subscribe((res: string) => {
          this.error = res;
        });
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  private updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.movimientosAPaginar = this.movimientos.slice(startIndex, endIndex);
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

  cargarBalance(): void {
    this.movimientoService.obtenerBalance().subscribe({
      next: (balance) => {
        this.balance = balance;
      },
      error: (error) => {
        console.error('Error al cargar el balance:', error);
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString(this.translateService.currentLang);
  }

  formatMoney(amount: number): string {
    return new Intl.NumberFormat(this.translateService.currentLang, {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }

  navigateToCreate(): void {
    this.router.navigate(['/movimientos/nuevo']);
  }
}