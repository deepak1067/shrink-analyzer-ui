import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthVerifyComponent} from './auth-verify.component';
import {of, Subject} from "rxjs";
import { HttpClientModule } from '@angular/common/http';
import { CookieModule } from 'ngx-cookie';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

describe('AuthVerifyComponent', () => {
  let component: AuthVerifyComponent;
  let fixture: ComponentFixture<AuthVerifyComponent>;
  let authService: AuthService;
  let router = jasmine.createSpyObj('Router', ['navigateByUrl'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, CookieModule.forRoot(), HttpClientModule],
      declarations: [AuthVerifyComponent],
      providers: [AuthService]
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthVerifyComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    spyOn(authService, 'getTokenFromCookie').and.returnValue('testToken');
    spyOn(authService, 'getTenantIdFromCookie').and.returnValue('testTenantId');
    spyOn(component, 'loginSSO');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should handle NavigationEnd event with UUID, tenantId, and userId', () => {
    const event = new NavigationEnd(1, '/test?uuid=testUUID&tenant=testTenant&userid=testUser', '/test');
    component.UUID = null;
    component.tenantId = null;
    component.userId = null;
    spyOn(router, 'navigateByUrl');
    const routerEventsSubject = new Subject();
    component.subscription = routerEventsSubject.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        component.UUID = component.getParameterByName('uuid', event.url);
        component.userId = component.getParameterByName('userid', event.url);
        component.tenantId = component.getParameterByName('tenant', event.url);

        if (!(!component.UUID || !component.tenantId || !component.userId)) {
          const url = `/auth-process/${component.userId}/${component.tenantId}/${component.UUID}`;
          router.navigateByUrl(url);
        }
      }
    });

    routerEventsSubject.next(event);
    expect(component.UUID).not.toEqual(null);
    expect(component.tenantId).not.toEqual(null);
    expect(component.userId).not.toEqual(null);
    expect(component.loginSSO).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/auth-process/testUser/testTenant/testUUID`);
    component.subscription.unsubscribe();
  });


  it('should get parameter by name from URL', () => {
    const url = 'https://www.testurl.com/test?param1=value1&param2=value2';
    const result = component.getParameterByName('param2', url);
    expect(result).toBe('value2');
  });

  it('should get null when parameter is not found in URL', () => {
    const url = 'https://www.testurl.com/test?param1=value1&param2=value2';
    const result = component.getParameterByName('param3', url);
    expect(result).toBeNull();
  });

  it('should get empty string when parameter is found in URL but has no value', () => {
    const url = 'https://www.testurl.com/test?param1=value1&param2';
    const result = component.getParameterByName('param2', url);
    expect(result).toBe('');
  });

  it('should unsubscribe on component destroy', () => {
    component.subscription = of().subscribe();
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should navigate to dashboard if UUID, userId are missing and token and tenantId are present in cookie', () => {
    spyOn(component, 'getParameterByName').and.returnValue(null);
    spyOn(router, 'navigateByUrl');

    const navigationEnd = new NavigationEnd(1, '/testUrl', '/testUrlRedirect');
    router.events.next(navigationEnd); // Emit the NavigationEnd event
    expect(component.UUID).toBeNull();
    expect(component.userId).toBeNull();
    expect(component.tenantId).not.toBeNull();
    expect(component.loginSSO).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });
});
