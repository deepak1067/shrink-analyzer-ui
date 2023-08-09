import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart} from '@angular/router';
import {AppComponent} from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading set to false', () => {
    expect(component.loading).toBeFalse();
  });

  it('should set loading to true on NavigationStart event', () => {
    const event = new NavigationStart(1, 'test-url');
    component.navigationInterceptor(event);
    expect(component.loading).toBeTrue();
  });

  it('should set loading to false on NavigationEnd event', () => {
    const event = new NavigationEnd(1, 'test-url', 'test-url');
    component.navigationInterceptor(event);
    expect(component.loading).toBeFalse();
  });

  it('should set loading to false on NavigationCancel event', () => {
    const event = new NavigationCancel(1, 'test-url', 'Reason');
    component.navigationInterceptor(event);
    expect(component.loading).toBeFalse();
  });

  it('should set loading to false on NavigationError event', () => {
    const event = new NavigationError(1, 'test-url', 'Error');
    component.navigationInterceptor(event);
    expect(component.loading).toBeFalse();
  });
});
