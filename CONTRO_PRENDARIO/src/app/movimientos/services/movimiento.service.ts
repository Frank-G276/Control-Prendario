// movimiento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movimiento {
  idMovimiento?: number;
  fechaMovimiento?: string;
  tipoMovimiento: 'ENTRADA' | 'SALIDA';
  monto: number;
}

export interface Balance {
  movimientos: number;
  pagos: number;
  prestamos: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private apiUrl = 'http://localhost:8080/api/movimientos';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  crearMovimiento(movimiento: Movimiento): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.apiUrl, movimiento, this.httpOptions);
  }

  obtenerMovimientos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.apiUrl, this.httpOptions);
  }

  obtenerBalance(): Observable<Balance> {
    return this.http.get<Balance>(`${this.apiUrl}/balance`, this.httpOptions);
  }
}