import {Component, OnDestroy} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-auth-verify',
  templateUrl: './auth-verify.component.html',
  styleUrls: ['./auth-verify.component.scss']
})
export class AuthVerifyComponent implements OnDestroy {

  token!: string | null;
  UUID!: string | null;
  userId!: string | null;
  tenantId!: string | null;
  subscription!: Subscription;

  constructor(private authService: AuthService, public router: Router) {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.UUID = this.getParameterByName('uuid', event.url);
        this.userId = this.getParameterByName('userid', event.url);
        this.tenantId = this.getParameterByName('tenant', event.url);

        if (!this.UUID || !this.tenantId || !this.userId) {
          // fetch token and tenant id from cookie
          this.token = this.authService.getTokenFromCookie();
          this.tenantId = this.authService.getTenantIdFromCookie();

          // if token or tenantId is not present in cookie then navigate user to sso login
          if (!this.token || !this.tenantId) {
            this.loginSSO();
          } else {
            this.router.navigateByUrl('/dashboard');
          }
        } else {
          const url = `/auth-process/${this.userId}/${this.tenantId}/${this.UUID}`;
          this.router.navigateByUrl(url);
        }
      }
    });
  }

  loginSSO() {
    this.authService.loginSSO();
  }

  getParameterByName(name: string, url = window.location.href) {
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
