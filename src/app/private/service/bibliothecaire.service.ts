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
    return this.http.get<any[]>(`${this.apiUrl}/bibliothecaire`);
  }

  getBibliothecaire(id: string): Observable<any> {
    console.log('id : ty no tokom ho raisiny', id);
    return this.http.get<any>(`${this.apiUrl}/bibliothecaire/${id}`);
  }

  createBibliothecaire(bibliothecaire: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/bibliothecaire/save`,
      bibliothecaire
    );
  }

  updateBibliothecaire(id: string, bibliothecaire: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/ibliothecaire/${id}`,
      bibliothecaire
    );
  }

  deleteBibliothecaire(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/bibliothecaire/${id}`);
  }
}
