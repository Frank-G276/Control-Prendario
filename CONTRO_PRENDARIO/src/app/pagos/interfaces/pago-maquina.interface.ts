export interface PagoMaquina {
    idPago?: number;
    prestamo: {
      idPrestamo: number;
    };
    fechaPago?: string;
    montoPagado: number;
    tipoPago: 'CAPITAL' | 'INTERES' | 'MORA';
    metodoPago: 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA';
    observaciones?: string;
  }
  
  export interface ResumenPagos {
    capital: number;
    interes: number;
    mora: number;
  }

  export interface ResumenPrestamo {
    capitalTotal: number;
    interesTotal: number;
    capitalPagado: number;
    interesPagado: number;
    capitalPendiente: number;
    interesPendiente: number;
  }

  export interface PrestamoSeleccionado {
    idPrestamo: number;
    cliente: {
      nombres: string;
      apellidos: string;
      numeroDocumento: string;
    };
    montoPrestamo: number;
    tasaInteres: number;
    capitalPagado: number;
    interesPagado: number;
    capitalPendiente: number;
    interesPendiente: number;
    totalPagado: number;
    totalPendiente: number;
  }
  
  // Los tipos de respuesta del servicio
  export interface ResumenPagos {
    capital: number;
    interes: number;
  }