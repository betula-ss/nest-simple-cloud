import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../../core/services/auth.service';
import {catchError, Observable} from 'rxjs';
import {ProfileDataInDto, ProfileDataOutDto} from '../models/ProfileDataDto';
import {handleError} from '../../../core/utils/handle-error';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private as: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.as.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  updateUser(profileData: ProfileDataOutDto): Observable<ProfileDataInDto> {
    return this.http.patch<ProfileDataInDto>(`${this.apiUrl}/${profileData.id}`,
      {
        username: profileData.username,
        password: profileData.password
      },
      {
        headers: this.getAuthHeaders()
      }
    ).pipe(catchError(handleError));
  }
}
