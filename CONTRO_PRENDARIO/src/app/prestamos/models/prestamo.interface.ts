import { Cliente } from "../../clientes/models/cliente.interface";
import { Vehicle } from "./vehicle.model";

export interface Prestamo {
    idPrestamo?: number;
    idCliente: number;
    cliente?: Cliente;
    vehiculo: Vehicle;
    fechaPrestamo?: string;  // Cambiado a string para manejar fechas ISO
    fechaVencimiento?: string;  // Cambiado a string para manejar fechas ISO
    montoPrestamo: number;
    tasaInteres: number;
    estadoPrestamo?: string;
    observaciones?: string;
    createdAt?: string;
    updatedAt?: string | null;
}