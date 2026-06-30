import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth-service";
import { environment } from "../../environments/environment";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authToken = inject(AuthService).getAuthToken();

  return next(
    req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken),
    })
  );
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