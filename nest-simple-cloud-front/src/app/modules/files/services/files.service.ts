import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {handleError} from '../../../core/utils/handle-error';
import {AuthService} from '../../../core/services/auth.service';
import {FileDataDto} from '../models/FileDataDto';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private apiUrl = `${environment.apiUrl}/files`;

  constructor(
    private http: HttpClient,
    private as: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.as.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getFiles(): Observable<FileDataDto[]> {
    return this.http.get<FileDataDto[]>(this.apiUrl, {headers: this.getAuthHeaders()})
      .pipe(catchError(handleError));
  }

  getFile(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      responseType: 'blob',
      headers: this.getAuthHeaders()
    })
      .pipe(catchError(handleError));
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData, {headers: this.getAuthHeaders()})
      .pipe(catchError(handleError));
  }

  deleteFile(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {headers: this.getAuthHeaders()})
      .pipe(catchError(handleError));
  }
}
