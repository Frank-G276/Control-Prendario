import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Prestamo } from '../../../prestamos/models/prestamo.interface';
import { PublicPrestamoService } from '../../services/public-prestamos.service';

@Component({
  selector: 'app-vista-cliente-one',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './vista-cliente-one.component.html',
  styleUrls: ['./vista-cliente-one.component.css']
})
export class VistaClienteOneComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  searchResults: Prestamo[] = [];
  showResults: boolean = false;
  isLoading: boolean = false;
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | null = null;

  constructor(
    private prestamoService: PublicPrestamoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.isLoading = true;
        return this.prestamoService.buscarPrestamos(term, term);
      })
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.showResults = results.length > 0;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showResults = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchInput(): void {
    if (this.searchTerm && this.searchTerm.length >= 3) {
      this.searchSubject.next(this.searchTerm);
    } else {
      this.searchResults = [];
      this.showResults = false;
    }
  }

  selectPrestamo(prestamo: Prestamo): void {
    this.router.navigate(['/consulta-prestamos', prestamo.idPrestamo]);
    console.log("Clic");
  }

  onBlur(): void {
    setTimeout(() => {
      this.showResults = false;
    }, 400);
  }
}