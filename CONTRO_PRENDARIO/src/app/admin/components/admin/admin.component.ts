import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  userName: string = '';
  totalUsers: number = 0;
  totalLoans: number = 0;
  totalPayments: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Aquí puedes cargar datos iniciales desde tu backend
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Aquí implementarías las llamadas a tu API
    // Por ahora usamos datos de ejemplo
    this.totalUsers = 150;
    this.totalLoans = 324;
    this.totalPayments = 1250;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToUsers(): void {
    this.router.navigate(['/usuarios']);
  }

  navigateToLoans(): void {
    this.router.navigate(['/prestamos']);
  }

  navigateToPayments(): void {
    this.router.navigate(['/pagos']);
  }

  navigateToReports(): void {
    this.router.navigate(['/reportes']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/configuracion']);
  }
}
