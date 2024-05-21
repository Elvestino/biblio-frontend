import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnregistrementService {
  apiUrl = environment.apiBaseURL;

  constructor(private http: HttpClient) {}
  // Créer un nouvel utilisateur
  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enregistrement/save`, user);
  }

  // Confirmer l'utilisateur avec un token
  confirmUser(token: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/enregistrement/confirm?token=${token}`
    );
  }
}
