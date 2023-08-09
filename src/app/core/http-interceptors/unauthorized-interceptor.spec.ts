import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {UnauthorizedInterceptor} from './unauthorized-interceptor';

describe('UnauthorizedInterceptor', () => {
  let interceptor: UnauthorizedInterceptor;
  let router: Router;
  let authService: AuthService;
  let httpHandler: HttpHandler;

  function handleUnauthorizedResponse(httpRequest: HttpRequest<any>, httpHandler: HttpHandler, httpErrorResponse: HttpErrorResponse) {
    (httpHandler.handle as jasmine.Spy).and.returnValue(throwError(httpErrorResponse));
    expect(authService.removeTokenFromCookie).not.toHaveBeenCalled();
    expect(authService.removeTenantIdFromCookie).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();

    interceptor.intercept(httpRequest, httpHandler).subscribe(
        (event: HttpEvent<any>) => {},
        (error: any) => {
          expect(error).toEqual(httpErrorResponse);
          expect(authService.removeTokenFromCookie).toHaveBeenCalled();
          expect(authService.removeTenantIdFromCookie).toHaveBeenCalled();
          expect(router.navigate).toHaveBeenCalledWith(['/auth-verify']);
        }
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnauthorizedInterceptor,
        {provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate'])},
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', ['removeTokenFromCookie', 'removeTenantIdFromCookie'])
        },
        {provide: HttpHandler, useValue: jasmine.createSpyObj('HttpHandler', ['handle'])}
      ]
    });

    interceptor = TestBed.inject(UnauthorizedInterceptor);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    httpHandler = TestBed.inject(HttpHandler);
  });

  it('should create UnauthorizedInterceptor', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should handle successful response', () => {
    const httpRequest = new HttpRequest<any>('GET', '/api');
    const httpResponse = new HttpResponse<any>({status: 200});
    (httpHandler.handle as jasmine.Spy).and.returnValue(of(httpResponse));
    interceptor.intercept(httpRequest, httpHandler).subscribe((event: HttpEvent<any>) => {
      expect(event).toBe(httpResponse);
    });
  });

  it('should handle unauthorized response and navigate to login', () => {
    const httpRequest = new HttpRequest<any>('GET', '/api');
    const httpErrorResponse = new HttpErrorResponse({
      error: {error: 'Unauthorized Error'},
      headers: new HttpHeaders(),
      status: 401,
      statusText: 'Unauthorized',
      url: ''
    });
    handleUnauthorizedResponse(httpRequest, httpHandler, httpErrorResponse);
  });
});
