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

  // // Méthode pour mettre à jour l'état du livre
  // updateLivreDisponibilite(livreId: number, disponibilite: boolean): void {
  //   // Faites un appel HTTP pour mettre à jour l'état du livre dans le backend
  //   this.http
  //     .put(`${environment.apiBaseURL}/api/livre/${livreId}/disponibilite`, {
  //       disponible: disponibilite,
  //     })
  //     .subscribe(
  //       (response) =>
  //         console.log(
  //           `Livre ${livreId} disponibilité mise à jour: ${disponibilite}`
  //         ),
  //       (error) =>
  //         console.error(
  //           'Erreur lors de la mise à jour de la disponibilité du livre:',
  //           error
  //         )
  //     );
  // }
  public updateLivreDisponibilite(
    livreId: number,
    disponibilite: boolean
  ): Observable<any> {
    // Retourner l'observable résultant de la requête HTTP pour mettre à jour la disponibilité du livre dans le backend
    return this.http.put(
      `${environment.apiBaseURL}/api/livre/${livreId}/disponibilite`,
      {
        disponible: disponibilite,
      }
    );
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
