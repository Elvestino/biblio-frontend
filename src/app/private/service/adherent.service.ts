import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdherentService {
  apiUrl = 'http://localhost:3000/adherent';

  constructor(private http: HttpClient) {}

  getAlladherents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getadherent(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createadherent(adherent: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, adherent);
  }

  updateadherent(id: string, adherent: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, adherent);
  }

  deleteadherent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
