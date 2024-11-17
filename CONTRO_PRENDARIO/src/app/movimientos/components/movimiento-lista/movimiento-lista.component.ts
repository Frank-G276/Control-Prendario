import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovimientoService } from '../../services/movimiento.service';

@Component({
  selector: 'app-movimiento-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './movimiento-lista.component.html',
  styleUrl: './movimiento-lista.component.css'
})
export class MovimientoListaComponent implements OnInit{
  private movimientoService = inject(MovimientoService);
  private router = inject(Router);

  movimientos: any[] = [];
  loading = true;
  error = '';
  

  balance = {
    movimientos: 0,
    pagos: 0,
    prestamos: 0,
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
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los movimientos';
        this.loading = false;
        console.error('Error:', error);
      }
    });
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
    return new Date(date).toLocaleString();
  }

  formatMoney(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }

  navigateToCreate(): void {
    this.router.navigate(['/movimientos/nuevo']);
  }
}
