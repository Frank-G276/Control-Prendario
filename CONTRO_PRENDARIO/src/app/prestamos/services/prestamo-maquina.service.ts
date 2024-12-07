import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, forkJoin, map, mergeMap, Observable, tap, throwError } from 'rxjs';
import { PrestamoMaquina } from '../models/prestamomaquina.interface';
import { PagoMaquinaService } from '../../pagos/services/pago-maquina.service';

@Injectable({
    providedIn: 'root'
})
export class PrestamoMaquinaService {
    private apiUrl = 'http://localhost:8080/api/prestamos-maquinas';
    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
        withCredentials: true
      };

    constructor(
        private http: HttpClient,
        private pagoMaquinaService: PagoMaquinaService
    ) { }

    // Obtener todos los préstamos de máquinas
    getPrestamosMaquina(): Observable<PrestamoMaquina[]> {
        return this.http.get<PrestamoMaquina[]>(this.apiUrl).pipe(
            tap(prestamos => console.log('Préstamos de máquinas obtenidos:', prestamos)),
            catchError(this.handleError)
        );
    }

    // Obtener préstamos vencidos
    getPrestamosMaquinaVencidos(): Observable<PrestamoMaquina[]> {
        return this.http.get<PrestamoMaquina[]>(`${this.apiUrl}/vencidos`).pipe(
            tap(prestamos => console.log('Préstamos de máquinas vencidos:', prestamos)),
            catchError(this.handleError)
        );
    }

    // Obtener un préstamo por ID
    getPrestamoMaquinaById(id: number): Observable<PrestamoMaquina> {
        return this.http.get<PrestamoMaquina>(`${this.apiUrl}/${id}`).pipe(
            tap(prestamo => console.log('Préstamo de máquina obtenido:', prestamo)),
            catchError(this.handleError)
        );
    }

    // Crear nuevo préstamo
    createPrestamoMaquina(prestamo: PrestamoMaquina): Observable<PrestamoMaquina> {
        return this.http.post<PrestamoMaquina>(this.apiUrl, prestamo).pipe(
            tap(response => console.log('Préstamo de máquina creado:', response)),
            catchError(this.handleError)
        );
    }

    // Actualizar préstamo existente
    updatePrestamoMaquina(id: number, prestamo: PrestamoMaquina): Observable<PrestamoMaquina> {
        return this.http.put<PrestamoMaquina>(`${this.apiUrl}/${id}`, prestamo).pipe(
            tap(response => console.log('Préstamo de máquina actualizado:', response)),
            catchError(this.handleError)
        );
    }

    // Eliminar préstamo
    deletePrestamoMaquina(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => console.log('Préstamo de máquina eliminado:', id)),
            catchError(this.handleError)
        );
    }

    // Buscar préstamos por cliente
    buscarPrestamosMaquina(termino: string): Observable<PrestamoMaquina[]> {
        return this.http.get<PrestamoMaquina[]>(`${this.apiUrl}/buscar`, {
            params: new HttpParams().set('termino', termino)
        }).pipe(
            catchError(this.handleError)
        );
    }

    // Obtener préstamos con resumen de pagos
    getPrestamosMaquinaConResumen(): Observable<any[]> {
        return this.getPrestamosMaquina().pipe(
            map(prestamos => {
                const observables = prestamos.map(prestamo =>
                    forkJoin({
                        prestamo: Promise.resolve(prestamo),
                        resumen: this.pagoMaquinaService.obtenerResumenPagos(prestamo.idPrestamoMaquina!)
                    })
                );
                return forkJoin(observables);
            }),
            mergeMap(results => results)
        );
    }

    // Calcular interés total para 3 meses
    calcularInteresTotal(montoPrestamo: number, tasaInteres: number): number {
        return montoPrestamo * (tasaInteres / 100) * 3;
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