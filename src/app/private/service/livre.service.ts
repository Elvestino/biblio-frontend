import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LivreService {
  apiUrl = 'http://localhost:3000/livre';

  constructor(private http: HttpClient) {}

  getAlllivres(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getlivre(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createlivre(livre: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, livre);
  }

  updatelivre(id: string, livre: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, livre);
  }

  deletelivre(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
