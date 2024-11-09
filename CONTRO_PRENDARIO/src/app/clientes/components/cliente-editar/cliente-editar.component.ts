// cliente-editar.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-cliente-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cliente-editar.component.html',
  styleUrl: './cliente-editar.component.css'
})
export class ClienteEditarComponent implements OnInit {
  @Input() clienteId?: number;  // Agregar input para recibir el ID
  @Input() modalId : string = '';

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);

  clienteEditar: FormGroup = this.fb.group({
    tipoDocumento: ['CEDULA', Validators.required],
    numeroDocumento: ['', Validators.required],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    fechaNacimiento: [''],
    direccion: [''],
    ciudad: ['', Validators.required],
    telefono: ['', Validators.required],
    email: ['', Validators.email]
  });  

  ngOnInit() {
    // Si tenemos un ID, cargamos los datos del cliente
    if (this.clienteId) {
      this.cargarCliente(this.clienteId);
    }
  }

  private cargarCliente(id: number) {
    this.clienteService.obtenerClientePorId(id).subscribe({
      next: (cliente) => {
        this.clienteEditar.patchValue({
          tipoDocumento: cliente.tipoDocumento,
          numeroDocumento: cliente.numeroDocumento,
          nombres: cliente.nombres,
          apellidos: cliente.apellidos,
          fechaNacimiento: cliente.fechaNacimiento,
          direccion: cliente.direccion,
          ciudad: cliente.ciudad,
          telefono: cliente.telefono,
          email: cliente.email
        });
      },
      error: (error) => {
        console.error('Error al cargar cliente', error);
      }
    });
  }

  onSubmit(): void {
    if (this.clienteEditar.valid && this.clienteId) {
      this.clienteService.actualizarCliente(this.clienteId, this.clienteEditar.value).subscribe({
        next: (response) => {
          console.log('Cliente actualizado', response);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error al actualizar', error);
        }
      });
    }
  }
  cerrarModal() {
    const modal = document.getElementById('staticBackdrop' + this.clienteId);
    if (modal) {
      modal.click(); // Esto simulará un clic en el botón de cerrar
    }
  }
}