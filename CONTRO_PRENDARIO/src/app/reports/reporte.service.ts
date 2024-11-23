import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class ReporteService {
    private apiUrl = `http://localhost:8080/api/reportes`;
  
    constructor(private http: HttpClient) {}
  
    generarDocumentoEmpeno(idPrestamo: number): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/documento-empeno/${idPrestamo}`, {
        responseType: 'blob'
      });
    }
  }