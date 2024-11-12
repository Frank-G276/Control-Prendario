import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrestamoService } from '../../services/prestamo.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { ClienteFormComponent } from "../../../clientes/components/cliente-form/cliente-form.component";
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { Cliente } from '../../../clientes/models/cliente.interface';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';


@Component({
  selector: 'app-prestamos-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ClienteFormComponent, SidebarComponent, HeaderComponent],
  templateUrl: './prestamos-editar.component.html',
  styleUrl: './prestamos-editar.component.css'
})
export class PrestamosEditarComponent implements OnInit{

  private fb = inject(FormBuilder);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  private prestamoService = inject(PrestamoService);
  private clienteService = inject(ClienteService);

  tiposVehiculo: string[] = ['AUTOMOVIL', 'MOTOCICLETA', 'CAMIONETA', 'CAMION'];
  modelosDisponibles: number[] = [];
  vehicleForm!: FormGroup;
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
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 44;
    this.modelosDisponibles = Array.from(
      { length: currentYear - startYear + 1 },
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

      this.prestamoService.getPrestamoById(this.prestamoId).subscribe({
        next: (prestamo) => {
          if (prestamo.vehiculo) {
            const fechaMatriculaFormatted = this.formatDateForInput(prestamo.vehiculo.fechaMatricula);
                    
            this.vehicleForm.patchValue({
              ...prestamo.vehiculo,
              fechaMatricula: fechaMatriculaFormatted
            });
          }

          this.loanForm.patchValue({
            idCliente: prestamo.cliente?.idCliente,
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
    this.vehicleForm = this.fb.group({
      tipoVehiculo: ['', Validators.required],
      marca: ['', Validators.required],
      linea: ['', Validators.required],
      modelo: ['', [Validators.required, Validators.min(1900), Validators.max(2024)]],
      placa: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]+')]],
      cilindraje: ['', [Validators.required, Validators.min(0)]],
      color: ['', Validators.required],
      numeroMotor: ['', Validators.required],
      numeroChasis: ['', Validators.required],
      sitioMatricula: ['', Validators.required],
      fechaMatricula: ['', Validators.required],
      propietario: ['', Validators.required],
      numeroDocumentoPropietario: ['', Validators.required]
    });

    this.loanForm = this.fb.group({
      idCliente: ['', Validators.required],
      montoPrestamo: ['', [Validators.required, Validators.min(0)]],
      tasaInteres: [5, [Validators.required, Validators.min(0), Validators.max(100)]],
      observaciones: ['']
    });
  }

  onSubmit() {
    if (this.vehicleForm.invalid || this.loanForm.invalid || !this.prestamoId) {
      this.markFormGroupTouched(this.vehicleForm);
      this.markFormGroupTouched(this.loanForm);
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    const fechaMatriculaDate = new Date(this.vehicleForm.value.fechaMatricula);
    const prestamoData = {
      idCliente: Number(this.loanForm.value.idCliente),
      montoPrestamo: Number(this.loanForm.value.montoPrestamo),
      tasaInteres: Number(this.loanForm.value.tasaInteres),
      observaciones: this.loanForm.value.observaciones || '',
      vehiculo: {
        tipoVehiculo: this.vehicleForm.value.tipoVehiculo,
        marca: this.vehicleForm.value.marca.toUpperCase(),
        linea: this.vehicleForm.value.linea.toUpperCase(),
        modelo: Number(this.vehicleForm.value.modelo),
        placa: this.vehicleForm.value.placa.toUpperCase(),
        cilindraje: Number(this.vehicleForm.value.cilindraje),
        color: this.vehicleForm.value.color.toUpperCase(),
        numeroMotor: this.vehicleForm.value.numeroMotor.toUpperCase(),
        numeroChasis: this.vehicleForm.value.numeroChasis.toUpperCase(),
        sitioMatricula: this.vehicleForm.value.sitioMatricula.toUpperCase(),
        fechaMatricula: fechaMatriculaDate.toISOString().split('T')[0],
        propietario: this.vehicleForm.value.propietario.toUpperCase(),
        numeroDocumentoPropietario: this.vehicleForm.value.numeroDocumentoPropietario
      }
    };

    this.prestamoService.updatePrestamo(this.prestamoId, prestamoData).subscribe({
      next: (response) => {
        console.log('Préstamo actualizado:', response);
        this.successMessage = 'Préstamo actualizado exitosamente';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/prestamos']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error:', error);
        this.error = error.message || 'Error al actualizar el préstamo';
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
