import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EmprunterService {
  apiUrl = environment.apiBaseURL + '/api/emprunts';

  constructor(private http: HttpClient) {}

  getAllEmprunts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEmprunt(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  emprunterLivre(
    adherentId: number,
    livreId: number,
    joursEmprunt: number
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/save`, {
        adherentId: adherentId,
        livreId: livreId,
        joursEmprunt: joursEmprunt,
      })
      .pipe(
        tap(() => {
          // Mettre à jour l'état du livre une fois emprunté
          this.updateLivreDisponibilite(livreId, false); // Mettre le livre non disponible
        })
      );
  }

  // Méthode pour mettre à jour l'état du livre
  private updateLivreDisponibilite(
    livreId: number,
    disponibilite: boolean
  ): void {
    // Faites un appel HTTP ou une mise à jour locale pour mettre à jour l'état du livre
  }
  retournerLivre(empruntId: number): Observable<any> {
    const empruntIdString: string = empruntId.toString(); // Convertir empruntId en chaîne de caractères
    return this.http.post(`${this.apiUrl}/return/${empruntIdString}`, {}).pipe(
      tap(() => {
        // Récupérer l'emprunt par son ID pour obtenir l'ID du livre
        this.getEmprunt(empruntIdString).subscribe((emprunt) => {
          if (emprunt && emprunt.livreId) {
            // Mettre à jour l'état du livre une fois retourné
            this.updateLivreDisponibilite(emprunt.livreId, true); // Mettre le livre disponible
          }
        });
      })
    );
  }

  updateEmprunt(id: string, emprunt: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, emprunt);
  }

  deleteEmprunt(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
