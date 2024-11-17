// sidebar.component.ts
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  private destroy$ = new Subject<void>();

  constructor(private sidebarService: SidebarService) {}

  showSupportModal = false;

  toggleSupportModal() {
    this.showSupportModal = !this.showSupportModal;
  }

  ngOnInit(): void {
    // Suscribirse a los cambios del estado del sidebar
    this.sidebarService.isCollapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isSidebarCollapsed = state;
      });

    // Comprobar el tamaño de la pantalla al inicio
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      const isSmallScreen = window.innerWidth <= 700;
      this.sidebarService.setSidebarState(isSmallScreen);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }
}