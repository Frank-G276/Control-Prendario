import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ClienteFormComponent } from '../../../clientes/components/cliente-form/cliente-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PrestamoService } from '../../services/prestamo.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { Cliente } from '../../../clientes/models/cliente.interface';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PrestamoMaquinaService } from '../../services/prestamo-maquina.service';

@Component({
  selector: 'app-prestamos-crearagro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ClienteFormComponent, HeaderComponent, SidebarComponent, TranslateModule],
  templateUrl: './prestamos-crear.component.html',
  styleUrl: './prestamos-crear.component.css'
})
export class PrestamosCrearAgroComponent implements OnInit{
  private fb = inject(FormBuilder);
  router = inject(Router);
  private prestamoMaquinaService = inject(PrestamoMaquinaService)
  private clienteService = inject(ClienteService);
  private translateService = inject(TranslateService);
   
  tiposMaquinas: string[] = ['GUADAÑA', 'MOTOSIERRA', 'FUMIGADORA A MOTOR', 'ESTACIONARIA'];
  modelosDisponibles: number[] = [];
  loanForm!: FormGroup;
  loading = false;
  error = '';
  successMessage = '';
  clientes: any[] = [];
  clienteSeleccionado: Cliente | null = null;
  clientesEncontrados: Cliente[] = [];
  buscadorControl = this.fb.control('');
  mostrarResultados = false;
  buscando = false;

  @ViewChild(ClienteFormComponent) clienteForm!: ClienteFormComponent;
      
  ngOnInit() {
    this.initializeForms();
    this.setupBuscadorClientes();
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
        this.translateService.get('LOAN_CREATE.CLIENT_SEARCH_ERROR').subscribe((res: string) => {
          this.error = res;
        });
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
    if (this.loanForm.invalid) {
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
      estadoPrestamo: 'ACTIVO',
    };

    this.prestamoMaquinaService.createPrestamoMaquina(prestamoData).subscribe({
      next: (response) => {
            console.log('Préstamo creado:', response);
            this.translateService.get('LOAN_CREATE.SUCCESS_MESSAGE').subscribe((res: string) => {
              this.successMessage = res;
            });
            this.loading = false;
            setTimeout(() => {
                this.router.navigate(['/prestamos']);
            }, 1500);
      },
      error: (error) => {
            console.error('Error:', error);
            this.translateService.get('LOAN_CREATE.ERROR_MESSAGE').subscribe((res: string) => {
              this.error = error.message || res;
            });
            this.loading = false;
      }
    });
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