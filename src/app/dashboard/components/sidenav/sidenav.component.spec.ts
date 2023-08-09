import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  class MockRouter {
    public event = new NavigationEnd(0, 'http://localhost:4200/dashboard', 'http://localhost:4200/bulk-shrink-events');
    public events = new Observable(observer => {
      observer.next(this.event);
      observer.complete();
    });
    public url = '/dashboard'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidenavComponent],
      providers: [
        RouterTestingModule,
        { provide: ComponentFixtureAutoDetect, useValue: false },
        {
          provide: Router,
          useClass: MockRouter
       } 
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resize the content margin to 240 when isMenuOpen is true', () =>{
    component.isMenuOpen = true;
    component.contentMargin = 70;
    component.onToolbarMenuToggle()
    expect(component.contentMargin).toEqual(70);
  });

  it('should resize the content margin to 70 when isMenuOpen is false', () =>{
    component.isMenuOpen = false;
    component.contentMargin = 240;
    component.onToolbarMenuToggle()
    expect(component.contentMargin).toEqual(240);
  });

  it('should return true for active route', () =>{
    const result = component.checkRouteActive('/dashboard');
    expect(result).toEqual(true);
  });
});
