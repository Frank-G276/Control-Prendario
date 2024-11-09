export interface Cliente {
    idCliente?: number;
    tipoDocumento: 'DNI' | 'PASAPORTE' | 'CEDULA';
    numeroDocumento: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    direccion: string;
    ciudad: string;
    telefono: string;
    email: string;
    fechaRegistro?: string;
}