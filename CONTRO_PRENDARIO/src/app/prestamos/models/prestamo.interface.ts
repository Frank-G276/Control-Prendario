import { Cliente } from "../../clientes/models/cliente.interface";
import { Vehicle } from "./vehicle.model";

export interface ResumenPagos {
  capitalTotal: number;
  interesTotal: number;
  capitalPagado: number;
  interesPagado: number;
  capitalPendiente: number;
  interesPendiente: number;
}

export interface ResumenPrestamo {
  capitalTotal: number;
  interesTotal: number;
  capitalPagado: number;
  interesPagado: number;
  capitalPendiente: number;
  interesPendiente: number;
}
  
export interface PrestamoBase {
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
    resumenPagos?: ResumenPagos | ResumenPrestamo;
    totalAbonado?: number;
    interesTotal?: number;
    saldoPendiente?: number;
}

export interface Prestamo extends PrestamoBase {
  idPrestamo?: number;
  vehiculo: Vehicle;
}

export interface Maquina extends PrestamoBase {
  idPrestamoMaquina?: number;
  tipoMaquina: string;
  marcaMaquina: string;
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

  