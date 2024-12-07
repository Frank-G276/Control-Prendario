import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PagoMaquina } from '../interfaces/pago-maquina.interface';

@Injectable({
    providedIn: 'root'
})
export class PagoMaquinaService {
    private apiUrl = 'http://localhost:8080/api/pagos-maquinas';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    };

    constructor(private http: HttpClient) { }

    // Crear nuevo pago
    crearPago(pago: PagoMaquina): Observable<PagoMaquina> {
        return this.http.post<PagoMaquina>(this.apiUrl, pago, this.httpOptions).pipe(
            tap(response => console.log('Pago creado:', response)),
            catchError(this.handleError)
        );
    }

    // Obtener pagos por préstamo
    obtenerPagosPorPrestamoMaquina(idPrestamoMaquina: number): Observable<PagoMaquina[]> {
        return this.http.get<PagoMaquina[]>(`${this.apiUrl}/prestamo/${idPrestamoMaquina}`).pipe(
            tap(pagos => console.log('Pagos obtenidos:', pagos)),
            catchError(this.handleError)
        );
    }

    // Obtener resumen de pagos
    obtenerResumenPagos(idPrestamoMaquina: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/prestamo/${idPrestamoMaquina}/resumen`).pipe(
            tap(resumen => console.log('Resumen de pagos:', resumen)),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error);
        let errorMessage = 'Ocurrió un error al procesar la solicitud.';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else if (typeof error.error === 'string') {
            errorMessage = error.error;
        } else if (error.error?.message) {
            errorMessage = error.error.message;
        }

        return throwError(() => errorMessage);
    }
}