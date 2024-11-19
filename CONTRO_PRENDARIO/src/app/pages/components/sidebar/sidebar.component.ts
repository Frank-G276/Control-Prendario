import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  private destroy$ = new Subject<void>();
  showSupportModal = false;

  constructor(
    private sidebarService: SidebarService,
    private translateService: TranslateService
  ) {}

  toggleSupportModal() {
    this.showSupportModal = !this.showSupportModal;
  }

  ngOnInit(): void {
    this.sidebarService.isCollapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isSidebarCollapsed = state;
      });

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