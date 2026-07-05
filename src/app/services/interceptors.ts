import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthService } from "./auth-service";
import { environment } from "../../environments/environment";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const authToken = authService.getAuthToken();
  
  if (authToken) {
    return next(
      req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + authToken),
      })
    ).pipe(
      tap(event => {
        console.log(event)
        if (event.type === HttpEventType.ResponseHeader && event.status === 401) {
          authService.logOut();
          console.log("logged out")
        }
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