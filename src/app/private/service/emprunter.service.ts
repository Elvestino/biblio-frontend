import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmprunterService {
  apiUrl = 'http://localhost:3000/emprunter';

  constructor(private http: HttpClient) {}

  getAllemprunters(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getemprunter(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createemprunter(emprunter: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, emprunter);
  }

  updateemprunter(id: string, emprunter: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, emprunter);
  }

  deleteemprunter(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
