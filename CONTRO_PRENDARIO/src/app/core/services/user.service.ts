import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User, UserCreationDTO, UserResponse } from "../interfaces/user.interface";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
    private apiUrl = 'http://localhost:8080/api/users';
  
    constructor(private http: HttpClient) {}
  
    createUser(userData: UserCreationDTO): Observable<UserResponse> {
      return this.http.post<UserResponse>(this.apiUrl, userData);
    }
  
    getRoles(): string[] {
      return ['ADMIN', 'GERENTE'];
    }

    getUsers(): Observable<User[]> {
      return this.http.get<User[]>(this.apiUrl);
    }
  
    deactivateUser(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    activateUser(id: number): Observable<void> {
      return this.http.post<void>(`${this.apiUrl}/${id}/activate`, {});
    }
  }