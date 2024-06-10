import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LivreService {
  apiUrl = environment.apiBaseURL;

  constructor(private http: HttpClient) {}

  getAlllivres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/livre`);
  }

  getlivre(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/livre/${id}`);
  }

  createlivre(livre: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/livre/save`, livre);
  }

  updatelivre(id: string, livre: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/livre/${id}`, livre);
  }

  deletelivre(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/livre/${id}`);
  }
  filterFrns(searchterm: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/livre`).pipe(
      map((data) => {
        return data.filter((item) => {
          return (
            item.titreLivre.toLowerCase().includes(searchterm.toLowerCase()) ||
            item.auteurLivre.toLowerCase().includes(searchterm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchterm.toLowerCase()) ||
            item.categorie.toLowerCase().includes(searchterm.toLowerCase())
          );
        });
      })
    );
  }
}
