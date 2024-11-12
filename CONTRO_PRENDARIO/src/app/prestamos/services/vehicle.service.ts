import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    private apiUrl = 'http://localhost:8080/api/vehicles';

    constructor(private http: HttpClient) { }

    
    createVehicle(vehicle: Vehicle): Observable<Vehicle> {
        console.log('Sending to backend:', vehicle);
        return this.http.post<Vehicle>(this.apiUrl, vehicle)
            .pipe(
                tap(response => {
                    if (response.placa === vehicle.placa) {
                        console.log('Se encontró un vehículo existente con la misma placa. Verificando cambios...');
                        
                        const hasChanges = this.checkVehicleChanges(vehicle, response);

                        if (hasChanges) {
                            console.log('Se actualizaron los datos del vehículo existente');
                        } else {
                            console.log('No se requirieron cambios en el vehículo existente');
                        }
                    } else {
                        console.log('Se creó un nuevo vehículo');
                    }
                    console.log('Backend response:', response);
                }),
                catchError(this.handleError)
            );
    }

    private checkVehicleChanges(vehicle: Vehicle, response: Vehicle): boolean {
        let hasChanges = false;

        // Verificar cada campo individualmente
        if (vehicle.tipoVehiculo !== response.tipoVehiculo) {
            console.log(`Tipo de vehículo cambió de ${response.tipoVehiculo} a ${vehicle.tipoVehiculo}`);
            hasChanges = true;
        }
        if (vehicle.marca !== response.marca) {
            console.log(`Marca cambió de ${response.marca} a ${vehicle.marca}`);
            hasChanges = true;
        }
        if (vehicle.linea !== response.linea) {
            console.log(`Línea cambió de ${response.linea} a ${vehicle.linea}`);
            hasChanges = true;
        }
        if (vehicle.modelo !== response.modelo) {
            console.log(`Modelo cambió de ${response.modelo} a ${vehicle.modelo}`);
            hasChanges = true;
        }
        if (vehicle.cilindraje !== response.cilindraje) {
            console.log(`Cilindraje cambió de ${response.cilindraje} a ${vehicle.cilindraje}`);
            hasChanges = true;
        }
        if (vehicle.color !== response.color) {
            console.log(`Color cambió de ${response.color} a ${vehicle.color}`);
            hasChanges = true;
        }
        if (vehicle.numeroMotor !== response.numeroMotor) {
            console.log(`Número de motor cambió de ${response.numeroMotor} a ${vehicle.numeroMotor}`);
            hasChanges = true;
        }
        if (vehicle.numeroChasis !== response.numeroChasis) {
            console.log(`Número de chasis cambió de ${response.numeroChasis} a ${vehicle.numeroChasis}`);
            hasChanges = true;
        }
        if (vehicle.sitioMatricula !== response.sitioMatricula) {
            console.log(`Sitio de matrícula cambió de ${response.sitioMatricula} a ${vehicle.sitioMatricula}`);
            hasChanges = true;
        }
        if (!this.areDatesEqual(vehicle.fechaMatricula, response.fechaMatricula)) {
            console.log(`Fecha de matrícula cambió de ${response.fechaMatricula} a ${vehicle.fechaMatricula}`);
            hasChanges = true;
        }
        if (vehicle.propietario !== response.propietario) {
            console.log(`Propietario cambió de ${response.propietario} a ${vehicle.propietario}`);
            hasChanges = true;
        }
        if (vehicle.numeroDocumentoPropietario !== response.numeroDocumentoPropietario) {
            console.log(`Número de documento del propietario cambió de ${response.numeroDocumentoPropietario} a ${vehicle.numeroDocumentoPropietario}`);
            hasChanges = true;
        }

        return hasChanges;
    }

    private areDatesEqual(date1: string | Date, date2: string | Date): boolean {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getTime() === d2.getTime();
    }

    private areValuesEqual(val1: any, val2: any): boolean {
        // Manejar fechas
        if (val1 instanceof Date || val2 instanceof Date) {
            const date1 = val1 instanceof Date ? val1 : new Date(val1);
            const date2 = val2 instanceof Date ? val2 : new Date(val2);
            return date1.getTime() === date2.getTime();
        }
        
        // Comparación normal para otros tipos
        return val1 === val2;
    }

     private handleError(error: HttpErrorResponse)
    {
        console.error('An error occurred:', error);
        let errorMessage = 'Ocurrió un error al procesar la solicitud.';
        
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `${error.error}`;
        }
        
        return throwError(() => errorMessage);
    }

    getVehicles(): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(this.apiUrl)
            .pipe(catchError(this.handleError));
    }

    getVehicleById(id: number): Observable<Vehicle> {
        return this.http.get<Vehicle>(`${this.apiUrl}/${id}`)
            .pipe(
                tap(vehicle => console.log('Fetched vehicle:', vehicle)),
                catchError(this.handleError)
            );
    }

    deleteVehicle(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(
                tap(() => console.log('Deleted vehicle id:', id)),
                catchError(this.handleError)
            );
    }

    updateVehicle(id: number, vehicle: Vehicle): Observable<Vehicle> {
        return this.http.put<Vehicle>(`${this.apiUrl}/${id}`, vehicle)
            .pipe(
                tap(response => console.log('Updated vehicle:', response)),
                catchError(this.handleError)
            );
    }
}