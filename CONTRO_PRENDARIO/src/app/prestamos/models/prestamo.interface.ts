import { Cliente } from "../../clientes/models/cliente.interface";
import { Vehicle } from "./vehicle.model";

export interface ResumenPagos {
    capitalPagado: number;
    interesPagado: number;
    capitalPendiente: number;
    interesPendiente: number;
  }
  
  export interface Prestamo {
    idPrestamo?: number;
    idCliente: number;
    cliente?: Cliente;
    vehiculo: Vehicle;
    fechaPrestamo?: string;
    fechaVencimiento?: string;
    montoPrestamo: number;
    tasaInteres: number;
    estadoPrestamo?: string;
    observaciones?: string;
    createdAt?: string;
    updatedAt?: string | null;
    resumenPagos?: ResumenPagos;
    totalAbonado?: number;
    saldoPendiente?: number;
  }

  export interface Maquina {
    idPrestamo?: number;
    idCliente: number;
    cliente?: Cliente;
    fechaPrestamo?: string;
    fechaVencimiento?: string;
    montoPrestamo: number;
    tasaInteres: number;
    estadoPrestamo?: string;
    observaciones?: string;
    createdAt?: string;
    updatedAt?: string | null;
    resumenPagos?: ResumenPagos;
    totalAbonado?: number;
    saldoPendiente?: number;
  }
  
  // Para tipar mejor la respuesta del servicio
  export interface PrestamoConResumen {
    prestamo: Prestamo;
    maquina: Maquina;
    resumen: ResumenPagos;
  }

  export interface PrestamoMaquinaResponse{
    prestamos: Prestamo[];
    maquinas: Maquina[];
  }

  