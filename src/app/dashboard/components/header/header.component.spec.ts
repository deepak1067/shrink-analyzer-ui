import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeaderComponent, UserInfo} from './header.component';
import {AuthService} from 'src/app/core/services/auth.service';
import {of, throwError} from 'rxjs';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CookieModule, CookieService} from "ngx-cookie";
import {AuthGuard} from "../../../core/guards/auth.guard";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import { MaterialModule } from 'src/app/shared/module/material.module';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        MaterialModule,
        RouterTestingModule,
        HttpClientTestingModule,
        CookieModule.forRoot(),
      ],
      providers: [
        AuthGuard,
        AuthService,
        CookieService,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    authService = TestBed.inject(AuthService)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userInfo with default values', () => {
    expect(component.userInfo).toEqual({
      email: '',
      customAttributes: [],
      lastLoginAt: '',
      displayName: '',
    });
  });

  it('should fetch user information on ngOnInit', () => {
    const mockUserInformation: UserInfo = {
      email: 'test@example.com',
      customAttributes: [],
      lastLoginAt: '2023-01-01',
      displayName: 'John Doe',
    };

    spyOn(authService, 'fetchUserInformation').and.returnValue(of(mockUserInformation));
    spyOn(authService, 'saveInCookie');
    spyOn(authService, 'getFromCookie').and.returnValue(JSON.stringify(mockUserInformation));
    component.ngOnInit();
    expect(authService.fetchUserInformation).toHaveBeenCalled();
    expect(authService.saveInCookie).toHaveBeenCalledWith('uinfo', JSON.stringify(mockUserInformation));
    expect(authService.getFromCookie).toHaveBeenCalledWith('uinfo');
    expect(component.userInfo).toEqual(mockUserInformation);
  });

  it('should handle error on user information fetch', () => {
    spyOn(authService, 'fetchUserInformation').and.returnValue(throwError('Error fetching user information'));
    spyOn(console, 'log');
    component.ngOnInit();
    expect(authService.fetchUserInformation).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Error fetching user information');
  });

  it('should return short name from full name', () => {
    const fullName = 'John Doe';
    const shortName = component.getShortName(fullName);
    expect(shortName).toBe('JD');
  });

  it('should call logout method in AuthService', () => {
    spyOn(authService, 'logout');
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
