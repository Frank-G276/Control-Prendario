import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, forkJoin, map, mergeMap, Observable, of, tap, throwError } from 'rxjs';
import { Maquina, Prestamo, PrestamoMaquinaResponse, PrestamoConResumen } from '../models/prestamo.interface';
import { PagoService } from '../../pagos/services/pago.service';
import { log } from 'console';

@Injectable({
    providedIn: 'root'
  })
  export class PrestamoService {
    private apiUrl = 'http://localhost:8080/api/prestamos';
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    constructor(
      private http: HttpClient,
      private pagoService: PagoService
    ) {}
  
    getPrestamos(tableName: string): Observable<(Prestamo | Maquina)[]> {
      return this.http.get<(Prestamo | Maquina)[]>(`${this.apiUrl}/${tableName}`).pipe(
          tap(prestamos => console.log('Préstamos obtenidos:', prestamos)),
          catchError(this.handleError)
      );
    }

    getAllPrestamos():Observable<PrestamoMaquinaResponse>{
      return this.http.get<PrestamoMaquinaResponse>(`${this.apiUrl}`)
    }

    getPrestamosVencidos(): Observable<Prestamo[]> {
      return this.http.get<Prestamo[]>(`${this.apiUrl}/vencidos`).pipe(
        tap(prestamos => console.log('Préstamos vencidos:', prestamos)),
        catchError(this.handleError)
      );
    }
  
    getPrestamoById(id: number): Observable<Prestamo> {
      return this.http.get<Prestamo>(`${this.apiUrl}/${id}`).pipe(
          tap(prestamo => console.log('Préstamo obtenido:', prestamo)),
          catchError(this.handleError)
      );
    }
  
    createPrestamo(prestamo: any): Observable<Prestamo> {
      return this.http.post<Prestamo>(this.apiUrl, prestamo).pipe(
        tap(response => console.log('Préstamo creado:', response)),
        catchError(this.handleError)
      );
    }
  
    updatePrestamo(id: number, prestamo: any): Observable<Prestamo> {
      return this.http.put<Prestamo>(`${this.apiUrl}/${id}`, prestamo).pipe(
          tap(response => console.log('Préstamo actualizado:', response)),
          catchError(this.handleError)
      );
    }
  
    deletePrestamo(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
          tap(() => console.log('Préstamo eliminado:', id)),
          catchError(this.handleError)
      );
    }

    private handleError(error: HttpErrorResponse) {
      console.error('An error occurred:', error);
      let errorMessage = 'Ocurrió un error al procesar la solicitud.';
      
      if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
      } else if (typeof error.error === 'string') {
          // Error del lado del servidor con mensaje string
          errorMessage = error.error;
      } else if (error.error?.message) {
          // Error del lado del servidor con objeto de error
          errorMessage = error.error.message;
      }
      
      return throwError(() => errorMessage);
  }

  buscarPrestamos(termino: string, numeroDocumento: string): Observable<Prestamo[]> {
    let params = new HttpParams();
    if (termino) {
      params = params.set('termino', termino);
    }
    if (numeroDocumento) {
      params = params.set('numeroDocumento', numeroDocumento);
    }
    return this.http.get<Prestamo[]>(`${this.apiUrl}/buscar`, { params });
  }

  getPrestamosConResumen(tableName: string): Observable<PrestamoConResumen[]> {
    if (tableName === 'vehiculos') {
      return this.getAllPrestamos().pipe(
        map(response => {
          const observables = response.prestamos.map(prestamo =>
            forkJoin({
              prestamo: Promise.resolve(prestamo),
              resumen: this.pagoService.obtenerResumenPagos(prestamo.idPrestamo!),
              maquina: Promise.resolve({} as Maquina)
            })
          );
          console.log('observables:' + response);
          return forkJoin(observables);
        }),
        mergeMap(results => results)
      );
    } else if (tableName === 'maquinas') {
      return this.getAllPrestamos().pipe(
        map(response => {
          const observables = response.maquinas.map(maquina =>
            forkJoin({
              maquina: Promise.resolve(maquina),
              resumen: this.pagoService.obtenerResumenPagos(maquina.idPrestamo!),
              prestamo: Promise.resolve({} as Prestamo)
            })
          );
          return forkJoin(observables);
        }),
        mergeMap(results => results)
      );
    }

    throw new Error(`Tabla no válida: ${tableName}`);
  }
  
  calcularInteresTotal(montoPrestamo: number, tasaInteres: number): number {
    return montoPrestamo * (tasaInteres / 100) * 3; // Multiplicado por 3 meses
  }

}
  