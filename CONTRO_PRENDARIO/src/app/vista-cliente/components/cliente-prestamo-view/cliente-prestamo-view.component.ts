import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Prestamo } from '../../../prestamos/models/prestamo.interface';
import { PublicPrestamoService } from '../../services/public-prestamos.service';

@Component({
  selector: 'app-public-prestamo-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cliente-prestamo-view.component.html',
  styleUrls: ['./cliente-prestamo-view.component.css']
})
export class PublicPrestamoViewComponent implements OnInit {
  prestamo?: Prestamo;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private prestamoService: PublicPrestamoService,
    private router: Router
  ) {}

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
        this.error = 'No se pudo cargar la información del préstamo';
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
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }

  volver(): void {
    this.router.navigate(['/consulta-prestamos']);
  }
}