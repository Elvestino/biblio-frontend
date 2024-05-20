import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnregistrementService {
  // apiUrl = environment.apiBaseURL;

  apiUrl = 'http://localhost:3000/enregistrement';

  constructor(private http: HttpClient) {}
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUser(User: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, User);
  }

  updateUser(id: string, User: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, User);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /////////////////////////TY NO MANDEFA ANY BACK decommenteo avy eo///////////////
  // authenticate(nomUtilisateur: string, motdepasse: string): Observable<boolean> {
  //   return this.http.post<boolean>(`${this.apiUrl}/authenticate`, {
  //     nomUtilisateur,
  //     motdepasse,
  //   });
  // }
  authenticate(nomUtilisateur: string, motdepasse: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}`)
      .pipe(
        map((users) =>
          users.find(
            (user) =>
              user.nomUtilisateur === nomUtilisateur &&
              user.motdepasse === motdepasse
          )
        )
      );
  }
}
