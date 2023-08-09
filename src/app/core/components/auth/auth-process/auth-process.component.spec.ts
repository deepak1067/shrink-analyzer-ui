import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthProcessComponent } from './auth-process.component';
import { AuthService } from 'src/app/core/services/auth.service';


describe('AuthProcessComponent', () => {
  let component: AuthProcessComponent;
  let fixture: ComponentFixture<AuthProcessComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    const activatedRouteStub = {
      params: of({ uuid: 'mockUuid', userid: 'mockUserId', tenantId: 'mockTenantId' })
    };
    const authServiceStub = {
      saveTenantIdInCookie: jasmine.createSpy('saveTenantIdInCookie'),
      fetchTokenFromSSOServer: jasmine.createSpy('fetchTokenFromSSOServer').and.returnValue(of({ idToken: 'mockToken' })),
      saveTokenInCookie: jasmine.createSpy('saveTokenInCookie').and.returnValue(true),
      saveTenantDetailsInCookie: jasmine.createSpy('saveTenantInCookies')
    };
    const routerStub = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    await TestBed.configureTestingModule({
      declarations: [AuthProcessComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: routerStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthProcessComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should save tenant ID in cookie', () => {
    component.ngOnInit();
    const mockTenantId = 'mockTenantId';
    component.tenantId = mockTenantId;
    fixture.detectChanges();
    expect(authService.saveTenantIdInCookie).toHaveBeenCalledWith(mockTenantId);
  });

  it('should fetch token from SSO server and navigate to dashboard', () => {
    component.ngOnInit();
    expect(authService.fetchTokenFromSSOServer).toHaveBeenCalledWith('mockUuid');
    expect(authService.saveTokenInCookie).toHaveBeenCalledWith('mockToken');
    expect(authService.saveTenantDetailsInCookie).toHaveBeenCalled();
  });
});
