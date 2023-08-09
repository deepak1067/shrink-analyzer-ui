import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ShrinkTabBarComponent} from './shrink-tab-bar.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {RouterModule} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

describe('ShrinkTabBarComponent', () => {
  let component: ShrinkTabBarComponent;
  let fixture: ComponentFixture<ShrinkTabBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShrinkTabBarComponent],
      imports: [RouterTestingModule, RouterModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShrinkTabBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct shrink tabs', () => {
    const expectedTabs = [
      {id: 0, tabName: 'Shrink Events', url: '/dashboard'},
      {id: 1, tabName: 'Shrink by Rollup', url: '/dashboard/shrink-by-roll-up'},
      {id: 2, tabName: 'Highest Shrink by Sites', url: '/dashboard/highest-shrink-by-site'},
    ];
    expect(component.shrinkTabs).toEqual(expectedTabs);
  });
});
