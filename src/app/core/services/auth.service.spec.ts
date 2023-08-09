import {AuthService} from './auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {SiteApiResponseService} from './site-api-response.service';
import {environment} from '../../../environments/environment';
import {Site} from "../../shared/interface/Site";

describe('AuthService', () => {
  let authService: AuthService;
  let httpClient: HttpClient;
  let cookieService: CookieService;
  let router: Router;
  let siteApiResponseService: SiteApiResponseService;

  beforeEach(() => {
    httpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    cookieService = jasmine.createSpyObj('CookieService', ['get', 'put', 'remove', 'removeAll']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    siteApiResponseService = jasmine.createSpyObj('SiteApiResponseService', ['setSiteData']);

    authService = new AuthService(httpClient, cookieService, router, siteApiResponseService);
    authService.domain = 'https://www.example.com/api';
  });

  it('should create AuthService', () => {
    expect(authService).toBeTruthy();
  });

  it('should get token from cookie', () => {
    (cookieService.get as jasmine.Spy).and.returnValue('token123');
    const result = authService.getTokenFromCookie();
    expect(result).toBe('token123');
    expect(cookieService.get).toHaveBeenCalledWith('token');
  });

  it('should return null if token is not found in cookie', () => {
    (cookieService.get as jasmine.Spy).and.returnValue('');
    const result = authService.getTokenFromCookie();
    expect(result).toBeNull();
    expect(cookieService.get).toHaveBeenCalledWith('token');
  });

  it('should remove token from cookie', () => {
    authService.removeTokenFromCookie();
    expect(cookieService.remove).toHaveBeenCalledWith('token');
  });

  it('should save token in cookie', () => {
    const token = 'token123';
    authService.saveTokenInCookie(token);
    expect(cookieService.put).toHaveBeenCalledWith('token', token);
    expect(cookieService.put).toHaveBeenCalledTimes(1);
  });

  it('should return null if token is empty when saving in cookie', () => {
    const token = '';
    const result = authService.saveTokenInCookie(token);
    expect(result).toBeNull();
    expect(cookieService.put).toHaveBeenCalledTimes(0);
  });

  it('should get tenant ID from cookie', () => {
    (cookieService.get as jasmine.Spy).and.returnValue('tenantId123');
    const result = authService.getTenantIdFromCookie();
    expect(result).toBe('tenantId123');
    expect(cookieService.get).toHaveBeenCalledWith('tenantId');
  });

  it('should return null if tenant ID is not found in cookie', () => {
    (cookieService.get as jasmine.Spy).and.returnValue('');
    const result = authService.getTenantIdFromCookie();
    expect(result).toBeNull();
    expect(cookieService.get).toHaveBeenCalledWith('tenantId');
  });

  it('should remove tenant ID from cookie', () => {
    authService.removeTenantIdFromCookie();
    expect(cookieService.remove).toHaveBeenCalledWith('tenantId');
  });

  it('should save value in cookie', () => {
    authService.saveInCookie('key', 'value');
    expect(cookieService.put).toHaveBeenCalledWith('key', 'value');
  });

  it('should not save a value in the cookie if the key or value is empty', () => {
    authService.saveInCookie('', '');
    expect(cookieService.put).not.toHaveBeenCalled();
  });

  it('should get value from cookie when key is provided', () => {
    (cookieService.get as jasmine.Spy).and.returnValue('value123');
    const result = authService.getFromCookie('key');
    expect(result).toBe('value123');
    expect(cookieService.get).toHaveBeenCalledWith('key');
  });

  it('should return undefined when key is not provided in getFromCookie', () => {
    const result = authService.getFromCookie('');
    expect(result).toBeUndefined();
    expect(cookieService.get).not.toHaveBeenCalled();
  });

  it('should remove value from cookie when key is provided', () => {
    authService.removeFromCookie('key');
    expect(cookieService.remove).toHaveBeenCalledWith('key');
  });

  it('should not remove value from cookie when key is not provided in removeFromCookie', () => {
    authService.removeFromCookie('');
    expect(cookieService.remove).not.toHaveBeenCalled();
  });

  it('should navigate to home page when saveTenantInCookies encounters an error', (done) => {
    (httpClient.get as jasmine.Spy).and.returnValue(throwError('Error'));
    authService.saveTenantDetailsInCookie();
    const expectedUrl = `${authService.domain}${environment.api.routes.tenants.getTenant}?key=${environment.api.routes.apis.dataKey}`;
    expect(httpClient.get).toHaveBeenCalledWith(expectedUrl, jasmine.any(Object));
    expect(cookieService.put).not.toHaveBeenCalled();
    setTimeout(() => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('/api-error');
      done();
    }, 0);
  });

  it('should return null if tenant ID is empty when saving in cookie', () => {
    const tenantId = '';
    const result = authService.saveTenantIdInCookie(tenantId);
    expect(result).toBeNull();
    expect(cookieService.put).toHaveBeenCalledTimes(0);
  });

  it('should get Authorization headers', () => {
    const mockToken = 'token123';
    const mockTenantId = 'tenantId123';
    (cookieService.get as jasmine.Spy).and.returnValue(mockToken);
    (cookieService.get as jasmine.Spy).withArgs('tenantId').and.returnValue(mockTenantId);
    const expectedHeaders = new HttpHeaders()
      .set('Authorization', `Bearer ${mockToken}`)
      .set('tenant', mockTenantId);
    const result = authService.getAuthHttpOptions();
    expect(result.headers).toEqual(expectedHeaders);
  });

  it('should fetch user information', () => {
    const mockToken = 'token123';
    const mockResponse = {name: 'John Doe'};
    (cookieService.get as jasmine.Spy).and.returnValue(mockToken);
    (httpClient.post as jasmine.Spy).and.returnValue(of(mockResponse));
    authService.fetchUserInformation().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(httpClient.post).toHaveBeenCalledWith(`${authService.SSOUrl}/v1/api/user/info`, {token: mockToken});
    });
  });

  it('should return null when token is not provided in fetchUserInformation', () => {
    spyOn(authService, 'getTokenFromCookie').and.returnValue(null);

    authService.fetchUserInformation().subscribe((response) => {
      expect(response).toBeNull();
      expect(authService.getTokenFromCookie).toHaveBeenCalled();
      expect(httpClient.post).not.toHaveBeenCalled();
    });
  });

  it('should clear all cookies', () => {
    authService.clearAllCookies();
    expect(cookieService.removeAll).toHaveBeenCalled();
  });

  it('should return null when token is not provided in verifyToken', () => {
    const result = authService.verifyToken('', 'tenantId').toPromise();
    result.then((response) => {
      expect(response).toBeNull();
      expect(httpClient.post).not.toHaveBeenCalled();
    });
  });

  it('should call httpClient.post with the correct URL and payload in verifyToken', () => {
    const token = 'token123';
    const tenantId = 'tenantId123';
    const expectedUrl = `${authService.SSOUrl}${environment.api.routes.auth.verifyToken}`;
    const expectedPayload = {token: token, tenantId: tenantId};
    (httpClient.post as jasmine.Spy).and.returnValue(of({}));
    const result = authService.verifyToken(token, tenantId).toPromise();
    result.then(() => {
      expect(httpClient.post).toHaveBeenCalledWith(expectedUrl, expectedPayload);
    });
  });

  it('should fetch token from SSO server', () => {
    const UUID = '0a8B7294-3a19-40aa-a3fe-43a129ACf376';
    const url = authService.SSOUrl + '' + environment.api.routes.auth.fetchToken + '/' + encodeURIComponent(UUID);
    const response = {token: 'abc123'};
    (httpClient.get as jasmine.Spy).and.returnValue(of(response));
    authService.fetchTokenFromSSOServer(UUID).subscribe((result) => {
      expect(result).toEqual(response);
      expect(httpClient.get).toHaveBeenCalledWith(url);
    });
  });

  it('should return null when UUID is not provided in fetchTokenFromSSOServer', () => {
    const result = authService.fetchTokenFromSSOServer('');
    expect(result).toBeInstanceOf(Observable);
    expect(httpClient.get).not.toHaveBeenCalled();
  });

  it('should set site data when calling getSiteData', () => {
    const tenantId = 'tenant123';
    const sites: Site[] = [
      {
        code: 'site1',
        name: 'Site 1',
        timezone: 'UTC',
        'geo-location': {
          hierarchy: 'Country > City',
          coordinates: {latitude: 51.5074, longitude: -0.1278}
        },
        labels: ['Label 1', 'Label 2'],
        'exit-doors': [
          {id: 1, name: 'Exit Door 1'},
          {id: 2, name: 'Exit Door 2'}
        ]
      },
      {
        code: 'site2',
        name: 'Site 2',
        timezone: 'UTC',
        'geo-location': {
          hierarchy: 'Country > City',
          coordinates: {latitude: 40.7128, longitude: -74.006}
        },
        labels: ['Label 3', 'Label 4'],
        'exit-doors': [
          {id: 3, name: 'Exit Door 3'},
          {id: 4, name: 'Exit Door 4'}
        ]
      }
    ];
    (cookieService.get as jasmine.Spy).and.returnValue(tenantId);
    (httpClient.get as jasmine.Spy).and.returnValue(of(sites));

    authService.getSiteData();

    expect(cookieService.get).toHaveBeenCalledWith('resTenantId');
    expect(siteApiResponseService.setSiteData).toHaveBeenCalledWith(sites);
  });
});
