import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovimientoService } from '../../services/movimiento.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movimiento-crear',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    SidebarComponent],
  templateUrl: './movimiento-crear.component.html',
  styleUrl: './movimiento-crear.component.css'
})
export class MovimientosCrearComponent {
  private fb = inject(FormBuilder);
  private movimientoService = inject(MovimientoService);
  private router = inject(Router);

  loading = false;
  error = '';
  success = '';

  movimientoForm: FormGroup = this.fb.group({
    tipoMovimiento: ['', Validators.required],
    monto: ['', [Validators.required, Validators.min(0)]]
  });

  onSubmit(): void {
    if (this.movimientoForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      this.movimientoService.crearMovimiento(this.movimientoForm.value).subscribe({
        next: () => {
          this.success = 'Movimiento registrado exitosamente';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/movimientos']);
          }, 2000);
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/movimientos']);
  }
}
