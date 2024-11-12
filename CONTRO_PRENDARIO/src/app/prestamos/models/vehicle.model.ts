export interface Vehicle {
    idVehiculo?: number;
    tipoVehiculo: string;
    marca: string;
    linea: string;
    modelo: number;
    placa: string;
    cilindraje: number;
    color: string;
    numeroMotor: string;
    numeroChasis: string;
    sitioMatricula: string;
    fechaMatricula: string;  // Cambiado a string para manejar fechas ISO
    propietario: string;
    numeroDocumentoPropietario: string;
    fechaRegistro?: string;
}