import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { AuthService } from "./auth-service";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { RouteItems } from "../app.routes";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authToken = authService.getAuthToken();
  
  if (authToken) {
    return next(
      req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken),
      })
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authService.logOut();
          router.navigate(['/', RouteItems.LogIn]);
          console.log('logged out');
        }

        return throwError(() => error);
      })
    );
  }
  return next(req);
}


export function apiInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
    const apiReq = req.clone({
      url: `${environment.apiUrl}${req.url}`,
    });
    return next(apiReq);
  }

  return next(req);
};