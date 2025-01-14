import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago, ResumenPagos, ResumenPrestamo } from '../interfaces/pago.interface';
import { Prestamo } from '../../prestamos/models/prestamo.interface';


@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrlPrestamos = 'http://localhost:8080/api/pagos';
  private apiUrlMaquinas = ' http://localhost:8080/api/pagos-maquinas';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  crearPago(tableName: string ,pago: Pago): Observable<Pago> {
    if (tableName === 'vehiculos') {
      console.log('Pago :', pago);
      return this.http.post<Pago>(this.apiUrlPrestamos, pago);
    } else {
      console.log('Pago :', pago);
      return this.http.post<Pago>(this.apiUrlMaquinas, pago);
    }
  }

  obtenerPagosPorPrestamo(idPrestamo: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrlPrestamos}/prestamo/${idPrestamo}`);
  }

  obtenerResumenPagos(tableName: string, idPrestamo: number): Observable<ResumenPrestamo> {
    if (tableName === 'vehiculos') {
      const response = idPrestamo;
      return this.http.get<ResumenPrestamo>(`${this.apiUrlPrestamos}/prestamo/${idPrestamo}/resumen`);
    } else {
      const response = idPrestamo;
    return this.http.get<ResumenPrestamo>(`${this.apiUrlMaquinas}/prestamo/${idPrestamo}/resumen`);
    }
  }

  buscarPagosPorCliente(termino: string): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrlPrestamos}/buscar`, {
      params: { termino }
    });
  }
  

  obtenerTodosPagos(tableName : string): Observable<any[]> {
    if(tableName === 'vehiculos'){
    return this.http.get<any[]>(this.apiUrlPrestamos);
    } else {
      return this.http.get<any[]>(`${this.apiUrlPrestamos}/maquina`);
    }
  }
  
}