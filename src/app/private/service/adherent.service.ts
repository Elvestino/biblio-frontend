import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdherentService {
  apiUrl = environment.apiBaseURL;

  constructor(private http: HttpClient) {}

  getAlladherents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/adherent`);
  }

  getadherent(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/adherent/${id}`);
  }

  createadherent(adherent: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/adherent/save`, adherent);
  }

  updateadherent(id: string, adherent: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/adherent/${id}`, adherent);
  }

  deleteadherent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/adherent/${id}`);
  }
}
