import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private apiUrl = `${environment.apiBaseURL}/api`;
  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getAllScannedData(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/images`);
  }

  deleteAllScannedData(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/images`);
  }
}