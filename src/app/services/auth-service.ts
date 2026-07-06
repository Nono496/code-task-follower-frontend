import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User, userSchema } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends CrudService<User> {
  protected override endpoint = '/users';
  private accessTokenCookieName = 'accessToken=';
  protected override parseSchema = userSchema;

  private _isAuthenticated: boolean | null = null;
  private _authToken: string | undefined;

  isAuthenticated(): boolean {
    if (this._isAuthenticated === null) {
      this._isAuthenticated = this.getAuthToken() !== null;
    }

    return this._isAuthenticated;
  }

  getAuthToken(): string | null {
    if (this._authToken) return this._authToken;

    const cookies = document.cookie;
    if (!cookies.includes(this.accessTokenCookieName)) return null;

    const startIndex = cookies.indexOf(this.accessTokenCookieName) + this.accessTokenCookieName.length;
    let endIndex = cookies.indexOf(';', startIndex);
    endIndex = endIndex === -1 ? cookies.length : endIndex;

    return this._authToken = cookies.substring(startIndex, endIndex);
  }

  logIn(user: User): Observable<boolean> {
    return this.http.post(this.endpoint + '/login', user, { observe: 'response' })
      .pipe(map(response => this.saveTokenFromHeader(response.headers)));
  }

  signIn(user: User): Observable<boolean> {
    return this.http.post(this.endpoint + '/register', user, { observe: 'response' })
      .pipe(map(response => this.saveTokenFromHeader(response.headers)));
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
      this._authToken = undefined;
  }
}
