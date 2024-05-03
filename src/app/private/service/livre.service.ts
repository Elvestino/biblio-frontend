import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

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
  getLivreWithImage(id: string): Observable<any> {
    // Faites une requête HTTP pour récupérer les données du livre avec les données d'image associées
    return this.http.get<any>(`${this.apiUrl}/${id}?_expand=image`);
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
  filterlivre(searchterm: string) {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map((data) => {
        return data.filter((item) => {
          return (
            item.titreLivre.toLowerCase().includes(searchterm.toLowerCase()) ||
            item.auteurLivre.toLowerCase().includes(searchterm.toLowerCase()) ||
            item.editionLivre
              .toLowerCase()
              .includes(searchterm.toLowerCase()) ||
            item.categorie.toLowerCase().includes(searchterm.toLowerCase())
          );
        });
      })
    );
  }
}
