// cliente-form.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  clienteId?: number;
  isEditing = false;

  clienteForm: FormGroup = this.fb.group({
    tipoDocumento: ['CEDULA', Validators.required],
    numeroDocumento: ['', Validators.required],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    fechaNacimiento: [''],
    direccion: [''],
    ciudad: ['', Validators.required],
    telefono: ['', Validators.required],
    email: ['',  Validators.email]
  });

 
  ngOnInit() {
    // Verifica si hay un ID en la ruta para edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clienteId = +params['id'];
        this.isEditing = true;
        this.cargarCliente(this.clienteId);
      }
    });
  }

  private cargarCliente(id: number) {
    this.clienteService.obtenerClientePorId(id).subscribe({
      next: (cliente) => {
        this.clienteForm.patchValue(cliente);
      },
      error: (error) => {
        console.error('Error al cargar cliente', error);
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const operation = this.isEditing
        ? this.clienteService.actualizarCliente(this.clienteId!, this.clienteForm.value)
        : this.clienteService.crearCliente(this.clienteForm.value);

      operation.subscribe({
        next: (response) => {
          console.log(this.isEditing ? 'Cliente actualizado' : 'Cliente guardado', response);
          this.router.navigate(['/clientes']).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          console.error('Error al guardar', error);
        }
      });
    }
  }

}