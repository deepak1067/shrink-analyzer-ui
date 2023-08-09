import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {finalize, Observable, of, Subject, takeUntil} from 'rxjs';
import {environment} from 'src/environments/environment';
import {retry} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Site} from "../../shared/interface/Site";
import {SiteApiResponseService} from "./site-api-response.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    SSOUrl = environment.ssoApiUrl;
    domain = environment.api.baseUrl;
    resTenantId: string = "";
    resTenantName: string = "";

  private destroy$ = new Subject<void>();

  constructor(private httpClient: HttpClient, private cookieService: CookieService, private router: Router,
              private siteApiResponseService: SiteApiResponseService) {
  }

  /**
   * return token stored in cookie
   */
  getTokenFromCookie(): string | null{
    const token = this.cookieService.get('token');
    if (token && token.trim() !== '') {
      return token;
    }
    return null;
  }

  /**
   * return token stored in cookie
   */
  removeTokenFromCookie(): void {
    this.cookieService.remove('token');
  }

  saveTokenInCookie(token: string): string | null {
    if (token && token.trim() !== '') {
      this.cookieService.put('token', token);
      return token;
    }
    return null;
  }

  /**
   * return tenant id from local cookie
   */
  getTenantIdFromCookie(): string | null{
    const tenantId = this.cookieService.get('tenantId');
    if (tenantId && tenantId.trim() !== '') {
      return tenantId;
    }
    return null;
  }

  /**
   * remove tenant id from local cookie
   */
  removeTenantIdFromCookie(): void {
    this.cookieService.remove('tenantId');
  }

  saveInCookie(key: string, value: string) {
    if (!key && !value) {
      return;
    }
    this.cookieService.put(key, value);
  }

  getFromCookie(key: string) {
    if (!key) {
      return;
    }
    return this.cookieService.get(key);
  }

  removeFromCookie(key: string) {
    if (!key) {
      return;
    }
    this.cookieService.remove(key);
  }

  saveTenantIdInCookie(tenantId: string): string | null{
    if (tenantId && tenantId.trim() !== '') {
      this.cookieService.put('tenantId', tenantId);
      return tenantId;
    }
    return null;
  }

    saveTenantDetailsInCookie() {
        const url = `${this.domain}${environment.api.routes.tenants.getTenant}?key=${environment.api.routes.apis.dataKey}`;
        let time = new Date().getTime() / 1000;

        this.httpClient.get(url, this.getAuthHttpOptions())
            .pipe(takeUntil(this.destroy$),
                finalize(() => {
                        this.destroy$.next();
                        this.destroy$.complete();
                    }
                ))
            .subscribe({
                next: (response: any) => {
                    this.resTenantId = response.id;
                    this.resTenantName = response.name;
                    this.saveInCookie('resTenantId', this.resTenantId);
                    this.saveInCookie('resTenantName', this.resTenantName);

                    console.log("TenantId: " + this.resTenantId + " Time taken for tenant API retrieval is " +
                        ((new Date().getTime() / 1000) - time) + "seconds");

                    this.getSiteData();
                },
                error: (err) => {
                  console.log(err);
                  this.router.navigateByUrl('/api-error');
                }
            });
    }

    getSiteData() {
        const tenantId = this.cookieService.get('resTenantId');
        let url: string;

        if (environment.useDataKey) {
          url = `${this.domain}${environment.api.routes.apis.sites}?tenant-id=${tenantId}&key=${environment.api.routes.apis.dataKey}`;
        } else {
          url = 'assets/data/sitesData.json';
        }

        let time = new Date().getTime() / 1000;

        this.httpClient.get<Site[]>(url, this.getAuthHttpOptions())
            .subscribe({
                next:
                    (res) => {
                        let size = this.siteApiResponseService.setSiteData(res);

                        if (size > 0) {
                            this.router.navigateByUrl('/dashboard');
                        } else {
                            this.router.navigateByUrl('/');
                        }
                        console.log("TenantId: " + tenantId + " Time taken for SITE API retrieval is " +
                            ((new Date().getTime() / 1000) - time) + "seconds");
                    },
                error: (err) => {
                    console.error(err);
                }
            });
    }

  /**
   *
   * @param token
   * funtion verfies the token at server
   * @param tenantId
   */
  verifyToken(token: string, tenantId: string): Observable<any> {
    if (!token || token.trim() === '') {
      return of(null);
    }
    const url = `${this.SSOUrl}${environment.api.routes.auth.verifyToken}`;

    // Request payload
    const payload = {
      token: token,
      tenantId: tenantId
    };

    return this.httpClient.post(url, payload).pipe(
      retry(1) // retry a failed request
    );
  }

    fetchTokenFromSSOServer(uuid: string): Observable<any> {
        if (!uuid || uuid.trim() === '' || !this.isValidUUID(uuid)) {
            return of(null);
        }
        const url = this.SSOUrl + '' + environment.api.routes.auth.fetchToken + '/' + encodeURIComponent(uuid);
        return this.httpClient.get(url);
    }

    isValidUUID(uuid: string): boolean {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

  /**
   * fetch the token from sso server
   */
  loginSSO(): void {
    let origin = `${location.origin}/#/`;

    const encodedComponent = encodeURIComponent(origin);
    window.location.href = `${this.SSOUrl}${environment.api.routes.auth.validate}?userid=${null}
    &redirecturl=${encodedComponent}&appId=shrinkanalyzer`;
  }

  getAuthHttpOptions(): { headers: HttpHeaders } {
    const authToken = this.getTokenFromCookie();
    const tenantId = this.getTenantIdFromCookie()?? '';;
    const bearerToken = `Bearer ${authToken}`;
    const headers = new HttpHeaders()
      .set('Authorization', bearerToken)
      .set('tenant', tenantId);
    return {
      headers
    };
  }

  fetchUserInformation(): Observable<any> {
    const url = `${this.SSOUrl}${environment.api.routes.user.fetch}`;
    const token = this.getTokenFromCookie();
    if (!token) {
      return of(null);
    }
    const payload = {
      token: token
    };
    return this.httpClient.post(url, payload);
  }

  /**
   * remove all cookies from
   */
  clearAllCookies() {
    this.cookieService.removeAll();
  }

  logout() {

    // fetch user id from cookie before deleting it.
    this.getFromCookie('uid');
    
    // remove all cookies from local browser
    this.clearAllCookies();
    localStorage.clear();
    let origin = `${location.origin}/#/`;

    // call api to remove cookie from server
    const encodedComponent = encodeURIComponent(origin);
    // redirect logout to sso server
    window.location.href = `${this.SSOUrl}${environment.api.routes.auth.deleteToken}?userid=${null}
    &redirecturl=${encodedComponent}`;
    }
}
