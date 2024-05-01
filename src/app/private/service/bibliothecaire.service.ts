import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bibliothecaire } from '../model/bibliothecaire.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BibliothecaireService {
  apiUrl = 'http://localhost:3000/bibliothecaire';

  constructor(private http: HttpClient) {}

  getAllBibliothecaires(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getBibliothecaire(id: string): Observable<any> {
    console.log('QRCODE id: ', id);
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createBibliothecaire(bibliothecaire: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, bibliothecaire);
  }

  updateBibliothecaire(id: string, bibliothecaire: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, bibliothecaire);
  }

  deleteBibliothecaire(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
