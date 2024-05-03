import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bibliothecaire } from '../model/bibliothecaire.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BibliothecaireService {
  apiUrl = environment.apiBaseURL;

  constructor(private http: HttpClient) {}

  getAllBibliothecaires(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/bibliotecaire`);
  }

  getBibliothecaire(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bibliotecaire:${id}`);
  }

  createBibliothecaire(bibliothecaire: any): Observable<any> {
    console.log('handefa donnee:', bibliothecaire);
    return this.http.post<any>(`${this.apiUrl}/bibliotecaire`, bibliothecaire);
  }

  updateBibliothecaire(id: string, bibliothecaire: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, bibliothecaire);
  }

  deleteBibliothecaire(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
