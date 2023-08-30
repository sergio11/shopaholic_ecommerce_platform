import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationInterceptor implements HttpInterceptor {
  private readonly matchedUrl: string[] = [
    `${environment.API_ENDPOINT}/signin`,
    `${environment.API_ENDPOINT}/signup`,
  ];
  constructor(
    private readonly authService: AuthService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.getAuthorizationToken();
    if (this.matchedUrl.includes(req.url) === true && authToken === false) {
      return next.handle(req);
    } else {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`),
      });
      return next.handle(authReq).pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            // Check if response is a 401 Unauthorized
            if (event.status === 401) {
              this.authService.logout(); // Clear local storage and log out the user
            }
          }
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.authService.logout(); // Clear local storage and log out the user
          }
          return throwError(error);
        })
      );
    }
  }
}