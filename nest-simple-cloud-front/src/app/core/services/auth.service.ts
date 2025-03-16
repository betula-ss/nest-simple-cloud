import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(data: {username: string, password: string}): Observable<{access_token: string}> {
    return this.http.post<{access_token: string}>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access_token);
        })
      );
  }

  logout(): void {
    localStorage.clear()
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  updateToken(token: string) {
    localStorage.setItem('access_token', token)
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
