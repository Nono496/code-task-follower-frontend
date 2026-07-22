import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User, userSchema } from '../dtos/zod-schemas';
import { CrudService } from './crud-service';
import { HttpHeaders } from '@angular/common/http';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class AuthService extends CrudService<User> {
  protected override endpoint = '/users';
  private accessTokenCookieName = 'accessToken=';
  protected override parseSchema = userSchema;

  private _authToken: string | null | undefined = undefined;
  private _authTokenData: AuthTokenData | null | undefined = undefined;

  get isAdmin(): boolean {
    return this.isAuthenticated && this._authTokenData!.admin;
  }

  get isAuthenticated(): boolean {
    return this.authToken !== null;
  }

  get authToken(): string | null {
    if (this._authToken !== undefined) return this._authToken;

    const cookies = document.cookie;
    if (!cookies.includes(this.accessTokenCookieName)) return this.authToken = null;

    const startIndex = cookies.indexOf(this.accessTokenCookieName) + this.accessTokenCookieName.length;
    let endIndex = cookies.indexOf(';', startIndex);
    endIndex = endIndex === -1 ? cookies.length : endIndex;

    return this.authToken = cookies.substring(startIndex, endIndex);
  }

  private set authToken(token: string | null) {
    this._authToken = token;

    if (token === null) {
      this._authTokenData = null;
    } else {
      this._authTokenData = jwtDecode<AuthTokenData>(token);
    }
  }

  logIn(user: User): Observable<boolean> {
    return this.http.post(this.endpoint + '/login', user, { observe: 'response' })
      .pipe(map(response => this.saveTokenFromHeader(response.headers)));
  }

  signIn(user: User, saveToken = true): Observable<boolean> {
    return this.http.post(this.endpoint + '/register', user, { observe: 'response' })
      .pipe(map(response => {
        if (saveToken) {
          return this.saveTokenFromHeader(response.headers);
        } else {
          return true;
        }
      }));
  }

  changePassword(passwordUpdate: {
    oldPassword: string,
    newPassword: string
  }) {
    return this.http.patch(this.endpoint + '/changepw', passwordUpdate);
  }

  saveTokenFromHeader(headers: HttpHeaders): boolean {
    const token = headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return false;
    }

    const expirationDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

    document.cookie =
    this.accessTokenCookieName + token +
    '; expires=' + expirationDate.toUTCString() +
    '; path=/';

    this.authToken = token;
    return true;
  }

  logOut() {
    document.cookie =
      this.accessTokenCookieName +
      '; expires=' + new Date(0).toUTCString() +
      '; path=/';

      this.authToken = null;
  }
}

type AuthTokenData = {
  id: number;
  name: string;
  admin: boolean;
};