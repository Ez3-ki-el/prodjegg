import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const isOwnApiCall = request.url.startsWith('/api/');

    if (token && isOwnApiCall) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: unknown) => {
        const isAuthEndpoint = request.url.includes('/api/auth/');
        if (error instanceof HttpErrorResponse && error.status === 401 && isOwnApiCall && !isAuthEndpoint) {
          this.authService.logout();
          this.router.navigate(['/admin/login'], { queryParams: { returnUrl: this.router.url } });
        }
        return throwError(() => error);
      })
    );
  }
}
