import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EmprunterService {
  apiUrl = `${environment.apiBaseURL}/api/emprunts`;

  constructor(private http: HttpClient) {}

  getAllEmprunts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEmprunt(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createEmprunt(emprunt: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, emprunt);
  }

  updateEmprunt(id: string, emprunt: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, emprunt);
  }

  deleteEmprunt(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
