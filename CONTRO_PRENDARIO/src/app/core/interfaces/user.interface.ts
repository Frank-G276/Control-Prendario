export interface UserCreationDTO {
    email: string;
    password: string;
    confirmPassword: string;
    nombre: string;
    roles: string[];
  }
  
  export interface User {
    id: number;
    email: string;
    nombre: string;
    roles: string[];
    activo: boolean;
  }

  export interface UserResponse {
    token: string;
    user: User;
    message?: string;
}

export interface UserError {
    error: string;
    field?: string;
    message: string;
}