import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago, ResumenPagos, ResumenPrestamo } from '../interfaces/pago.interface';
import { Prestamo } from '../../prestamos/models/prestamo.interface';


@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = 'http://localhost:8080/api/pagos';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  crearPago(pago: Pago): Observable<Pago> {
    return this.http.post<Pago>(this.apiUrl, pago);
  }

  obtenerPagosPorPrestamo(idPrestamo: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/prestamo/${idPrestamo}`);
  }

  obtenerResumenPagos(idPrestamo: number): Observable<ResumenPrestamo> {
    return this.http.get<ResumenPrestamo>(`${this.apiUrl}/prestamo/${idPrestamo}/resumen`);
  }

  buscarPagosPorCliente(termino: string): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/buscar`, {
      params: { termino }
    });
  }
  

  obtenerTodosPagos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
}