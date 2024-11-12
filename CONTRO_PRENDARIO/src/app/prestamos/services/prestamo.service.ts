import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Prestamo } from '../models/prestamo.interface';

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
  
    constructor(private http: HttpClient) { }
  
    getPrestamos(): Observable<Prestamo[]> {
      return this.http.get<Prestamo[]>(this.apiUrl).pipe(
          tap(prestamos => console.log('Préstamos obtenidos:', prestamos)),
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
  
      // Actualizar un préstamo existente
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
}
  