import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {AuthService} from '../services/auth.service';
import {of, throwError} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CookieModule, CookieService} from 'ngx-cookie';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        CookieModule.forRoot(),
      ],
      providers: [
        AuthGuard,
        AuthService,
        CookieService,
      ],
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should activate the route if token and tenantId are present in the cookie', async () => {
    spyOn(authService, 'getTokenFromCookie').and.returnValue('testToken');
    spyOn(authService, 'getTenantIdFromCookie').and.returnValue('testTenantId');
    spyOn(authService, 'verifyToken').and.returnValue(of({uid: 'testUid'}));
    spyOn(authService, 'saveInCookie');
    spyOn(router, 'navigateByUrl');

    const canActivate = await guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(canActivate).toBeTrue();
    expect(authService.getTokenFromCookie).toHaveBeenCalled();
    expect(authService.getTenantIdFromCookie).toHaveBeenCalled();
    expect(authService.verifyToken).toHaveBeenCalledWith('testToken', 'testTenantId');
    expect(authService.saveInCookie).toHaveBeenCalledWith('uid', 'testUid');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should remove token and tenantId from cookie and navigate to "/" if token verification fails', async () => {
    spyOn(authService, 'getTokenFromCookie').and.returnValue(null);
    spyOn(authService, 'getTenantIdFromCookie').and.returnValue(null);
    spyOn(router, 'navigateByUrl');

    const canActivate = await guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(canActivate).toBeFalse();
    expect(authService.getTokenFromCookie).toHaveBeenCalled();
    expect(authService.getTenantIdFromCookie).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should remove token and tenantId from cookie and navigate to "/" if token verification throws an error', async () => {
    spyOn(authService, 'getTokenFromCookie').and.returnValue('testToken');
    spyOn(authService, 'getTenantIdFromCookie').and.returnValue('testTenantId');
    spyOn(authService, 'verifyToken').and.returnValue(throwError('Token verification error'));
    spyOn(authService, 'removeTokenFromCookie');
    spyOn(authService, 'removeTenantIdFromCookie');
    spyOn(router, 'navigateByUrl');

    const canActivate = await guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(canActivate).toBeFalse();
    expect(authService.getTokenFromCookie).toHaveBeenCalled();
    expect(authService.getTenantIdFromCookie).toHaveBeenCalled();
    expect(authService.verifyToken).toHaveBeenCalledWith('testToken', 'testTenantId');
    expect(authService.removeTokenFromCookie).toHaveBeenCalled();
    expect(authService.removeTenantIdFromCookie).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
