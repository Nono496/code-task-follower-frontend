import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../dtos/user';
import { CrudService } from './crud-service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends CrudService<User> {
  protected override endpoint = '/users';
  private accessTokenCookieName = 'accessToken=';

  private _isAuthenticated = false;
  private _authToken: string | undefined;

  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  getAuthToken(): string | null {
    if (this._authToken) return this._authToken;

    const cookies = document.cookie;
    if (!cookies.includes(this.accessTokenCookieName)) return null;

    const startIndex = cookies.indexOf(this.accessTokenCookieName) + this.accessTokenCookieName.length + 1;
    const endIndex = cookies.indexOf(';', startIndex);

    return this._authToken = cookies.substring(startIndex, endIndex);
  }

  logIn(user: User): Observable<boolean> {
    return this.http.post(this.endpoint + '/login', user, { observe: 'response' })
      .pipe(map(response => response.ok && this.saveTokenFromHeader(response.headers)));
  }

  signIn(user: User): Observable<boolean> {
    return this.http.post(this.endpoint + '/signin', user, { observe: 'response' })
      .pipe(map(response => response.ok && this.saveTokenFromHeader(response.headers)));
  }

  saveTokenFromHeader(headers: HttpHeaders): boolean {
    const token = headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return false;
    }

    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (60 * 60 * 24 * 7 * 4)); // 1 month

    document.cookie = 
    this.accessTokenCookieName + token + 
    '; expires=' + expirationDate.toUTCString() +
    '; path=/';

    this._isAuthenticated = true;

    return true;
  }

  logOut() {
    document.cookie = 
      this.accessTokenCookieName + 
      '; expires=' + new Date(0).toUTCString() +
      '; path=/';

      this._isAuthenticated = false;
  }
}
