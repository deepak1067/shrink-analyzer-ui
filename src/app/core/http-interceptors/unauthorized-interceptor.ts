import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(tap({
      next: (event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // Particular component will handle success response
      }
    },error: (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {

          // redirect to the login route or show a modal
          // if token is invalid then remove it from
          // cookie and navigate user to login
          this.authService.removeTokenFromCookie();
          this.authService.removeTenantIdFromCookie();
          this.router.navigate(['/auth-verify']);
        }
        else if(err.status === 500){
          this.router.navigate(['/dashboard/server-error']);
        }
        else {
          this.router.navigate(['/dashboard/api-error']);
        }
      }
    }
    }));
  }
}
