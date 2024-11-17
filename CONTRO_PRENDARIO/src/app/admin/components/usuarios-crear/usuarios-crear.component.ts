import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { Router, RouterConfigOptions } from '@angular/router';
import { UserCreationDTO } from '../../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";

@Component({
  selector: 'app-usuarios-crear',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './usuarios-crear.component.html',
  styleUrl: './usuarios-crear.component.css'
})
export class UsuariosCrearComponent implements OnInit {
  userForm!: FormGroup;
  roles: string[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  selectedRoles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.roles = this.userService.getRoles();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      nombre: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

    onRoleChange(role: string, event: Event): void {
      const checkbox = event.target as HTMLInputElement;
      if (checkbox.checked) {
        this.selectedRoles = [...this.selectedRoles, role];
      } else {
        this.selectedRoles = this.selectedRoles.filter(r => r !== role);
      }
    }

    isRoleSelected(role: string): boolean {
      return this.selectedRoles.includes(role);
    }

    isFormValid(): boolean {
      return this.userForm.valid && this.selectedRoles.length > 0;
    }

    private passwordMatchValidator(group: FormGroup) {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    }

  onSubmit(): void {
    if (!this.isFormValid()) {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      
      if (this.selectedRoles.length === 0) {
        this.error = 'Debe seleccionar al menos un rol';
      }
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    const userData: UserCreationDTO = {
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      confirmPassword: this.userForm.value.confirmPassword,
      nombre: this.userForm.value.nombre,
      roles: this.selectedRoles
    };

    this.userService.createUser(userData).subscribe({
      next: () => {
        this.successMessage = 'Usuario creado exitosamente';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Error al crear el usuario';
        this.isLoading = false;
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

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';
    
    if (control.errors['required']) {
      return 'Este campo es requerido';
    }
    if (control.errors['email']) {
      return 'Email inválido';
    }
    if (control.errors['minlength']) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (this.userForm.errors?.['passwordMismatch'] && 
        (controlName === 'password' || controlName === 'confirmPassword')) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }

  onCancel(): void {
    this.router.navigate(['/usuarios']);
  }

  hasError(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
