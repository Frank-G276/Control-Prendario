export interface LoginResponse {
  token: string;
  roles: string[];
  username: string;
  nombre: string;
}
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }

  export interface UserProfile {
    id: number;
    email: string;
    nombre: string;
    roles: string[];
  }