import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'core/modules/auth-core/services';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppConfigService } from '../config/app.config.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private authServuce: AuthService, private configService: AppConfigService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.configService.config.api.useAuth) {
      return from(this.authServuce.getAccessTokenAsync()).pipe(
        map((token) => this.getRequestWithAuthorizeHeader(token, req)),
        switchMap((newReq) =>
          next.handle(newReq).pipe(
            catchError((err: any) => {
              if (err.status === 401) {
                this.authServuce.signOutAsync();
              }
              return throwError(err);
            })
          )
        )
      );
    }

    return next.handle(req);
  }

  private getRequestWithAuthorizeHeader(token: string, originalReq: HttpRequest<any>): HttpRequest<any> {
    return originalReq.clone({
      headers: originalReq.headers.append('Authorization', `Bearer ${token}`),
    });
  }
}
