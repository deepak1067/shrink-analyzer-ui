import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShrinkEventComponent } from './shrink-event.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CookieModule} from "ngx-cookie";
import { ShrinkVisibilityService } from 'src/app/core/services/shrink-visibility/shrink-visibility.service';
import { FilterChange, ShrinkEventsData } from '../shrink-visibility.model';
import { of } from 'rxjs';
import {DatePipe} from "@angular/common";
import { CommonService } from '../../../shared/services/common.service';

describe('ShrinkEventComponent', () => {
  let component: ShrinkEventComponent;
  let fixture: ComponentFixture<ShrinkEventComponent>;
  let shrinkVisibilityService: ShrinkVisibilityService;
  let commonService:CommonService

  let shrinkEventsData: ShrinkEventsData[] = [
    {
        "hour-of-day": 0,
        "shrink-event-count": 542,
        "bulk-event-count": 334,
        "sweetheart-count": 176
    },
    {
        "hour-of-day": 1,
        "shrink-event-count": 783,
        "bulk-event-count": 277,
        "sweetheart-count": 280
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        CookieModule.forRoot(),
      ],
      declarations: [ShrinkEventComponent],
      providers: [ShrinkVisibilityService, DatePipe,CommonService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ShrinkEventComponent);
    shrinkVisibilityService = TestBed.inject(ShrinkVisibilityService);
    commonService = TestBed.inject(CommonService);

    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(commonService, 'downloadFile');
    spyOn(commonService, 'downloadChartAsPDF');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDaysOfWeekData function', () => {
    spyOn(component,'getDaysOfWeekData');
    component.ngOnInit();
    expect(component.getDaysOfWeekData).toHaveBeenCalled();
  });

  it('should call getDaysOfWeekData function', () => {
    spyOn(commonService,'getRefreshClick').and.returnValue(of(true));
    spyOn(component,'getDaysOfWeekData');
    component.ngOnInit();
    expect(component.getDaysOfWeekData).toHaveBeenCalled();
  });

  it('should call getDaysOfWeekData function', () => {
    spyOn(shrinkVisibilityService,'getShrinkEventsByDay').and.returnValue(of(shrinkEventsData));
    component.getDaysOfWeekData();
    expect(component.shrinkEventData).toEqual(shrinkEventsData);
  });

  it('should get data for hours of the day', () => {
    spyOn(shrinkVisibilityService,'getHoursOfWeekData').and.returnValues(of(shrinkEventsData));
    component.getDataForHoursOfTheDay();
    expect(component).toBeTruthy();
  });

  it('should call daysOfWeekData function according to the tab', () => {
    spyOn(component,'getDaysOfWeekData');
    component.onTabChange(0);
    expect(component.getDaysOfWeekData).toHaveBeenCalled();
  });

  it('should call daysOfWeekData function according to the tab', () => {
    component.onTabChange(1);
    expect(component.shrinkEventData.length).toEqual(0);
  });

  it('should set the view type according to the button clicked', () => {
    const event = 'chart';
    component.onToggle(event)
    expect(component.viewType).toEqual('chart');
  });

  it('should call downloadChartAsPDF with correct parameters when viewType is chart', () => {
    const chartId = 'barChart';
    const fileName = 'Hours_of_the_Day';
    const startDate = '12-08-2020';
    const endDate = '12-06-2023';

    component.viewType = 'chart';
    component.barChartId = chartId;
    commonService.startDate = startDate;
    commonService.endDate = endDate;

    component.downloadFile('', 1);

    expect(commonService.downloadChartAsPDF).toHaveBeenCalledWith(
      chartId, fileName, startDate, endDate
    );
  });


  it('should set the chart id', () => {
    component.getChartId('barChart')
    expect(component.barChartId).toEqual('barChart');
  });

  it('should call getDaysOfWeekData if res is true and selectedTabId is 0', () => {
    spyOn(commonService, 'getRefreshClick').and.returnValue(of(true));
    spyOn(component, 'getDaysOfWeekData');
    component.selectedTabId = 0;
    component.ngOnInit();
    expect(component.getDaysOfWeekData).toHaveBeenCalled();
  });

  it('should call downloadFile with correct parameters when viewType is table', () => {
    component.viewType = 'table';
    component.shrinkEventsByDay = [{'day-of-week': 'Sunday', 'shrink-event-count': 10, 'bulk-event-count': 5, 'sweetheart-count': 3,},];

    commonService.startDate = '12-08-2020';
    commonService.endDate = '12-06-2023';

    component.downloadFile('', 0);

    expect(commonService.downloadFile).toHaveBeenCalledWith(
      [{'Day of Week': 'Sunday', 'Total Shrink Items': 10,         'Bulk Events': 5, 'Sweetheart': 3,},
      ], 'Day_of_the_Week', commonService.startDate, commonService.endDate
    );

    expect(commonService.downloadChartAsPDF).not.toHaveBeenCalled();
  });

  it('should call downloadFile with correct parameters when viewType is table', () => {
    component.viewType = 'table';
    component.shrinkEventsByHours = [{'hour-of-day': 0, 'shrink-event-count': 10, 'bulk-event-count': 5, 'sweetheart-count': 3,},];
    commonService.startDate = '12-08-2020';
    commonService.endDate = '12-06-2023';

    component.downloadFile('', 1);

    expect(commonService.downloadFile).toHaveBeenCalledWith(
      [{'Hours of Day': 0, 'Total Shrink Items': 10, 'Bulk Events': 5, 'Sweetheart': 3,},
      ], 'Hours_of_the_Day', commonService.startDate, commonService.endDate);
  });

  it('should call getDaysOfWeekData if applied is true and selectedTabId is 0', () => {
    const updateFilter:FilterChange = {
      applied: true,
      clearAction: false,
      pageUrl: '/dashboard'
  };
    spyOn(commonService, 'getFilterAppliedValue').and.returnValue(of(updateFilter));
    spyOn(component, 'getDaysOfWeekData');
    component.selectedTabId = 0;
    component.ngOnInit();
    expect(component.getDaysOfWeekData).toHaveBeenCalled();
  });

  it('should call getDataForHoursOfTheDay if clearAction is true and selectedTabId is not 0', () => {
    const updateFilter:FilterChange = {
      applied: false,
      clearAction: true,
      pageUrl: '/dashboard'
  };
    spyOn(commonService, 'getFilterAppliedValue').and.returnValue(of(updateFilter));
    spyOn(component, 'getDataForHoursOfTheDay');
    component.selectedTabId = 1;
    component.ngOnInit();
    expect(component.getDataForHoursOfTheDay).toHaveBeenCalled();
  });

  it('should not call getDaysOfWeekData or getDataForHoursOfTheDay if neither applied nor clearAction is true', () => {
    const updateFilter:FilterChange = {
      applied: false,
      clearAction: false,
      pageUrl: '/dashboard'
   };
    spyOn(commonService, 'getFilterAppliedValue').and.returnValue(of(updateFilter));
    spyOn(component, 'getDaysOfWeekData');
    spyOn(component, 'getDataForHoursOfTheDay');
    component.selectedTabId = 0;
    component.getFilterData();
    expect(component.getDaysOfWeekData).not.toHaveBeenCalled();
    expect(component.getDataForHoursOfTheDay).not.toHaveBeenCalled();
  });
});
