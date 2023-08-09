import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {ShrinkBarChartComponent} from './shrink-bar-chart.component';
import * as Highcharts from 'highcharts';
import {ShrinkEventsData} from 'src/app/modules/shrink-visibility/shrink-visibility.model';

describe('ShrinkBarChartComponent', () => {
  let component: ShrinkBarChartComponent;
  let fixture: ComponentFixture<ShrinkBarChartComponent>;
  let router: Router;

  const mockBarChartData: ShrinkEventsData[] = [
    {'day-of-week': 0, 'shrink-event-count': 10, 'bulk-event-count': 5, 'sweetheart-count': 3},
    {'day-of-week': 1, 'shrink-event-count': 5, 'bulk-event-count': 8, 'sweetheart-count': 2},
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ShrinkBarChartComponent],
      providers: [Router],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShrinkBarChartComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create chart column when barChartData has data', () => {
    component.barChartData = mockBarChartData;
    spyOn(Highcharts, 'chart');
    component.ngOnChanges();
    expect(Highcharts.chart).toHaveBeenCalled();
  });

  it('should not create chart column when barChartData is empty', () => {
    spyOn(Highcharts, 'chart');
    component.ngOnChanges();
    expect(Highcharts.chart).not.toHaveBeenCalled();
  });

  it('should create chart column when barChartData has data', () => {
    spyOn(Highcharts, 'chart');
    component.barChartData = mockBarChartData;
    component.ngOnChanges();
    expect(Highcharts.chart).toHaveBeenCalled();
  });


  it('should navigate to the appropriate page when calling navigateToPage for SWEETHEART', () => {
    spyOn(router, 'navigate');
    component.navigateToPage('Monday', 3, 'SWEETHEART');
    expect(router.navigate).toHaveBeenCalledWith(['dashboard/rfid-exit-read'],{ queryParams: {day: 'Monday', sweetheart: 3}});
  });


  it('should navigate to the appropriate page when calling navigateToPage for TOTAL SHRINK ITEMS', () => {
    spyOn(router, 'navigate');
    component.navigateToPage('Monday', 0, 'TOTAL SHRINK ITEMS');
    expect(router.navigate).toHaveBeenCalledWith(['dashboard/rfid-exit-read'],{ queryParams: {day: 'Monday', totalShrinkItem: 0}});
  });

  it('should navigate to the appropriate page when calling navigateToPage for BULK EVENTS', () => {
     spyOn(router, 'navigate');
    component.navigateToPage('Wednesday', 0, 'BULK EVENTS');
    expect(router.navigate).toHaveBeenCalledWith(['dashboard/bulk-shrink-events'],{ queryParams: {day: 'Wednesday', bulkEvent: 0}});
  });
});
