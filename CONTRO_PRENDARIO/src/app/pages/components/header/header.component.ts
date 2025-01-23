// header.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { PrestamoService } from '../../../prestamos/services/prestamo.service';
import { Maquina, Prestamo } from '../../../prestamos/models/prestamo.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LenguageSelectorComponent } from "../../../internationalization/components/lenguage-selector/lenguage-selector.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{

  userName: string = '';
  userRole: string = '';
  searchTerm: string = '';
  searchResults: Prestamo[] = [];
  searchResultsMaquinas: Maquina[] = [];
  showResults: boolean = false;
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | null = null;

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router,
    private prestamoService: PrestamoService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getCurrentUsername();
    const role = this.authService.getCurrentUserRole();
    this.translateService.get(`ROLES.${role}`).subscribe((res: string) => {
      this.userRole = res;
    });

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(termino => {
        if (!termino){ 
          this.searchResults = [];
          return [];
        }
        return this.prestamoService.buscarPrestamos('vehiculo',termino, '');
       })
     )
      .subscribe(results => {
      this.searchResults = results;
      this.showResults = results.length > 0;
    });

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(termino => {
        if (!termino){ 
          this.searchResults = [];
          return [];
        }
        return this.prestamoService.buscarPrestamos('maquina',termino, '');
       })
     )
      .subscribe(results => {
      this.searchResultsMaquinas = results;
      this.showResults = results.length > 0;
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
    
  }

  selectPrestamo(prestamo: Prestamo): void {
    console.log('Préstamo seleccionado:', prestamo);
    this.router.navigate(['/prestamos/ver', prestamo.idPrestamo]);
    this.searchTerm = '';
    this.showResults = false;
  }

  selectPrestamoMaquina(prestamo: Maquina): void {
    console.log('Préstamo seleccionado:', prestamo);
    this.router.navigate(['/prestamos/maquina/ver', prestamo.idPrestamoMaquina]);
    this.searchTerm = '';
    this.showResults = false;
  }

  onBlur(): void {
    // Aumentamos el retraso para dar más tiempo al clic
    setTimeout(() => {
      this.showResults = false;
    }, 300);
  }
}