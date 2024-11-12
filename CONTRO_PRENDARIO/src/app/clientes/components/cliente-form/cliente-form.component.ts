// cliente-form.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Cliente } from '../../models/cliente.interface';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent {

  @Output() clienteCreado = new EventEmitter<Cliente>();
  
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
       
      }
    });
  }

  

  onSubmit(): void {
    if (this.clienteForm.valid) {
 
        this.clienteService.crearCliente(this.clienteForm.value).subscribe({
        next: (cliente) => {
          this.clienteCreado.emit(cliente); // Emitir el cliente creado
          this.clienteForm.reset();
          
        },
        error: (error) => {
          console.error('Error al guardar', error);
        }
      });
    }
  }

}