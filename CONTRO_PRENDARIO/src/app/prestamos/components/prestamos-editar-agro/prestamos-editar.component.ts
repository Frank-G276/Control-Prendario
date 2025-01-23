import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrestamoService } from '../../services/prestamo.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { Cliente } from '../../../clientes/models/cliente.interface';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-prestamosMaquina-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, HeaderComponent, TranslateModule],
  templateUrl: './prestamos-editar.component.html',
  styleUrl: './prestamos-editar.component.css'
})
export class PrestamosMaquinaEditarComponent implements OnInit{

  private fb = inject(FormBuilder);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private prestamoService = inject(PrestamoService);
  private clienteService = inject(ClienteService);
  private translateService = inject(TranslateService);

  tiposMaquina: string[] = ['GUADAÑA', 'MOTOSIERRA', 'FUMIGADORA A MOTOR', 'OTRO'];
  modelosDisponibles: number[] = [];
  loanForm!: FormGroup;
  loading = false;
  error = '';
  successMessage = '';
  prestamoId: number | null = null;
  clientes: any[] = [];
  clienteSeleccionado: Cliente | null = null;
  clientesEncontrados: Cliente[] = [];
  buscadorControl = this.fb.control('');
  mostrarResultados = false;
  buscando = false;

  ngOnInit() {
    this.initializeForms();
    this.initializeModelosDisponibles();
    this.setupBuscadorClientes();
    this.loadPrestamoData();
  }

  private initializeModelosDisponibles() {
    const currentYear = new Date().getFullYear() + 1;
    const startYear = currentYear - 44;
    this.modelosDisponibles = Array.from(
      { length: currentYear - startYear + 3 },
      (_, index) => currentYear - index
    ).sort((a, b) => b - a);
  }

  private setupBuscadorClientes() {
    this.buscadorControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(termino => {
        if (!termino || termino.length < 2) {
          this.mostrarResultados = false;
          return of([]);
        }
        this.buscando = true;
        return this.clienteService.buscarClientes(termino, termino);
      })
    ).subscribe({
      next: (clientes) => {
        this.clientesEncontrados = clientes;
        this.mostrarResultados = true;
        this.buscando = false;
      },
      error: (error) => {
        console.error('Error en la búsqueda:', error);
        this.error = 'Error al buscar clientes';
        this.buscando = false;
      }
    });
  }

  onClienteCreado(cliente: Cliente) {
    this.seleccionarCliente(cliente);
    this.clientesEncontrados = [cliente];
  }

  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.loanForm.patchValue({
      idCliente: cliente.idCliente
    });
    this.buscadorControl.setValue(
      `${cliente.nombres} ${cliente.apellidos} - ${cliente.numeroDocumento}`, 
      { emitEvent: false }
    );
    this.mostrarResultados = false;
  }

  limpiarSeleccion() {
    this.clienteSeleccionado = null;
    this.buscadorControl.setValue('');
    this.loanForm.patchValue({
      idCliente: ''
    });
  }

  private loadPrestamoData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.prestamoId = +id;
      this.loading = true;

      this.prestamoService.getPrestamoPorId(this.prestamoId).subscribe({
        next: (prestamo) => {
          this.loanForm.patchValue({
            idCliente: prestamo.cliente?.idCliente,
            tipoMaquina: prestamo.tipoMaquina,
            marcaMaquina: prestamo.marcaMaquina,
            montoPrestamo: prestamo.montoPrestamo,
            tasaInteres: prestamo.tasaInteres,
            observaciones: prestamo.observaciones
          });

          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading prestamo:', error);
          this.error = 'Error al cargar los datos del préstamo';
          this.loading = false;
        }
      });
    }
  }

  private initializeForms() {
    this.loanForm = this.fb.group({
      idCliente: ['', Validators.required],
      tipoMaquina: ['', Validators.required],
      marcaMaquina: ['', Validators.required],
      montoPrestamo: ['', [Validators.required, Validators.min(0)]],
      tasaInteres: [5, [Validators.required, Validators.min(0), Validators.max(100)]],
      observaciones: ['']
    });
  }

  onSubmit() {
    if (this.loanForm.invalid || !this.prestamoId) {
      this.markFormGroupTouched(this.loanForm);
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';
    
    const prestamoData = {
      idCliente: Number(this.loanForm.value.idCliente),
      tipoMaquina: this.loanForm.value.tipoMaquina,
      marcaMaquina:this.loanForm.value.marcaMaquina,
      montoPrestamo: Number(this.loanForm.value.montoPrestamo),
      tasaInteres: Number(this.loanForm.value.tasaInteres),
      observaciones: this.loanForm.value.observaciones || '',
      
    };

    this.prestamoService.actualizarPrestamo(this.prestamoId, prestamoData).subscribe({
      next: (response) => {
        console.log('Préstamo actualizado:', response);
        this.translateService.get('LOAN_EDIT.SUCCESS_MESSAGE').subscribe((res: string) => {
          this.successMessage = res;
        });
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/prestamos/maquina/ver', this.prestamoId]);
        }, 1500);
      },
      error: (error) => {
        console.error('Error:', error);
        this.translateService.get('LOAN_EDIT.ERROR_MESSAGE').subscribe((res: string) => {
          this.error = error.message || res;
        });
        this.loading = false;
      }
    });
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();
      if (control instanceof FormGroup) {
      this.markFormGroupTouched(control);
      }
    });
  }
}
