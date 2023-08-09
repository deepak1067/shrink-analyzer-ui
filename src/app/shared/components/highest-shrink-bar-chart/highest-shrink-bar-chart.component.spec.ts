import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Router} from '@angular/router';
import * as Highcharts from 'highcharts';
import {HighestShrinkBarChartComponent} from './highest-shrink-bar-chart.component';
import {SiteApiResponseService} from '../../../core/services/site-api-response.service';
import {of} from 'rxjs';
import {ShrinkBySites} from "../../../modules/shrink-visibility/shrink-visibility.model";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CookieModule, CookieService} from "ngx-cookie";
import {DatePipe} from "@angular/common";

describe('HighestShrinkBarChartComponent', () => {
  let component: HighestShrinkBarChartComponent;
  let fixture: ComponentFixture<HighestShrinkBarChartComponent>;
  let testData: ShrinkBySites[] = [
    {
      'site-code': 'SiteCode1',
      'shrink-event-count': 10,
      'shrink-item-ratio': 0.5,
      'bulk-event-ratio': 0.2,
      'shrink-event-trend': 42
    },
    {
      'site-code': 'SiteCode2',
      'shrink-event-count': 15,
      'shrink-item-ratio': 0.8,
      'bulk-event-ratio': 0.3,
      'shrink-event-trend': 89
    },
  ];

  beforeEach(async () => {
    const routerStub = jasmine.createSpyObj('Router', ['navigate']);

    const siteApiResponseServiceStub = {
      getSiteNameBySiteCode: jasmine.createSpy('getSiteNameBySiteCode').and.returnValue(of('Site Name 1'))
    };

    await TestBed.configureTestingModule({
      declarations: [HighestShrinkBarChartComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        CookieModule.forRoot(),
      ],
      providers: [
        CookieService,
        DatePipe,
        {provide: Router, useValue: routerStub},
        {provide: SiteApiResponseService, useValue: siteApiResponseServiceStub},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighestShrinkBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the chart when barChartData has data', fakeAsync(() => {
    spyOn(component, 'createChartColumn');
    component.barChartData = testData;
    component.ngOnChanges();
    tick();
    expect(component.createChartColumn).toHaveBeenCalled();
  }));

  it('should not create the chart when barChartData is empty', () => {
    spyOn(component, 'createChartColumn');
    component.barChartData = [];
    component.ngOnChanges();
    expect(component.createChartColumn).not.toHaveBeenCalled();
  });

  it('should create the chart with correct configurations', () => {
    spyOn(Highcharts, 'chart');
    component.barChartData = testData;
    component.createChartColumn();
    expect(Highcharts.chart).toHaveBeenCalled();
  });

  it('should navigate to the specified page when clicking on a data point', () => {
    const router = TestBed.inject(Router);
    component.navigateToPage('SiteCode1', 10, 'Total Shrink Items');
    expect(router.navigate).toHaveBeenCalledWith(['dashboard/rfid-exit-read'], { queryParams: {['site-code']: 'SiteCode1'}});
  });

  it('should not navigate when data is not "Total Shrink Items"', () => {
    const router = TestBed.inject(Router);
    component.navigateToPage('SiteCode1', 10, 'Other Data');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
